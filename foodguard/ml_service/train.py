from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

from food_registry import (
    FOODS,
    get_dataset_path,
    get_training_artifact_paths,
)


IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

MIN_CLASS_IMAGES = 10

SEED = 42

INITIAL_EPOCHS = 15
FINE_TUNE_EPOCHS = 15

LEARNING_RATE = 1e-3
FINE_TUNE_LEARNING_RATE = 1e-5


tf.keras.utils.set_random_seed(SEED)


def class_sort_key(name: str) -> tuple[int, int | str]:
    if name.isdigit():
        return 0, int(name)

    return 1, name.casefold()


def load_samples(dataset_dir):

    if not dataset_dir.is_dir():
        raise FileNotFoundError(
            f'Dataset folder not found: {dataset_dir}'
        )

    class_dirs = sorted(
        (
            path
            for path in dataset_dir.iterdir()
            if path.is_dir() and not path.name.startswith('.')
        ),
        key=lambda path: class_sort_key(path.name),
    )

    if len(class_dirs) < 2:
        raise ValueError(
            f'Add at least two labeled class folders under {dataset_dir}.'
        )

    paths = []
    labels = []

    class_names = [
        path.name
        for path in class_dirs
    ]

    for label, class_dir in enumerate(class_dirs):

        images = sorted(
            path
            for path in class_dir.rglob('*')
            if (
                path.is_file()
                and path.suffix.lower() in IMAGE_EXTENSIONS
            )
        )

        if len(images) < MIN_CLASS_IMAGES:
            raise ValueError(
                f'Class "{class_dir.name}" has '
                f'{len(images)} images. '
                f'At least {MIN_CLASS_IMAGES} are required.'
            )

        paths.extend(
            str(path)
            for path in images
        )

        labels.extend(
            [label] * len(images)
        )

    return paths, labels, class_names


def build_model(num_classes):

    base_model = tf.keras.applications.MobileNetV3Small(
        include_top=False,
        weights='imagenet',
        input_shape=(224, 224, 3),
        pooling='avg',
    )

    # Stage 1: freeze backbone
    base_model.trainable = False

    inputs = tf.keras.Input(
        shape=(224, 224, 3)
    )

    x = tf.keras.applications.mobilenet_v3.preprocess_input(
        inputs
    )

    x = base_model(
        x,
        training=False
    )

    x = tf.keras.layers.Dropout(
        0.35
    )(x)

    x = tf.keras.layers.Dense(
        128,
        activation='relu'
    )(x)

    x = tf.keras.layers.Dropout(
        0.25
    )(x)

    outputs = tf.keras.layers.Dense(
        num_classes,
        activation='softmax'
    )(x)

    model = tf.keras.Model(
        inputs,
        outputs
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=LEARNING_RATE
        ),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy'],
    )

    return model, base_model


def make_dataset(
    paths,
    labels,
    *,
    training=False,
    augmentation=None,
):

    dataset = tf.data.Dataset.from_tensor_slices(
        (paths, labels)
    )

    if training:

        dataset = dataset.shuffle(
            len(paths),
            seed=SEED,
            reshuffle_each_iteration=True,
        )

    def load_image(path, label):

        image = tf.io.decode_image(
            tf.io.read_file(path),
            channels=3,
            expand_animations=False,
        )

        image.set_shape(
            (None, None, 3)
        )

        image = tf.image.resize(
            image,
            IMAGE_SIZE
        )

        image = tf.cast(
            image,
            tf.float32
        )

        if training and augmentation is not None:

            image = augmentation(
                image,
                training=True
            )

        return image, label

    return (
        dataset
        .map(
            load_image,
            num_parallel_calls=tf.data.AUTOTUNE,
        )
        .batch(BATCH_SIZE)
        .prefetch(tf.data.AUTOTUNE)
    )


