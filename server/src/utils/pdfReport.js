import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const reportsDir = path.resolve("reports");

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

export function createPredictionReport({ prediction, disease, user }) {
  return new Promise((resolve, reject) => {
    const fileName = `prediction-${prediction._id}.pdf`;
    const filePath = path.join(reportsDir, fileName);
    const stream = fs.createWriteStream(filePath);
    const doc = new PDFDocument({ margin: 40 });

    doc.pipe(stream);
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

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}
