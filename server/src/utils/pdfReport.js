import PDFDocument from "pdfkit";

export function writePredictionReport({ prediction, disease, user }, outputStream) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });

    doc.pipe(outputStream);
    doc
      .fontSize(22)
      .text("Mango Leaf Disease Detection Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Generated for: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Disease: ${prediction.diseaseName}`);
    doc.text(`Confidence: ${(prediction.confidence * 100).toFixed(2)}%`);
    doc.text(`Healthy: ${prediction.healthy ? "Yes" : "No"}`);
    doc.moveDown();
    doc.text(`Description: ${disease.description}`);
    doc.moveDown();
    doc.text(`Symptoms: ${prediction.symptoms.join(", ")}`);
    doc.text(`Causes: ${prediction.causes.join(", ")}`);
    doc.text(`Treatment: ${prediction.treatment}`);
    doc.text(`Prevention: ${prediction.prevention}`);
    doc.moveDown();
    doc.text(`Prediction Time: ${prediction.predictionTimeMs} ms`);
    doc.end();

    outputStream.on("finish", resolve);
    outputStream.on("error", reject);
  });
}
