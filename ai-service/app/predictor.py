import json
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

from .disease_data import DISEASE_METADATA


# Fallback order for models trained before train.py started persisting
# class_indices.json. Matches Keras's ImageDataGenerator.flow_from_directory()
# default behavior of sorting dataset subfolder names alphabetically.
DEFAULT_CLASS_NAMES = [
    "Anthracnose",
    "Die Back",
    "Gall Midge",
    "Healthy",
    "Leaf Webber",
    "Leaf Blight",
]


class MangoDiseasePredictor:
    def __init__(self, model_path: str, image_size: int = 299):
        self.model_path = Path(model_path)
        self.image_size = image_size
        self.model = load_model(self.model_path) if self.model_path.exists() else None
        self.class_names = self._load_class_names()

    def _load_class_names(self):
        labels_path = self.model_path.with_name("class_indices.json")
        if labels_path.exists():
            return json.loads(labels_path.read_text())
        return DEFAULT_CLASS_NAMES

    def preprocess(self, image_bytes: bytes) -> np.ndarray:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = np.array(image)
        image = cv2.resize(image, (self.image_size, self.image_size))
        image = image.astype("float32") / 255.0
        return np.expand_dims(image, axis=0)

    def predict(self, image_bytes: bytes):
        if self.model is None:
            raise RuntimeError("Model file not found. Train and save model.keras first.")

        processed = self.preprocess(image_bytes)
        predictions = self.model.predict(processed, verbose=0)[0]
        top_index = int(np.argmax(predictions))
        disease_name = self.class_names[top_index]
        confidence = float(predictions[top_index])

        metadata = DISEASE_METADATA[disease_name]
        probabilities = [
            {"disease": self.class_names[index], "confidence": float(score)}
            for index, score in enumerate(predictions)
        ]

        return {
            "diseaseName": disease_name,
            "confidence": confidence,
            "treatment": metadata["treatment"],
            "symptoms": metadata["symptoms"],
            "causes": metadata["causes"],
            "prevention": metadata["prevention"],
            "probabilities": probabilities,
        }
