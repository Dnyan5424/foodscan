import os
import re
import shutil
from pathlib import Path

SOURCE_ROOT = Path(
    r"C:\Users\Dnyandip\Downloads\digital image analysis aided Adulteration Detectio\digital image analysis aided Adulteration Detectio"
)
WHITE_DIR = SOURCE_ROOT / "White background"
BLACK_DIR = SOURCE_ROOT / "Black background"
OUTPUT_DIR = Path(__file__).resolve().parent / "dataset" / "turmeric"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}


def normalize_class_name(name: str) -> str:
    cleaned = name.strip().lower().replace("%", " ").replace("adulteration", "").replace("_", " ")
    match = re.search(r"(\d+)", cleaned)
    if not match:
        raise ValueError(f"Unsupported class folder name: {name!r}")
    return match.group(1)


def collect_image_files(source_dir: Path):
    if not source_dir.exists():
        raise FileNotFoundError(f"Source folder not found: {source_dir}")

    image_files = []
    for item in sorted(source_dir.iterdir()):
        if item.is_dir():
            label = normalize_class_name(item.name)
            class_dir = OUTPUT_DIR / label
            class_dir.mkdir(parents=True, exist_ok=True)

            for file in sorted(item.iterdir()):
                if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS:
                    image_files.append((label, item.name, file, class_dir))
    return image_files


def safe_copy(input_file: Path, destination_dir: Path, source_label: str) -> None:
    destination_name = f"{source_label}_{input_file.name}"
    destination_path = destination_dir / destination_name

    if destination_path.exists():
        stem = input_file.stem
        suffix = input_file.suffix
        counter = 1
        while destination_path.exists():
            destination_path = destination_dir / f"{source_label}_{stem}_{counter}{suffix}"
            counter += 1

    shutil.copy2(input_file, destination_path)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 70)
    print("Preparing turmeric dataset from White and Black background folders")
    print(f"Source root: {SOURCE_ROOT}")
    print(f"White background: {WHITE_DIR}")
    print(f"Black background: {BLACK_DIR}")
    print(f"Output dir: {OUTPUT_DIR}")
    print("=" * 70)

    copied_total = 0
    processed_labels = set()

    for background_name, source_dir in [("White", WHITE_DIR), ("Black", BLACK_DIR)]:
        print(f"\nProcessing {background_name} background...")
        for item in sorted(source_dir.iterdir()):
            if not item.is_dir():
                continue

            label = normalize_class_name(item.name)
            processed_labels.add(label)
            class_dir = OUTPUT_DIR / label
            class_dir.mkdir(parents=True, exist_ok=True)

            count = 0
            for file in sorted(item.iterdir()):
                if not file.is_file() or file.suffix.lower() not in IMAGE_EXTENSIONS:
                    continue

                safe_copy(file, class_dir, background_name.lower())
                count += 1
                copied_total += 1

            print(f"{label}% adulteration : {count} images copied from {background_name}")

    print("\n" + "-" * 70)
    print(f"TOTAL IMAGES COPIED: {copied_total}")
    print(f"CLASS FOLDERS: {sorted(processed_labels)}")
    print(f"Dataset created at: {OUTPUT_DIR}\n")

    print("=" * 70)
    print("DATASET PREPARATION COMPLETE")
    print("=" * 70)

    for label in sorted(processed_labels):
        folder = OUTPUT_DIR / label
        if folder.exists():
            count = len([f for f in folder.iterdir() if f.is_file()])
        else:
            count = 0
        print(f"{label:>3}% adulteration : {count} images")

    print("-" * 70)
    print(f"TOTAL IMAGES: {copied_total}")
    print(f"\nDataset created at:\n{OUTPUT_DIR}")


if __name__ == "__main__":
    main()
