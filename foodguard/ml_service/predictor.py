from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path
from typing import TYPE_CHECKING

from PIL import Image, UnidentifiedImageError

from food_registry import FOODS, get_food, get_model_artifact_paths, is_model_ready

if TYPE_CHECKING:
    import numpy as np
    import tensorflow as tf


def load_class_names(food: str) -> list[str]:
    food_id = get_food(food)
    _, class_names_path = get_model_artifact_paths(food_id)
    if class_names_path.exists():
        try:
            with class_names_path.open('r', encoding='utf-8') as handle:
                stored = json.load(handle)
            if isinstance(stored, list) and stored:
                return [str(item) for item in stored]
        except (json.JSONDecodeError, OSError):
            pass
    if food_id == 'turmeric':
        return ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '100']
    raise FileNotFoundError(f'Class labels are not available for {FOODS[food_id]}.')


def load_model(food: str) -> tf.keras.Model:
    import tensorflow as tf

    food_id = get_food(food)
    model_path, _ = get_model_artifact_paths(food_id)
    if not model_path.exists():
        raise FileNotFoundError(f'{FOODS[food_id]} model is not trained yet.')
    return tf.keras.models.load_model(str(model_path), compile=False)


def _prepare_image(image: Image.Image) -> np.ndarray:
    import numpy as np
    import tensorflow as tf

    rgb = image.convert('RGB').resize((224, 224))
    arr = np.asarray(rgb, dtype=np.float32)
    arr = tf.keras.applications.mobilenet_v3.preprocess_input(arr)
    return np.expand_dims(arr, axis=0)


def predict_food_from_bytes(food: str, image_bytes: bytes) -> dict:
    import numpy as np

    food_id = get_food(food)
    if not image_bytes:
        raise ValueError('Image is empty.')

    try:
        image = Image.open(BytesIO(image_bytes))
        image.verify()
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError('Please upload a valid image file.') from exc

    try:
        image = Image.open(BytesIO(image_bytes)).convert('RGB')
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError('Please upload a valid image file.') from exc

    model = load_model(food_id)
    prepared = _prepare_image(image)
    probabilities = model.predict(prepared, verbose=0)[0]
    class_names = load_class_names(food_id)
    predicted_index = int(np.argmax(probabilities))
    predicted_label = str(class_names[predicted_index])
    confidence = float(probabilities[predicted_index])
    normalized_label = predicted_label.strip().casefold().replace('_', ' ').replace('-', ' ')
    normal_labels = {'0', '0%', 'normal', 'pure', 'authentic', 'safe', 'not adulterated', 'non adulterated'}
    numeric_label = normalized_label.removesuffix('%').strip()
    is_normal = normalized_label in normal_labels or (numeric_label.isdigit() and int(numeric_label) == 0)
    result = f'{predicted_label}% adulteration' if food_id == 'turmeric' and predicted_label.isdigit() else predicted_label

    return {
        'food': food_id,
        'class_name': predicted_label,
        'result': result,
        'is_anomaly': not is_normal,
        'confidence': round(float(confidence), 4),
    }


def predict_turmeric_from_bytes(image_bytes: bytes) -> dict:
    return predict_food_from_bytes('turmeric', image_bytes)


def predict_turmeric_from_path(image_path: str | Path) -> dict:
    image_path = Path(image_path)
    if not image_path.exists():
        raise FileNotFoundError('Image not found.')
    return predict_turmeric_from_bytes(image_path.read_bytes())


def list_food_models() -> list[dict]:
    return [
        {'id': food_id, 'label': label, 'ready': is_model_ready(food_id)}
        for food_id, label in FOODS.items()
    ]
