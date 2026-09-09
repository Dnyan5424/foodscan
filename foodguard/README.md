# FoodGuard — Full Stack (Frontend + Backend + AI/ML)

A complete food-safety platform built for a college Community Engagement
Project: React (Vite + Tailwind) frontend, Node/Express + MongoDB backend,
with an OCR label scanner and two lightweight AI/ML services built in.

## Project layout

```
foodguard/
  src/                  → React frontend (see below)
  backend/              → Node/Express API + MongoDB models + AI/ML services
  README.md             → this file
```

## Quick start

You need two terminals — one for the API, one for the frontend.

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run seed               # loads guides/myths/awareness/quiz content into Mongo
npm run dev                 # starts the API on http://localhost:5000
```

**2. Frontend**
```bash
npm install
cp .env.example .env       # VITE_API_URL defaults to http://localhost:5000/api
npm run dev                  # starts the app on http://localhost:5173
```

If the backend isn't running or you haven't logged in, the Expiry Tracker,
Complaints, and AI Assistant pages fall back to a local, in-browser demo mode
automatically — so the UI is still fully explorable on its own.

## What's implemented

### Frontend (`src/`)
- 16 routed pages: Home, Expiry Tracker, Product Scanner, Complaints,
  Adulteration Guide (list + per-category detail), Awareness Hub, Myth vs
  Fact, Quiz, AI Assistant, Government Resources, Community Dashboard,
  Profile, Admin, About, Login, Signup
- `src/data/` — editable content files (guides, quiz, myths, resources) —
  same content is mirrored into `backend/seed/content/` for the database
- `src/services/api.js` — single API client used by every page
- `src/context/AuthContext.jsx` — JWT-based auth, token kept in `localStorage`
- Design system in `tailwind.config.js` (forest green / charcoal / orange
  palette, rounded cards, pill buttons)

### Backend (`backend/`)
- **Auth**: signup/login with bcrypt-hashed passwords + JWT (`/api/auth`)
- **Products** (Expiry Tracker): full CRUD, scoped per user (`/api/products`)
- **Complaints**: submission with auto-generated tracking IDs
  (`FS-2026-000123` style) and a 5-stage status timeline; admin routes to
  advance status and list all complaints (`/api/complaints`)
- **Guides / Awareness / Quiz**: read APIs backed by MongoDB, seeded from
  `backend/seed/content/` (`/api/guides`, `/api/awareness`, `/api/quiz`)
- **AI/ML services** (`backend/src/services/`):
  - `labelOcrService.js` — real OCR via `tesseract.js`, plus regex parsing
    tuned for Indian packaged-food labels to pull out expiry date,
    manufacture date, and batch number. Exposed at `POST /api/scan`.
  - `complaintClassifier.js` — an explainable, dependency-free keyword
    classifier that suggests a complaint's issue type from its free-text
    description. Chosen deliberately over a black-box model since there's
    no labeled training data yet; swap in a trained classifier once you
    have real complaint data.
  - `assistantService.js` — a retrieval-based assistant: scores the user's
    question against the platform's own guide/myth content and returns the
    best match, no external API key required. `POST /api/assistant/ask`.

## Upgrading the AI layer later

Both AI services are designed to be swapped for something stronger without
touching any other code:

- **Assistant → real LLM**: replace the body of `answerQuestion()` in
  `assistantService.js` with a call to an LLM API (e.g. Anthropic's
  `/v1/messages`), passing the matched guide/myth text as grounding context
  — a simple RAG pattern. Add `ANTHROPIC_API_KEY` to `.env`.
- **Classifier → trained model**: once you have real labeled complaints,
  train a small text classifier (scikit-learn, or a TF-IDF + logistic
  regression model) and serve it from a small Python microservice, or port
  the logic to TensorFlow.js if you want to keep everything in Node.
- **OCR → barcode + Open Food Facts**: for packaged foods with a barcode,
  add `html5-qrcode` on the frontend to decode the barcode client-side, then
  call the free Open Food Facts API
  (`https://world.openfoodfacts.org/api/v0/product/<barcode>.json`) from a
  new backend route to get structured ingredients instead of parsing a
  photo. This is more reliable than OCR wherever a barcode exists — treat
  the OCR scanner as the fallback for loose/unbarcoded items.

## Testing notes

Every backend file has been syntax-checked and the server has been smoke
tested (boots cleanly, `/api/health` responds, routes correctly report a
database timeout when no `MONGO_URI` is set rather than crashing). The OCR
label-parsing regex and the complaint keyword classifier were both unit
tested against sample inputs. The frontend has been built end-to-end with
`npm run build` with zero errors. Actual OCR accuracy and live MongoDB
behavior should be verified once you connect a real database and test with
real label photos, since neither could be exercised inside this build
environment (no outbound network access to MongoDB Atlas or the Tesseract
language-data CDN here).
