import json
import tempfile
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras import layers
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam

from .model import build_model

AUTOTUNE = tf.data.AUTOTUNE

_AUGMENTATION = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.08),
    layers.RandomZoom(0.15),
    layers.RandomTranslation(0.15, 0.15),
])
_NORMALIZE = layers.Rescaling(1.0 / 255)


def _prepare(dataset: tf.data.Dataset, cache_path: Path, batch_size: int, augment: bool) -> tf.data.Dataset:
    dataset = dataset.unbatch().cache(str(cache_path))
    if augment:
        dataset = dataset.shuffle(1024, reshuffle_each_iteration=True)
    dataset = dataset.batch(batch_size)
    if augment:
        dataset = dataset.map(
            lambda x, y: (_NORMALIZE(_AUGMENTATION(x, training=True)), y),
            num_parallel_calls=AUTOTUNE,
        )
    else:
        dataset = dataset.map(lambda x, y: (_NORMALIZE(x), y), num_parallel_calls=AUTOTUNE)
    return dataset.prefetch(AUTOTUNE)


def train_model(
    dataset_dir: str = "dataset",
    model_path: str = "model.keras",
    image_size: int = 299,
    batch_size: int = 32,
):
    dataset_dir = Path(dataset_dir)
    model_path = Path(model_path)
    model_path.parent.mkdir(parents=True, exist_ok=True)

    raw_train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(image_size, image_size),
        batch_size=batch_size,
        label_mode="categorical",
    )
    raw_val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(image_size, image_size),
        batch_size=batch_size,
        label_mode="categorical",
        shuffle=False,
    )

    class_names = raw_train_ds.class_names
    labels_path = model_path.with_name("class_indices.json")
    labels_path.write_text(json.dumps(class_names, indent=2))
    print(f"Class index order saved to {labels_path}: {class_names}")

    cache_dir = Path(tempfile.mkdtemp(prefix="mango_train_cache_"))
    train_ds = _prepare(raw_train_ds, cache_dir / "train", batch_size, augment=True)
    val_ds = _prepare(raw_val_ds, cache_dir / "val", batch_size, augment=False)

    model, base_model = build_model(len(class_names), image_size)

    model_path_str = str(model_path)
    callbacks = [
        EarlyStopping(monitor="val_accuracy", patience=7, restore_best_weights=True),
        ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, min_lr=1e-6),
        ModelCheckpoint(model_path_str, monitor="val_accuracy", save_best_only=True),
    ]

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=20,
        callbacks=callbacks,
    )

    base_model.trainable = True
    for layer in base_model.layers[:249]:
        layer.trainable = False

    model.compile(
        optimizer=Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=10,
        callbacks=callbacks,
    )

    predictions = model.predict(val_ds, verbose=0)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = np.concatenate([np.argmax(y.numpy(), axis=1) for _, y in val_ds], axis=0)

    report = classification_report(true_classes, predicted_classes, target_names=class_names)
    matrix = confusion_matrix(true_classes, predicted_classes)

    artifacts_dir = Path("artifacts")
    artifacts_dir.mkdir(exist_ok=True)
    (artifacts_dir / "classification_report.txt").write_text(report)

    plt.figure(figsize=(10, 8))
    plt.imshow(matrix, interpolation="nearest", cmap="Blues")
    plt.title("Confusion Matrix")
    plt.colorbar()
    plt.xticks(range(len(class_names)), class_names, rotation=45, ha="right")
    plt.yticks(range(len(class_names)), class_names)
    plt.tight_layout()
    plt.savefig(artifacts_dir / "confusion_matrix.png", dpi=200)

    print(f"Model saved to {model_path}")
    print(report)


if __name__ == "__main__":
    train_model()
