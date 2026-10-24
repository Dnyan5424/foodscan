import logging
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from food_registry import get_food
from predictor import list_food_models, predict_food_from_bytes

LOGGER = logging.getLogger(__name__)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
    if origin.strip()
]

app = FastAPI(title='FOODGUARD ML', version='1.0.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r'^https?://(localhost|127\.0\.0\.1):517[0-9]$',
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
def health() -> dict:
    return {'service': 'FOODGUARD ML', 'status': 'running'}


@app.get('/foods')
def foods() -> dict:
    return {'foods': list_food_models()}


@app.post('/predict/{food}')
async def predict_food(food: str, file: UploadFile = File(...)) -> dict:
    try:
        food_id = get_food(food)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail='This food is not configured for AI screening.') from exc

    if not file or not file.filename:
        raise HTTPException(status_code=400, detail='Please select or capture an image.')

    allowed_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    filename = file.filename or ''
    extension = os.path.splitext(filename)[1].lower()
    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail='Unsupported file type. Please upload JPG, JPEG, PNG, or WEBP.')

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail='Image file is empty.')
    if len(image_bytes) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail='Image is too large. Please upload a smaller image.')

    try:
        result = predict_food_from_bytes(food_id, image_bytes)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail='Please upload a valid food image.') from exc
    except ImportError as exc:
        LOGGER.exception('AI model dependencies could not be loaded.')
        if 'application control policy has blocked this file' in str(exc).casefold():
            detail = (
                'Windows Application Control blocked a TensorFlow native library. '
                'Run the ML service with an approved TensorFlow installation and restart it.'
            )
        else:
            detail = 'AI model dependencies could not be loaded. Check the ML service logs.'
        raise HTTPException(
            status_code=503,
            detail=detail,
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail='Unable to analyze this image. Please try another clear photo.') from exc

    return result
