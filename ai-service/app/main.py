from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from .predictor import MangoDiseasePredictor

load_dotenv()

app = FastAPI(title=os.getenv("APP_TITLE", "Mango Leaf Disease Detection AI Service"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("MODEL_PATH", "./model.tflite")
IMAGE_SIZE = int(os.getenv("IMAGE_SIZE", "299"))
predictor = MangoDiseasePredictor(MODEL_PATH, IMAGE_SIZE)

if not os.path.exists(MODEL_PATH):
    print(
        "model.tflite not found. Train it with: cd ai-service && .venv/bin/python -m app.train"
    )


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are supported")

    image_bytes = await file.read()

    try:
        result = predictor.predict(image_bytes)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
