
import logging
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from predictor import predict_food_from_bytes

LOGGER = logging.getLogger(__name__)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app = FastAPI(title="FOODGUARD ML", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"service": "FOODGUARD ML", "status": "running"}


@app.get("/foods")
def foods():
    return {"foods": ["turmeric"]}


@app.post("/predict/{food}")
async def predict_food(food: str, file: UploadFile = File(...)):
    if food.strip().lower() not in {"turmeric", "turmeric powder"}:
        raise HTTPException(
            status_code=404,
            detail="Only turmeric adulteration screening is currently supported.",
        )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select or capture an image.",
        )

    extension = os.path.splitext(file.filename)[1].lower()
    if extension not in {".jpg", ".jpeg", ".png", ".webp"}:
        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, JPEG, PNG, or WEBP image.",
        )

    image_bytes = await file.read()
    await file.close()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Image file is empty.")

    if len(image_bytes) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image exceeds the 8 MB limit.")

    try:
        return predict_food_from_bytes("turmeric", image_bytes)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid food image.",
        ) from exc
    except Exception:
        LOGGER.exception("Turmeric image prediction failed")
        raise HTTPException(
            status_code=500,
            detail="Unable to analyze this image. Please try another clear photo.",
        )
