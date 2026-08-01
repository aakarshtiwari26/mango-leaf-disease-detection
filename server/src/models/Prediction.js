import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    disease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disease",
      required: true,
    },
    diseaseName: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    healthy: { type: Boolean, default: false },
    imageUrl: { type: String, required: true },
    previewUrl: { type: String, required: true },
    predictionTimeMs: { type: Number, required: true },
    probabilities: [
      {
        disease: { type: String, required: true },
        confidence: { type: Number, required: true },
      },
    ],
    treatment: { type: String, required: true },
    description: { type: String, required: true },
    symptoms: [{ type: String, required: true }],
    causes: [{ type: String, required: true }],
    prevention: { type: String, required: true },
    reportPath: { type: String, default: "" },
  },
  { timestamps: true },
);

const Prediction = mongoose.model("Prediction", predictionSchema);

export default Prediction;
