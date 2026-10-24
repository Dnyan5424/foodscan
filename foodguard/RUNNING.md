# FoodGuard: Quick Running Guide

## One-time setup

1. Install Node.js 18 or newer, Python 3.12, and MongoDB (or prepare a MongoDB Atlas URI).
2. Open PowerShell in this project folder, the one containing `package.json`.
3. Install JavaScript dependencies:

   ```powershell
   npm.cmd install
   ```

4. Create `backend\.env` from `backend\.env.example` if needed. Set `MONGO_URI` and a private `JWT_SECRET`.
5. Create the ML Python environment and install its dependencies:

   ```powershell
   py -3.12 -m venv ml_service\.venv
   .\ml_service\.venv\Scripts\python.exe -m pip install -r ml_service\requirements.txt
   ```

## Start all services

1. Make sure MongoDB is running and `backend\.env` is configured.
2. From the project folder, run:

   ```powershell
   npm.cmd run dev
   ```

   This starts the frontend, backend API, and ML service together.

3. Open <http://localhost:5173>.
4. API health: <http://localhost:5000/api/health> — expected response: `{"status":"ok"}`.
5. ML health: <http://127.0.0.1:8000/> — expected response includes `"status":"running"`.
6. Leave the terminal open while using the app. Press **Ctrl+C** to stop all services.

`npm.cmd` avoids PowerShell's script execution policy blocking the `npm.ps1` shim. The scanner uses `127.0.0.1:8000` for its ML API connection.

## Troubleshooting

- **MongoDB connection errors:** start MongoDB or correct `MONGO_URI` in `backend\.env`.
- **ML service fails to start:** check that `ml_service\.venv\Scripts\python.exe` exists and the requirements installed successfully. See [the ML service guide](ml_service/README.md) for TensorFlow setup.
- **Port in use:** stop the process already using port 5173, 5000, or 8000.

## Deploy to Render

The repository includes `render.yaml` with three services:

- `foodguard-frontend`: Render Static Site built from `frontend`.
- `foodguard-backend`: Node Web Service built from `backend`.
- `foodguard-ml`: Docker Web Service built from `ml_service`.

1. Push the repository to GitHub or GitLab. Commit `ml_service/models.zip` if
   the bundled model should be available in production.
2. In Render, choose **New > Blueprint**, connect the repository, and select
   `render.yaml`.
3. Provide `MONGO_URI` when prompted. Use a MongoDB Atlas connection string and
   allow Render access in Atlas Network Access. Keep the generated `JWT_SECRET`.
4. Add `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, and
   `OCR_SPACE_API_KEY` only if those features are enabled. Keep them private.
5. Deploy. Render supplies `PORT`. After the three services receive URLs, set
   these values in the Render dashboard, then redeploy the frontend:
   `VITE_API_URL=https://<backend>.onrender.com/api`,
   `VITE_ML_API_URL=https://<ml>.onrender.com`,
   `CLIENT_ORIGIN=https://<frontend>.onrender.com`, and
   `ALLOWED_ORIGINS=https://<frontend>.onrender.com`.
6. Verify `/api/health` on the backend, `/` on the ML service, and the frontend
   URL. Free services may sleep after inactivity; the first request can be slow.

## Full three-service deployment guide

### 1. Prepare the repository

Use this repository layout:

```text
foodguard/
  backend/       Express API
  frontend/      React/Vite application
  ml_service/    FastAPI model API
  render.yaml
```

Commit source code, `ml_service/models.zip`, and the trained model artifacts.
Do not commit `.env`, API keys, MongoDB passwords, JWT secrets, or Python
virtual environments.

### 2. Create the database

Create a MongoDB Atlas cluster and database named `foodguard`. In Atlas:

1. Create a database user and password.
2. Add `0.0.0.0/0` under Network Access for a simple Render deployment, or use
   Atlas's more restrictive networking option if your plan supports it.
3. Copy the connection string and replace the password and database name.

The final Render value looks like:

```text
mongodb+srv://USER:PASSWORD@cluster.mongodb.net/foodguard?retryWrites=true&w=majority
```

### 3. Deploy the backend service

In Render, create a Blueprint from `render.yaml`, or create a Web Service
manually with:

