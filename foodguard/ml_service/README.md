# FOODGUARD ML Service

This guide covers setting up, running, checking, and optionally training the
FOODGUARD image-screening service on Windows. The ML API is separate from the
React frontend and Node backend. It is only required for the **unpacked-food
image screening** feature.

## What you need

- Windows 10/11 and PowerShell
- Python 3.12 (recommended for the TensorFlow dependency range)
- Node.js and npm to use the root `npm run ml:dev` shortcut
- Enough disk space and a reliable connection to install TensorFlow and its
  dependencies

Commands in the **Start from the project root** sections assume your current
directory is the `foodguard` project root, the directory containing the root
`package.json`. If you open a new terminal, change to that directory first:

```powershell
Set-Location "C:\path\to\foodguard"
```

Replace the example path with your actual project location. Python 3.12 can be
installed from python.org or with `winget install Python.Python.3.12`. Confirm
that the Python launcher can find it:

```powershell
py -3.12 --version
```

## First-time installation

Create a virtual environment inside `ml_service` and install the dependencies
into that environment:

```powershell
py -3.12 -m venv ml_service\.venv
.\ml_service\.venv\Scripts\python.exe -m pip install --upgrade pip
.\ml_service\.venv\Scripts\python.exe -m pip install -r ml_service\requirements.txt
```

The install includes FastAPI/Uvicorn, image processing packages, scikit-learn,
and TensorFlow. TensorFlow is large and may take several minutes to download.
The virtual environment is local to your machine and should not be committed.

Verify that Uvicorn and TensorFlow are importable:

```powershell
.\ml_service\.venv\Scripts\python.exe -c "import fastapi, tensorflow; print('FastAPI', fastapi.__version__); print('TensorFlow', tensorflow.__version__)"
```