def main():

    parser = argparse.ArgumentParser(
        description='Train FOODGUARD image model.'
    )

    parser.add_argument(
        '--food',
        choices=sorted(FOODS),
        default='turmeric',
    )

    food = parser.parse_args().food

    dataset_dir = get_dataset_path(food)

    model_path, class_names_path = (
        get_training_artifact_paths(food)
    )

    model_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    print()
    print('======================================')
    print(f'FOODGUARD TRAINING: {FOODS[food]}')
    print('======================================')
    print()

    # --------------------------------------------------
    # LOAD DATA
    # --------------------------------------------------

    paths, labels, class_names = load_samples(
        dataset_dir
    )

    num_classes = len(class_names)

    print(f'Total images: {len(paths)}')
    print(f'Classes: {class_names}')
    print()

    # --------------------------------------------------
    # TRAIN / VALIDATION / TEST SPLIT
    # --------------------------------------------------

    train_paths, holdout_paths, train_labels, holdout_labels = (
        train_test_split(
            paths,
            labels,
            test_size=0.30,
            random_state=SEED,
            stratify=labels,
        )
    )

    val_paths, test_paths, val_labels, test_labels = (
        train_test_split(
            holdout_paths,
            holdout_labels,
            test_size=0.50,
            random_state=SEED,
            stratify=holdout_labels,
        )
    )

    print(
        f'Train:      {len(train_paths)}'
    )

    print(
        f'Validation: {len(val_paths)}'
    )

    print(
        f'Test:       {len(test_paths)}'
    )

    print()

    # --------------------------------------------------
    # AUGMENTATION
    # --------------------------------------------------

    data_augmentation = tf.keras.Sequential([

        tf.keras.layers.RandomFlip(
            'horizontal'
        ),

        tf.keras.layers.RandomRotation(
            0.08
        ),

        tf.keras.layers.RandomZoom(
            0.12
        ),

        tf.keras.layers.RandomContrast(
            0.15
        ),

        tf.keras.layers.RandomTranslation(
            0.05,
            0.05
        ),

    ])

    train_ds = make_dataset(
        train_paths,
        train_labels,
        training=True,
        augmentation=data_augmentation,
    )

    val_ds = make_dataset(
        val_paths,
        val_labels,
    )

    test_ds = make_dataset(
        test_paths,
        test_labels,
    )

    # --------------------------------------------------
    # BUILD MODEL
    # --------------------------------------------------

    model, base_model = build_model(
        num_classes
    )

    # --------------------------------------------------
    # STAGE 1
    # --------------------------------------------------

    print()
    print('======================================')
    print('STAGE 1: CLASSIFIER TRAINING')
    print('======================================')
    print()

    checkpoint = tf.keras.callbacks.ModelCheckpoint(
        str(model_path),
        monitor='val_loss',
        save_best_only=True,
        verbose=1,
    )

    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1,
    )

    reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.3,
        patience=2,
        min_lr=1e-7,
        verbose=1,
    )

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=INITIAL_EPOCHS,
        callbacks=[
            checkpoint,
            early_stopping,
            reduce_lr,
        ],
    )

    # --------------------------------------------------
    # STAGE 2: FINE TUNING
    # --------------------------------------------------

    print()
    print('======================================')
    print('STAGE 2: FINE-TUNING MOBILENETV3')
    print('======================================')
    print()

    base_model.trainable = True

    # Freeze most of the backbone.
    # Only the final ~30 layers are trainable.

    for layer in base_model.layers[:-30]:

        layer.trainable = False

    # Keep BatchNorm layers frozen for stable
    # fine-tuning on the small dataset.

    for layer in base_model.layers:

        if isinstance(
            layer,
            tf.keras.layers.BatchNormalization
        ):

            layer.trainable = False

    model.compile(

        optimizer=tf.keras.optimizers.Adam(
            learning_rate=FINE_TUNE_LEARNING_RATE
        ),

        loss='sparse_categorical_crossentropy',

        metrics=['accuracy'],
    )

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=FINE_TUNE_EPOCHS,
        callbacks=[
            checkpoint,
            early_stopping,
            reduce_lr,
        ],
    )

    # --------------------------------------------------
    # LOAD BEST MODEL
    # --------------------------------------------------

    model = tf.keras.models.load_model(
        model_path
    )

    # --------------------------------------------------
    # FINAL INDEPENDENT TEST
    # --------------------------------------------------

    print()
    print('======================================')
    print('FINAL TEST')
    print('======================================')
    print()

    y_true = np.concatenate(
        [
            y.numpy()
            for _, y in test_ds
        ],
        axis=0,
    )

    y_pred_prob = model.predict(
        test_ds,
        verbose=1,
    )

    y_pred = np.argmax(
        y_pred_prob,
        axis=1,
    )

    accuracy = accuracy_score(
        y_true,
        y_pred,
    )

    precision = precision_score(
        y_true,
        y_pred,
        average='macro',
        zero_division=0,
    )

    recall = recall_score(
        y_true,
        y_pred,
        average='macro',
        zero_division=0,
    )

    f1 = f1_score(
        y_true,
        y_pred,
        average='macro',
        zero_division=0,
    )

    print()
    print('======================================')
    print('RESULTS')
    print('======================================')

    print(
        f'Accuracy : {accuracy * 100:.2f}%'
    )

    print(
        f'Precision: {precision * 100:.2f}%'
    )

    print(
        f'Recall   : {recall * 100:.2f}%'
    )

    print(
        f'F1 Score : {f1 * 100:.2f}%'
    )

    print()
    print('Confusion Matrix:')

    print(
        confusion_matrix(
            y_true,
            y_pred,
            labels=list(
                range(num_classes)
            ),
        )
    )

    # --------------------------------------------------
    # SAVE CLASS NAMES
    # --------------------------------------------------

    with class_names_path.open(
        'w',
        encoding='utf-8'
    ) as handle:

        json.dump(
            class_names,
            handle,
            indent=2,
        )

    print()
    print(
        f'Model saved to: {model_path}'
    )

    print(
        f'Classes saved to: {class_names_path}'
    )


if __name__ == '__main__':

    main()