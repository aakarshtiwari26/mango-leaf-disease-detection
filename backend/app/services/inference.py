"""Loads the leaf-gate and disease-classifier TFLite models and runs the two-stage
prediction pipeline: reject non-mango-leaf / low-confidence images before ever
returning a disease label. See model-training/train_inception_v3.ipynb for how
model.tflite, leaf_gate.tflite, and labels.json are produced.
"""

import io
import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Optional

import numpy as np
from PIL import Image

try:
    from ai_edge_litert.interpreter import Interpreter
except ImportError:
    import tensorflow as _tf

    Interpreter = _tf.lite.Interpreter

from app.config import get_settings

ML_DIR = Path(__file__).resolve().parent.parent / "ml"
GATE_IMG_SIZE = (224, 224)
DISEASE_IMG_SIZE = (299, 299)

NOT_A_LEAF_MESSAGE = "This doesn't look like a mango leaf — please upload a clear photo of one."


@dataclass
class InferenceResult:
    status: str
    prediction: Optional[str] = None
    confidence: Optional[float] = None
    message: Optional[str] = None


@lru_cache
def _load_labels() -> dict:
    with open(ML_DIR / "labels.json") as f:
        return json.load(f)


@lru_cache
def _load_gate_interpreter() -> Interpreter:
    interpreter = Interpreter(model_path=str(ML_DIR / "leaf_gate.tflite"))
    interpreter.allocate_tensors()
    return interpreter


@lru_cache
def _load_disease_interpreter() -> Interpreter:
    interpreter = Interpreter(model_path=str(ML_DIR / "model.tflite"))
    interpreter.allocate_tensors()
    return interpreter


def _preprocess(image_bytes: bytes, size: tuple[int, int]) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize(size)
    array = np.asarray(image, dtype=np.float32)
    array = (array / 127.5) - 1.0
    return np.expand_dims(array, axis=0)


def _run(interpreter: Interpreter, input_array: np.ndarray) -> np.ndarray:
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    interpreter.set_tensor(input_details[0]["index"], input_array)
    interpreter.invoke()
    return interpreter.get_tensor(output_details[0]["index"])


def predict(image_bytes: bytes) -> InferenceResult:
    settings = get_settings()
    labels_payload = _load_labels()
    gate_threshold = labels_payload.get("gate_threshold", settings.gate_threshold)
    confidence_threshold = labels_payload.get("confidence_threshold", settings.confidence_threshold)

    gate_input = _preprocess(image_bytes, GATE_IMG_SIZE)
    gate_output = _run(_load_gate_interpreter(), gate_input)
    gate_score = float(gate_output.ravel()[0])

    if gate_score < gate_threshold:
        return InferenceResult(status="rejected", message=NOT_A_LEAF_MESSAGE)

    disease_input = _preprocess(image_bytes, DISEASE_IMG_SIZE)
    disease_output = _run(_load_disease_interpreter(), disease_input)
    probs = disease_output.ravel()
    top_index = int(np.argmax(probs))
    top_confidence = float(probs[top_index])

    if top_confidence < confidence_threshold:
        return InferenceResult(status="rejected", message=NOT_A_LEAF_MESSAGE)

    class_name = labels_payload["labels"][str(top_index)]
    return InferenceResult(status="ok", prediction=class_name, confidence=top_confidence)
