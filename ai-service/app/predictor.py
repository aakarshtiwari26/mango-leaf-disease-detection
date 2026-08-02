import json
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from ai_edge_litert.interpreter import Interpreter

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
        self.interpreter = None
        self.input_index = None
        self.output_index = None

        if self.model_path.exists():
            self.interpreter = Interpreter(model_path=str(self.model_path))
            self.interpreter.allocate_tensors()
            self.input_index = self.interpreter.get_input_details()[0]["index"]
            self.output_index = self.interpreter.get_output_details()[0]["index"]

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
        if self.interpreter is None:
            raise RuntimeError("Model file not found. Train and save model.tflite first.")

        processed = self.preprocess(image_bytes)
        self.interpreter.set_tensor(self.input_index, processed)
        self.interpreter.invoke()
        predictions = self.interpreter.get_tensor(self.output_index)[0]

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