```text
Root Directory: backend
Environment: Node
Build Command: npm ci
Start Command: npm start
Health Check Path: /api/health
```

Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`. Add the VAPID and OCR
variables only when those features are used. The backend listens on Render's
`PORT`; do not replace it with a fixed port.

Check:

```text
https://<backend-name>.onrender.com/api/health
```

Expected response: `{"status":"ok"}`.

### 4. Train and deploy the ML service

The current trainer uses MobileNetV3Small transfer learning. It first trains a
new classification head, then fine-tunes only the final backbone layers. For a
600–700-image dataset, this is a sensible approach; training a full CNN from
scratch would usually overfit.

#### Prepare 600–700 images

Use one food and one classification problem per training run. Do not mix
different foods or incompatible labels. For example, a chilli dataset should
look like:

```text
ml_service/dataset/chilli/
  normal/       250–300 images
  adulterated/  250–300 images
```

For three classes, distribute the total as evenly as possible, for example
`230/230/230`. Keep classes within roughly 10–15% of one another. Use only
verified labels; if the label is uncertain, exclude the image.

Recommended split for 600–700 total images:

```text
70% training   approximately 420–490 images
15% validation approximately 90–105 images
15% test       approximately 90–105 images
```

The trainer creates the split automatically. Keep near-duplicate photos of the
same sample in the same split; otherwise the test accuracy will be misleading.
Also keep different lighting, cameras, backgrounds, containers, and viewpoints
in every class. Never use augmented copies of one image as separate test images.

Supported folders are `turmeric`, `chilli`, `flour`, `pulses`, `salt`, and
`milk`. Each class folder name becomes the model output label. Example:

```text
ml_service/dataset/chilli/
  normal/
    chilli-001.jpg
  adulterated/
    chilli-401.jpg
```

#### Train locally

```powershell
py -3.12 -m venv ml_service\.venv
.\ml_service\.venv\Scripts\python.exe -m pip install --upgrade pip
.\ml_service\.venv\Scripts\python.exe -m pip install -r ml_service\requirements.txt
.\ml_service\.venv\Scripts\python.exe ml_service\train.py --food chilli
```

Replace `chilli` with the food being trained. Review the printed validation and
test metrics and confusion matrix. Accuracy alone is not enough: inspect false
positives and false negatives, and retrain if one class is consistently missed.

Training produces:

```text
ml_service/models/chilli/model.keras
ml_service/models/chilli/class_names.json
```

The API reports that food as ready only when both files exist. Test locally:

```powershell
npm run ml:dev
Invoke-RestMethod http://localhost:8000/foods
curl.exe -X POST "http://localhost:8000/predict/chilli" -F "file=@C:\path\to\test.jpg"
```

#### Package the model for Render

The ML Dockerfile installs the Python dependencies and extracts
`ml_service/models.zip` during the image build. After training, include the
updated model in that archive from the `ml_service` directory:

```powershell
Compress-Archive -Path models -DestinationPath models.zip -Force
```

Confirm that the archive contains paths such as
`models/chilli/model.keras` and `models/chilli/class_names.json`. Commit the
archive, push it, and redeploy the `foodguard-ml` service. A Render health check
only proves that FastAPI starts; also verify `/foods` and make one prediction.

The ML service may need a paid/larger Render instance because TensorFlow can use
more memory than the smallest instance. If the service restarts during a
prediction, check Render logs for an out-of-memory event.

### 5. Deploy the frontend service

Create a Render Static Site with:

```text
Root Directory: frontend
Build Command: npm ci && npm run build
Publish Directory: dist
```

Set these build-time variables using the actual Render URLs:

```text
VITE_API_URL=https://<backend-name>.onrender.com/api
VITE_ML_API_URL=https://<ml-name>.onrender.com
```

Because Vite embeds `VITE_*` values into the browser bundle, redeploy the
frontend after changing either value. Add the frontend URL to the backend's
`CLIENT_ORIGIN` and the ML service's `ALLOWED_ORIGINS`.

The rewrite in `render.yaml` sends client-side routes to `index.html`; keep it
enabled or refreshing routes such as `/guard-scan` can return a 404.

### 6. Final verification order

1. Open the backend health endpoint.
2. Open the ML root endpoint and `/foods`; confirm the trained food is `ready: true`.
3. Open the frontend and sign up/login.
4. Test a database-backed page, such as products or complaints.
5. Test an image upload with a small JPG or PNG.
6. In browser developer tools, confirm requests go to the two Render URLs and
   not `localhost`.
7. If requests fail, check CORS values, browser Network errors, and Render logs.

The ML result is an image-screening aid, not a laboratory adulteration test.
