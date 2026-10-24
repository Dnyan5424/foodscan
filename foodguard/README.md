# FOODGUARD

FOODGUARD is a food-safety web app with a React/Vite frontend, an Express API
backed by MongoDB, and an optional FastAPI image-screening service.

## Project layout

```text
foodguard/
  backend/       Express API, MongoDB models, OCR, and notification jobs
  frontend/      React/Vite web app
  ml_service/    FastAPI image-screening service and model files
  package.json   Workspace commands for development and builds
```

## Requirements

- Windows 10/11 with PowerShell (commands below use PowerShell syntax)
- Node.js 18 or newer, with npm
- MongoDB running locally, or a MongoDB Atlas connection string
- Python and pip only if you want to run the optional ML service

Run the commands below from the `foodguard` project directory (the directory
containing this README and the root `package.json`).

## First-time setup

1. Install the JavaScript workspace dependencies:

   ```powershell
   npm install
   ```

2. Make sure MongoDB is running locally, or have your Atlas connection string
   ready. The API uses MongoDB for accounts, products, complaints, and other
   database-backed features. The API process can start without a database, but
   database-backed requests will not work until it connects.

3. Create the backend environment file if it does not already exist:

   ```powershell
   if (-not (Test-Path backend\.env)) {
     Copy-Item backend\.env.example backend\.env
   }
   notepad backend\.env
   ```

   At minimum, set:

   - `MONGO_URI` to your local or Atlas MongoDB URI. For a local MongoDB
     installation, a typical value is
     `mongodb://127.0.0.1:27017/foodguard`.
   - `JWT_SECRET` to a private random value. Generate one with:

     ```powershell
     node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
     ```

   Keep the generated secret private. Do not commit `backend/.env` or put
   private keys in frontend environment variables.

   `PORT`, `CLIENT_ORIGIN`, and `APP_TIMEZONE` have development defaults in the
   sample environment file. Push notifications and the OCR.Space fallback are
   optional; configure their keys only if you intend to use those integrations.
   Treat any optional provider or VAPID values in the sample file as examples:
   replace them with credentials you control before using those integrations.
   For push notifications, the backend VAPID key pair and frontend public key
   must match.

4. Optionally create `frontend/.env` if you need to change the local service
   URLs or enable web push. The defaults already target the local API and ML
   service. If you do create the file, use `frontend/.env.example` as a
   reference and set `VITE_VAPID_PUBLIC_KEY` only to the public key matching
   the backend VAPID pair.

## Run the web app and API

With MongoDB running and `backend/.env` configured, start both services from
the project directory:

```powershell
npm run dev
```

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5000>
- Backend health check: <http://localhost:5000/api/health>

The health endpoint should return `{"status":"ok"}`. To check it from another
PowerShell window:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

Keep this terminal open while developing. Press **Ctrl+C** to stop both
services.

### Database starter content

The `npm run seed` command clears and repopulates the guides, awareness topics,
myths, and quiz collections; it requires a reachable MongoDB database. In this
checkout, `backend/seed/seed.js` imports files from
`backend/seed/content/`, but that directory is not present, so the seed command
cannot currently complete. The command is not needed to start the frontend or
API. Restore or add those seed modules before running it.

## Run the optional ML service

The image-screening API runs separately. For the full Windows setup, API
usage, model training, and troubleshooting guide, see
[`ml_service/README.md`](./ml_service/README.md).

Quick start from the project directory: in a second PowerShell window, create
the Python environment and install the ML dependencies:

```powershell
py -3.12 -m venv ml_service\.venv
.\ml_service\.venv\Scripts\python.exe -m pip install --upgrade pip
.\ml_service\.venv\Scripts\python.exe -m pip install -r ml_service\requirements.txt
```

Start the service (keep this terminal open):

```powershell
npm run ml:dev
```

Run that command from the `foodguard` project root, where the root
`package.json` is located—not from inside `ml_service`. If your PowerShell
prompt is already in `ml_service` and its `.venv` is activated, use
`python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000` instead.

Check <http://localhost:8000/>. If Python 3.12 is not installed, install a
Python version compatible with the TensorFlow release selected by
`ml_service/requirements.txt` and use that version to create the virtual
environment.

## Useful commands

Run these from the project directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend and backend together |
| `npm run ml:dev` | Start the optional ML service after its virtual environment is set up |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production frontend build |
| `npm run seed` | Reset and seed MongoDB content; currently blocked by missing seed modules |

## Troubleshooting

- **MongoDB connection errors:** Check that MongoDB is running, that
  `MONGO_URI` is correct, and that Atlas allows connections from your network.
  The API may still start, but database-backed routes will fail without a
  connection.
- **Port already in use:** Stop the other process using port 5173, 5000, or
  8000, or change the corresponding frontend/backend configuration.
- **Login or token errors:** Confirm that `JWT_SECRET` is set in
  `backend/.env`, then restart the backend.
- **ML service does not start:** Confirm that
  `ml_service\.venv\Scripts\python.exe` exists and that the requirements were
  installed into that environment. TensorFlow may need a supported Python
  version or additional setup on your machine.
- **No prediction for a food:** Check the `/foods` response. A food marked
  `ready: false` needs both model artifacts; see the dataset guide to train it.
