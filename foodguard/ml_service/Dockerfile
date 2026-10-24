FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python -c "import zipfile; from pathlib import Path; p=Path('models.zip'); p.exists() and zipfile.ZipFile(p).extractall('.')"
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
