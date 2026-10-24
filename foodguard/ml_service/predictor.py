
from __future__ import annotations

import json
from functools import lru_cache
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, UnidentifiedImageError

from food_registry import get_model_artifact_paths

CLASS_NAMES = [
    "0", "5", "10", "15", "20", "25",
    "30", "35", "40", "45", "50", "100",
]


@lru_cache(maxsize=1)
def load_model(food: str = "turmeric"):
    """Load the turmeric model once per running process."""
    import tensorflow as tf

    if food.strip().lower() not in {"turmeric", "turmeric powder"}:
        raise ValueError("Only turmeric is supported.")

    model_path, _ = get_model_artifact_paths("turmeric")

    if not model_path.exists():
        raise FileNotFoundError("Turmeric model file was not found.")

    return tf.keras.models.load_model(str(model_path), compile=False)


@lru_cache(maxsize=1)
def load_class_names(food: str = "turmeric") -> list[str]:
    if food.strip().lower() not in {"turmeric", "turmeric powder"}:
        raise ValueError("Only turmeric is supported.")

    _, labels_path = get_model_artifact_paths("turmeric")

    if labels_path.exists():
        try:
            with labels_path.open("r", encoding="utf-8") as f:
                labels = json.load(f)
            if isinstance(labels, list) and labels:
                return [str(label) for label in labels]
        except (json.JSONDecodeError, OSError):
            pass

    return CLASS_NAMES.copy()


def predict_food_from_bytes(food: str, image_bytes: bytes) -> dict:
    if food.strip().lower() not in {"turmeric", "turmeric powder"}:
        raise ValueError("Only turmeric is supported.")

    if not image_bytes:
        raise ValueError("Image is empty.")

    try:
        with Image.open(BytesIO(image_bytes)) as source:
            source.verify()

        with Image.open(BytesIO(image_bytes)) as source:
            image = source.convert("RGB")
            image = image.resize((224, 224))

    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError("Please upload a valid image file.") from exc

    # Match the preprocessing used when training your model.
    import tensorflow as tf

    image_array = np.asarray(image, dtype=np.float32)
    image_array = tf.keras.applications.mobilenet_v3.preprocess_input(
        image_array
    )
    image_array = np.expand_dims(image_array, axis=0)

    model = load_model("turmeric")

    # Direct inference avoids the extra predict() data-adapter overhead.
    probabilities = np.asarray(
        model(image_array, training=False)
    )[0]

    class_names = load_class_names("turmeric")

    if len(probabilities) != len(class_names):
        raise ValueError(
            "Model output count does not match the saved class labels."
        )

    predicted_index = int(np.argmax(probabilities))
    predicted_label = class_names[predicted_index]
    confidence = float(probabilities[predicted_index])

    normalized = predicted_label.strip().casefold().replace("%", "")
    is_normal = normalized in {
        "0", "normal", "pure", "authentic", "safe",
        "not adulterated", "non adulterated",
    }

    result = (
        f"{predicted_label}% adulteration"
        if predicted_label.strip().isdigit()
        else predicted_label
    )

    return {
        "food": "turmeric",
        "class_name": predicted_label,
        "result": result,
        "is_anomaly": not is_normal,
        "confidence": round(confidence, 4),
    }


def predict_turmeric_from_bytes(image_bytes: bytes) -> dict:
    return predict_food_from_bytes("turmeric", image_bytes)


def predict_turmeric_from_path(image_path: str | Path) -> dict:
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError("Image not found.")
    return predict_turmeric_from_bytes(path.read_bytes())


def list_food_models() -> list[dict]:
    return [{"id": "turmeric", "label": "Turmeric", "ready": True}]
