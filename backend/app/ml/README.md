This directory is populated by running `model-training/train_inception_v3.ipynb`, which writes:

- `model.tflite` — Inception V3 disease classifier
- `leaf_gate.tflite` — binary "is this a mango leaf?" gate classifier
- `labels.json` — class index → disease name map, plus both inference thresholds and each
  model's measured test accuracy

None of these are committed yet — `backend/app/services/inference.py` will raise at startup
until they exist here. Run the notebook, then copy its outputs into this folder.
