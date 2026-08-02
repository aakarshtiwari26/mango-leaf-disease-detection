import fs from "fs/promises";
import Prediction from "../models/Prediction.js";
import Disease from "../models/Disease.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { aiServiceClient } from "../config/aiService.js";
import { writePredictionReport } from "../utils/pdfReport.js";

function buildImageUrl(req, filename) {
  return `/uploads/${filename}`;
}

export const createPrediction = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "An image file is required" });
  }

  const start = Date.now();
  const fileStream = await fs.readFile(req.file.path);
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([fileStream], { type: req.file.mimetype }),
    req.file.originalname,
  );

  const aiResponse = await aiServiceClient.post("/predict", formData);

  const predictionTimeMs = Date.now() - start;
  const payload = aiResponse.data;
  const disease = await Disease.findOne({ name: payload.diseaseName });

  if (!disease) {
    return res.status(500).json({ message: "Disease metadata not found" });
  }

  const imageUrl = buildImageUrl(req, req.file.filename);
  const prediction = await Prediction.create({
    user: req.user._id,
    disease: disease._id,
    diseaseName: payload.diseaseName,
    confidence: payload.confidence,
    healthy: payload.diseaseName.toLowerCase() === "healthy",
    imageUrl,
    previewUrl: imageUrl,
    predictionTimeMs,
    probabilities: payload.probabilities || [],
    description: disease.description,
    treatment: payload.treatment,
    symptoms: payload.symptoms,
    causes: payload.causes,
    prevention: payload.prevention,
  });

  res.status(201).json({
    message: "Prediction completed successfully",
    prediction: {
      id: prediction._id,
      diseaseName: prediction.diseaseName,
      confidence: prediction.confidence,
      healthy: prediction.healthy,
      treatment: prediction.treatment,
      description: prediction.description,
      symptoms: prediction.symptoms,
      causes: prediction.causes,
      prevention: prediction.prevention,
      predictionTimeMs: prediction.predictionTimeMs,
      probabilities: prediction.probabilities,
      imageUrl: prediction.imageUrl,
      previewUrl: prediction.previewUrl,
      reportUrl: `/api/predictions/${prediction._id}/report`,
    },
  });
});

export const downloadPredictionReport = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("disease");

  if (!prediction) {
    return res.status(404).json({ message: "Report not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="prediction-${prediction._id}.pdf"`,
  );

  await writePredictionReport(
    { prediction, disease: prediction.disease, user: req.user },
    res,
  );
});