If this reports an import or installation error, see
[Troubleshooting](#troubleshooting) before starting the server.

## Start the ML API

### Start from the project root

From the project root (the directory containing `package.json`), start the
API:

```powershell
npm run ml:dev
```

Leave this terminal open while using image screening. The root npm script runs
Uvicorn with the Python interpreter from `ml_service\.venv`, enables reload
when Python files change, and listens on port 8000. Stop it with **Ctrl+C**.

Do not run `npm run ml:dev` from inside the `ml_service` directory: there is
no `package.json` in that directory, so npm will report `ENOENT`.

If your terminal is in the parent repository folder instead (the folder
containing the `foodguard` directory), run Uvicorn with the app directory
specified:

```powershell
python -m uvicorn main:app --app-dir .\foodguard\ml_service --reload --host 127.0.0.1 --port 8000
```

For example, this is the correct command when the prompt ends in
`...\foodscan>` and the app is in `...\foodscan\foodguard\ml_service`.

### Start from inside `ml_service`

If your PowerShell prompt is already in the `ml_service` directory and its
virtual environment is activated (the prompt usually starts with `(.venv)`),
start Uvicorn directly instead:

```powershell
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

If the virtual environment is not activated, use its interpreter explicitly:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Alternatively, change to the project root and use the npm script. The
equivalent direct command from the project root is:

```powershell
.\ml_service\.venv\Scripts\python.exe -m uvicorn main:app --app-dir ml_service --reload --host 127.0.0.1 --port 8000
```

The API allows the local frontend origins `http://localhost:5173` and
`http://127.0.0.1:5173` by default. To allow other origins, set the
comma-separated `ALLOWED_ORIGINS` environment variable before starting the
service. Only add origins you trust.

## Verify it is running

Open these URLs in a browser:

| URL | Expected result |
| --- | --- |
| <http://localhost:8000/> | Service name and `"status": "running"` |
| <http://localhost:8000/foods> | Food model readiness for each supported food |
| <http://localhost:8000/docs> | Interactive FastAPI API documentation |

Or check the health and model endpoints from another PowerShell window:

```powershell
Invoke-RestMethod http://localhost:8000/
Invoke-RestMethod http://localhost:8000/foods
```

The `/foods` response includes `ready: true` only if that food has both its
model file and class-name file. The repository includes a ready turmeric model;
the other foods may report `ready: false` until you train them. The API can
start even if some or all model files are missing, but predictions for a
missing model will return an error.

## Use it from the web app

1. Start the ML API in its own terminal using `npm run ml:dev`.
2. Start the frontend and backend from another terminal at the project root:

   ```powershell
   npm run dev
   ```

3. Open <http://localhost:5173>, navigate to **GuardScan**, and select
   **Unpacked Food**.
4. Choose a food marked as ready, upload a clear JPG, JPEG, PNG, or WEBP image
   (maximum 8 MB), and run the screening.

The frontend uses `http://localhost:8000` as its default ML URL. To override
it, create or edit `frontend\.env` and set:

```dotenv
VITE_ML_API_URL=http://localhost:8000
```

Restart the Vite frontend after changing this setting. The setting is a
frontend URL, not a secret; do not put credentials in `VITE_*` variables.

You can also send an image directly to the API using `curl.exe` from
PowerShell. Replace the example image path with an existing image file:

```powershell
curl.exe -X POST "http://localhost:8000/predict/turmeric" -F "file=@C:\path\to\food-image.jpg"
```

The response includes the predicted class, confidence, and `is_anomaly` flag.
This is a visual screening result, not a laboratory test or confirmation that
food is safe.

## Train a model for another food

Training is optional. It is not required to start the API or use a food that
already has model files.

Supported food IDs are `turmeric`, `chilli`, `flour`, `pulses`, `salt`, and
`milk`. For each food to train:

1. Organize verified, correctly labeled images into one folder per class under
   `ml_service\dataset\<food-id>\`. For example:

   ```text
   ml_service/
     dataset/
       chilli/
         normal/
           image-001.jpg
         adulterated/
           image-002.jpg
   ```

   Each class folder name becomes a prediction label. Use `normal` and
   `adulterated` only when those labels accurately describe the dataset.
   Turmeric's existing data uses percentage labels such as `0`, `5`, and `10`;
   do not mix percentages, binary labels, or image-background labels within a
   food's classes.

2. Add at least **10 supported images in every class**. Supported file types
   are JPG, JPEG, PNG, WEBP, and BMP. A balanced, larger dataset with
   trustworthy labels is strongly recommended. Dataset images are excluded
   from Git; keep a separate backup of your data.

3. From the project root, train the chosen food. For example:

   ```powershell
   .\ml_service\.venv\Scripts\python.exe ml_service\train.py --food chilli
   ```

   Replace `chilli` with one of the supported food IDs. If `--food` is
   omitted, the trainer defaults to `turmeric`.

4. Training creates or updates these files:

   ```text
   ml_service\models\<food-id>\model.keras
   ml_service\models\<food-id>\class_names.json
   ```

   The script reports train/validation/test metrics and the confusion matrix.
   Check the results and class ordering before using the model.

5. Restart the ML service if it is running, then check
   <http://localhost:8000/foods>. The trained food should report `ready: true`.

For the dataset folder rules and label guidance, see
[`dataset/README.md`](./dataset/README.md).

## API summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `GET` | `/foods` | List supported foods and model readiness |
| `POST` | `/predict/{food}` | Predict a food class from a multipart image field named `file` |
| `GET` | `/docs` | Interactive API documentation |

Prediction accepts JPG, JPEG, PNG, or WEBP images up to 8 MB. An unsupported
food ID returns 404, a missing model returns 503, and an invalid or unsupported
image returns a 4xx response. The model is loaded when a prediction is made,
not simply when the API starts.

## Troubleshooting

- **`py -3.12` is not found:** Install Python 3.12 and ensure the Python
  launcher is enabled. Use `py --list` to see installed versions. Create the
  virtual environment with an installed Python version compatible with the
  TensorFlow wheel resolved from `requirements.txt`.
- **`No module named uvicorn` or another package:** Install dependencies using
  the virtual environment's Python executable, not a different global Python:

  ```powershell
  .\ml_service\.venv\Scripts\python.exe -m pip install -r ml_service\requirements.txt
  ```

- **PowerShell cannot find the venv Python:** From the project root, check
  `Test-Path .\ml_service\.venv\Scripts\python.exe`. If it returns `False`,
  create the environment again with the installation commands above.
- **`npm run ml:dev` reports `'ml_service' is not recognized`:** Confirm you
  are in the `foodguard` project root and that the root `package.json` has
  the Windows `ml:dev` command. Run the direct Uvicorn command above to see
  errors from Python itself.
- **Port 8000 is already in use:** Stop the other process using port 8000 or
  start Uvicorn on another port. If you change the port, also update
  `VITE_ML_API_URL` in `frontend\.env` to the matching URL.
- **Frontend cannot reach the API:** Make sure the ML terminal is still
  running, use the same host name consistently (`localhost` or `127.0.0.1`),
  check `VITE_ML_API_URL`, and restart Vite after changing frontend settings.
- **A food says `ready: false`:** Check for both
  `ml_service\models\<food-id>\model.keras` and
  `ml_service\models\<food-id>\class_names.json`. Train the food or restore
  both artifacts, then restart the service.
- **TensorFlow fails to import on Windows:** Read the full Python traceback
  in the ML service terminal. Recreate the virtual environment using a Python
  version supported by TensorFlow, reinstall `requirements.txt`, and make
  sure your machine's application-control or antivirus policy permits the
  TensorFlow native libraries.
- **Prediction fails but health works:** Health checks do not load the model.
  Check model readiness, image type and size, and the ML terminal's traceback.
  Retry with a valid, clear image and a food marked ready.
