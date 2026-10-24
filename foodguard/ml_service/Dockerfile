FROM python:3.12-slim

WORKDIR /app

COPY requirements.runtime.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py predictor.py food_registry.py ./
COPY models.zip ./models.zip
RUN python -c "import zipfile; from pathlib import Path; p=Path('models.zip'); assert p.is_file(), 'models.zip is required'; zipfile.ZipFile(p).extractall('.')"

CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
