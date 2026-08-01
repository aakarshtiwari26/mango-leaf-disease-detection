import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    symptoms: [{ type: String, required: true }],
    causes: [{ type: String, required: true }],
    treatment: { type: String, required: true },
    prevention: { type: String, required: true },
    isHealthy: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Disease = mongoose.model("Disease", diseaseSchema);

export default Disease;
