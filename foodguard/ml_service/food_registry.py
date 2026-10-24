
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATASET_DIR = ROOT / "dataset"
MODEL_DIR = ROOT / "models"

FOODS = {
    "turmeric": "Turmeric Powder",
}


def get_food(food: str) -> str:
    food_id = str(food).strip().lower()
    if food_id not in FOODS:
        raise ValueError(f"Unsupported food: {food_id}")
    return food_id


def get_dataset_path(food: str) -> Path:
    return DATASET_DIR / get_food(food)


def get_training_artifact_paths(food: str) -> tuple[Path, Path]:
    food_id = get_food(food)
    food_model_dir = MODEL_DIR / food_id
    return (
        food_model_dir / "model.keras",
        food_model_dir / "class_names.json",
    )


def get_model_artifact_paths(food: str) -> tuple[Path, Path]:
    model_path, labels_path = get_training_artifact_paths(food)

    # Support the existing legacy turmeric model location.
    if food == "turmeric" and not model_path.exists():
        legacy_model = MODEL_DIR / "turmeric_model.keras"
        legacy_labels = MODEL_DIR / "class_names.json"

        if legacy_model.exists():
            return legacy_model, legacy_labels

    return model_path, labels_path


def is_model_ready(food: str) -> bool:
    model_path, labels_path = get_model_artifact_paths(food)
    return model_path.is_file() and labels_path.is_file()
