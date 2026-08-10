# Mango Leaf Disease Detection

A full-stack web app that classifies mango leaf diseases from a photo. Upload an image, get back
a predicted disease class (or "healthy") with a confidence score, and browse a history of past
predictions.

The model is Inception V3, fine-tuned via transfer learning on the
[Mango Leaf Disease Dataset](https://www.kaggle.com/datasets/aryashah2k/mango-leaf-disease-dataset)
(Kaggle), exported to TensorFlow Lite for lightweight serving. A second, smaller binary classifier
gates every upload first, so the app doesn't confidently hallucinate a disease label for a photo
that isn't a mango leaf at all.

## Architecture

```
┌─────────────┐      HTTPS       ┌──────────────────┐
│   React +   │ ───────────────▶ │     FastAPI        │
│    Vite     │ ◀─────────────── │   (Render, Docker)  │
│  (Vercel)   │   JSON response  └────────┬─────────────┘
└─────────────┘                            │
                                            │
                     ┌──────────────────────┼───────────────────────┐
                     ▼                      ▼                       ▼
             ┌───────────────┐   ┌───────────────────┐   ┌───────────────────┐
             │ Leaf gate      │   │ Inception V3        │   │  MongoDB Atlas      │
             │ (leaf_gate.    │──▶│ disease classifier  │   │  (motor, async)     │
             │  tflite)       │   │ (model.tflite)       │   │  prediction history │
             └───────────────┘   └──────────┬───────────┘   └───────────────────┘
                                              │
                                              ▼
                                     ┌───────────────────┐
                                     │     ImageKit         │
                                     │  (uploaded image)     │
                                     └───────────────────┘
```

**Request flow for `POST /predict`:**
1. Image goes through the leaf-gate binary classifier. If it doesn't look like a mango leaf, the
   API returns `"status": "rejected"` immediately — nothing is uploaded or saved.
2. Otherwise the Inception V3 classifier runs. If its top confidence is below the tuned threshold,
   the request is also rejected rather than returning a low-confidence guess.
3. Only a confident, gate-passed prediction gets its image uploaded to ImageKit and a document
   written to MongoDB.

## Tech stack

| Layer | Choice |
|---|---|
| Model | Inception V3 (transfer learning, Keras) → TensorFlow Lite for serving |
| Backend | FastAPI (Python), containerized with Docker |
| Database | MongoDB Atlas via the async `motor` driver |
| Image storage | ImageKit (`imagekitio` Python SDK) |
| Frontend | React + Vite |
| Deployment | Vercel (frontend), Render (backend, Docker) |

## Repository structure

```
/mango-leaf-disease-detection
  /backend
    /app
      main.py              # FastAPI app entrypoint
      config.py             # env var loading (pydantic-settings)
      database.py            # MongoDB (motor) connection
      /models
        prediction.py         # Pydantic response/document schemas
      /routers
        predict.py           # POST /predict
        history.py           # GET /history
      /services
        inference.py          # loads TFLite models, runs the gate + classifier pipeline
        imagekit_service.py    # uploads image, returns URL
      /ml
        model.tflite            # exported disease classifier (from the training notebook)
        leaf_gate.tflite         # exported binary leaf-gate classifier
        labels.json              # class index → disease name + thresholds + accuracy
    Dockerfile
    requirements.txt
    .env.example
  /frontend
    /src
      /components
        UploadForm.jsx
        ResultCard.jsx
        HistoryList.jsx
      /api
        client.js             # axios instance
      App.jsx
      main.jsx
    vite.config.js
    vercel.json
    .env.example
  /model-training
    train_inception_v3.ipynb   # dataset → transfer learning → TFLite export notebook
  render.yaml
  README.md
  .gitignore
```

## Model performance

Filled in after running `model-training/train_inception_v3.ipynb` end-to-end — the notebook writes
these same numbers into `backend/app/ml/labels.json` so the deployed thresholds always match what
was actually measured on the held-out test set.

| Model | Metric | Value |
|---|---|---|
| Disease classifier (Inception V3) | Test accuracy | _fill in after training_ |
| Disease classifier | Confidence threshold | 0.65 (starting point — tune from the notebook's threshold sweep) |
| Leaf gate (MobileNetV2) | Test accuracy | _fill in after training_ |
| Leaf gate | Decision threshold | 0.5 |

Confusion matrix: _paste the disease-classifier confusion matrix image from the notebook here after training._

## Local development

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in real values
uvicorn app.main:app --reload
```

The API needs `backend/app/ml/model.tflite`, `leaf_gate.tflite`, and `labels.json` to exist — run
the training notebook first (or copy in already-trained artifacts) or `/predict` will fail at
inference time.

API docs (Swagger UI) are served at `http://localhost:8000/docs` once running.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000
npm run dev
```

### Model training

Open `model-training/train_inception_v3.ipynb` in Google Colab or Kaggle Notebooks (GPU runtime
recommended). It downloads the dataset via `kagglehub`, trains both models, and writes
`model.tflite`, `leaf_gate.tflite`, and `labels.json` directly into `backend/app/ml/` (adjust the
output path at the top of the export cells if running somewhere the relative path doesn't resolve
— e.g. download the three files and copy them into `backend/app/ml/` manually).

## Environment variables

### Backend (`backend/.env`, and as Render environment variables)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `MONGO_DB_NAME` | Database name (defaults to `mango_leaf`) |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |
| `CORS_ORIGINS` | Comma-separated allowed origins (include your Vercel URL) |
| `CONFIDENCE_THRESHOLD` | Fallback disease-classifier threshold (overridden by `labels.json` if present) |
| `GATE_THRESHOLD` | Fallback leaf-gate threshold (overridden by `labels.json` if present) |

### Frontend (`frontend/.env`, and as a Vercel environment variable)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed FastAPI backend, e.g. `https://mango-leaf-backend.onrender.com` |

## Deployment

### Backend → Render

`render.yaml` at the repo root defines a Docker web service pointing at `backend/Dockerfile`.
In the Render dashboard: **New → Blueprint**, point it at this repo, and Render will pick up
`render.yaml`. Fill in the `sync: false` environment variables (Mongo URI, ImageKit keys, CORS
origins) in the Render dashboard — they're intentionally not stored in the repo.

Health check: `GET /health`.

### Frontend → Vercel

Import the repo in Vercel, set the **root directory** to `frontend`, and set `VITE_API_URL` in
Vercel's Project → Settings → Environment Variables to your Render backend's URL. `vercel.json`
inside `frontend/` handles the SPA rewrite so client-side routing (if added later) doesn't 404 on
refresh.

### MongoDB Atlas

Create a free cluster, add a database user, and allow network access from Render (either `0.0.0.0/0`
for simplicity, or Render's specific outbound IPs if you want it locked down). The connection
string format Atlas gives you:

```
mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
```

### ImageKit

Create a free ImageKit account; the public key, private key, and URL endpoint are all on the
dashboard's **Developer Options** page.

## Accounts you need to create

To fill in the environment variables above with real values:
- **MongoDB Atlas** — free cluster → `MONGO_URI`
- **ImageKit** — free account → `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- **Render** — for backend hosting, where you'll paste the Mongo/ImageKit values as env vars
- **Vercel** — for frontend hosting, where you'll set `VITE_API_URL`
- **Kaggle** — to run the training notebook's dataset download (`kagglehub` will prompt for
  credentials if not already configured in the notebook environment)
