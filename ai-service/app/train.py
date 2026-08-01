import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from .model import build_model


def train_model(dataset_dir: str = "dataset", model_path: str = "model.keras", image_size: int = 299):
    dataset_dir = Path(dataset_dir)
    model_path = Path(model_path)
    model_path.parent.mkdir(parents=True, exist_ok=True)

    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        validation_split=0.2,
        rotation_range=30,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.15,
        zoom_range=0.15,
        horizontal_flip=True,
        fill_mode="nearest",
    )

    train_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=(image_size, image_size),
        batch_size=16,
        class_mode="categorical",
        subset="training",
        shuffle=True,
    )

    validation_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=(image_size, image_size),
        batch_size=16,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
    )

    class_names = [
        name
        for name, _ in sorted(train_generator.class_indices.items(), key=lambda item: item[1])
    ]
    labels_path = model_path.with_name("class_indices.json")
    labels_path.write_text(json.dumps(class_names, indent=2))
    print(f"Class index order saved to {labels_path}: {class_names}")

    model, base_model = build_model(len(train_generator.class_indices), image_size)

    callbacks = [
        EarlyStopping(monitor="val_accuracy", patience=7, restore_best_weights=True),
        ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, min_lr=1e-6),
        ModelCheckpoint(model_path, monitor="val_accuracy", save_best_only=True),
    ]

    model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=20,
        callbacks=callbacks,
    )

    base_model.trainable = True
    for layer in base_model.layers[:249]:
        layer.trainable = False

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=10,
        callbacks=callbacks,
    )

    validation_generator.reset()
    predictions = model.predict(validation_generator, verbose=0)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = validation_generator.classes

    report = classification_report(true_classes, predicted_classes, target_names=list(validation_generator.class_indices.keys()))
    matrix = confusion_matrix(true_classes, predicted_classes)

    artifacts_dir = Path("artifacts")
    artifacts_dir.mkdir(exist_ok=True)
    (artifacts_dir / "classification_report.txt").write_text(report)

    plt.figure(figsize=(10, 8))
    plt.imshow(matrix, interpolation="nearest", cmap="Blues")
    plt.title("Confusion Matrix")
    plt.colorbar()
    plt.xticks(range(len(validation_generator.class_indices)), validation_generator.class_indices.keys(), rotation=45, ha="right")
    plt.yticks(range(len(validation_generator.class_indices)), validation_generator.class_indices.keys())
    plt.tight_layout()
    plt.savefig(artifacts_dir / "confusion_matrix.png", dpi=200)

    print(f"Model saved to {model_path}")
    print(report)


if __name__ == "__main__":
    train_model()
