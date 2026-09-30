# FOODGUARD Image Dataset Layout

The image trainer supports one folder per food and one subfolder per labeled class:

```text
dataset/
  turmeric/
    0/
    5/
    10/
  chilli/
    normal/
    adulterated/
  flour/
    normal/
    adulterated/
```

The class-folder names are the model's output labels. Turmeric currently uses percentage labels. For other foods, choose labels that match the verified source data, such as `normal` and `adulterated` for a genuinely binary dataset, or separate named classes when the dataset identifies specific conditions. Do not mix percentage labels, binary labels, and image-background labels in one food's class folders.

Place JPG, JPEG, PNG, WEBP, or BMP images under their correct class folder. The trainer requires at least two classes and at least 10 images per class for a stratified train/validation/test split. A larger and well-balanced dataset is strongly recommended; label correctness and consistent capture conditions matter more than simply adding images.

From `ml_service`, train one food with:

```powershell
python train.py --food chilli
```

The model and class mapping are saved separately under `models/<food>/`. The ML API reports a food as ready only after both artifacts exist. Image files are intentionally excluded from Git by the repository's `.gitignore`.