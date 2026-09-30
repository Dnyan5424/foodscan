from __future__ import annotations

import argparse
import json

import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score

from food_registry import FOODS, get_dataset_path, get_training_artifact_paths


IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
MIN_CLASS_IMAGES = 10


def class_sort_key(name: str) -> tuple[int, int | str]:
    if name.isdigit():
        return 0, int(name)
    return 1, name.casefold()


def load_samples(dataset_dir) -> tuple[list[str], list[int], list[str]]:
    if not dataset_dir.is_dir():
        raise FileNotFoundError(f'Dataset folder not found: {dataset_dir}')

    class_dirs = sorted(
        (path for path in dataset_dir.iterdir() if path.is_dir() and not path.name.startswith('.')),
        key=lambda path: class_sort_key(path.name),
    )
    if len(class_dirs) < 2:
        raise ValueError(f'Add at least two labeled class folders under {dataset_dir}.')

    paths: list[str] = []
    labels: list[int] = []
    class_names = [path.name for path in class_dirs]

    for label, class_dir in enumerate(class_dirs):
        images = sorted(
            path for path in class_dir.rglob('*')
            if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
        )
        if len(images) < MIN_CLASS_IMAGES:
            raise ValueError(
                f'Class "{class_dir.name}" has {len(images)} images; '
                f'at least {MIN_CLASS_IMAGES} are required for train/validation/test splits.'
            )
        paths.extend(str(path) for path in images)
        labels.extend([label] * len(images))

    return paths, labels, class_names


def build_model(num_classes: int) -> tf.keras.Model:
    base_model = tf.keras.applications.MobileNetV3Small(
        include_top=False,
        weights='imagenet',
        input_shape=(224, 224, 3),
        pooling='avg',
    )
    base_model.trainable = False

    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = tf.keras.applications.mobilenet_v3.preprocess_input(inputs)
    x = base_model(x, training=False)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)

    model = tf.keras.Model(inputs, outputs)
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy'],
    )
    return model


def make_dataset(paths: list[str], labels: list[int], *, training: bool, augmentation=None):
    dataset = tf.data.Dataset.from_tensor_slices((paths, labels))
    if training:
        dataset = dataset.shuffle(len(paths), seed=42, reshuffle_each_iteration=True)

    def load_image(path, label):
        image = tf.io.decode_image(
            tf.io.read_file(path),
            channels=3,
            expand_animations=False,
        )
        image.set_shape((None, None, 3))
        image = tf.image.resize(image, IMAGE_SIZE)
        if training and augmentation is not None:
            image = augmentation(image, training=True)
        return image, label

    return (
        dataset
        .map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
        .batch(BATCH_SIZE)
        .prefetch(tf.data.AUTOTUNE)
    )


def main() -> None:
    parser = argparse.ArgumentParser(description='Train a FOODGUARD image model for one food.')
    parser.add_argument('--food', choices=sorted(FOODS), default='turmeric')
    food = parser.parse_args().food
    dataset_dir = get_dataset_path(food)
    model_path, class_names_path = get_training_artifact_paths(food)
    model_path.parent.mkdir(parents=True, exist_ok=True)

    paths, labels, class_names = load_samples(dataset_dir)
    num_classes = len(class_names)
    train_paths, holdout_paths, train_labels, holdout_labels = train_test_split(
        paths,
        labels,
        test_size=0.3,
        random_state=42,
        stratify=labels,
    )
    val_paths, test_paths, val_labels, test_labels = train_test_split(
        holdout_paths,
        holdout_labels,
        test_size=0.5,
        random_state=42,
        stratify=holdout_labels,
    )

    data_augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip('horizontal_and_vertical'),
        tf.keras.layers.RandomRotation(0.1),
        tf.keras.layers.RandomZoom(0.1),
        tf.keras.layers.RandomContrast(0.2),
    ])

    train_ds = make_dataset(train_paths, train_labels, training=True, augmentation=data_augmentation)
    val_ds = make_dataset(val_paths, val_labels, training=False)
    test_ds = make_dataset(test_paths, test_labels, training=False)

    model = build_model(num_classes)

    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=4, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(
            str(model_path),
            save_best_only=True,
            monitor='val_loss',
        ),
    ]

    model.fit(train_ds, validation_data=val_ds, epochs=12, callbacks=callbacks)

    y_true = np.concatenate([y.numpy() for _, y in test_ds], axis=0)
    y_pred_prob = model.predict(test_ds, verbose=1)
    y_pred = np.argmax(y_pred_prob, axis=1)

    print(f'Food: {FOODS[food]} ({food})')
    print(f'Samples: train={len(train_paths)}, validation={len(val_paths)}, test={len(test_paths)}')
    print('Held-out test accuracy:', accuracy_score(y_true, y_pred))
    print('Precision:', precision_score(y_true, y_pred, average='macro', zero_division=0))
    print('Recall:', recall_score(y_true, y_pred, average='macro', zero_division=0))
    print('F1 Score:', f1_score(y_true, y_pred, average='macro', zero_division=0))
    print('Confusion Matrix:')
    print(confusion_matrix(y_true, y_pred, labels=list(range(num_classes))))

    with class_names_path.open('w', encoding='utf-8') as handle:
        json.dump(class_names, handle)

    print(f'Model saved to {model_path}')
    print(f'Class mapping saved to {class_names_path}')


if __name__ == '__main__':
    main()
