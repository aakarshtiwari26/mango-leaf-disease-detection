import Disease from "../models/Disease.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getDiseases = asyncHandler(async (_req, res) => {
  const diseases = await Disease.find().sort({ name: 1 });
  res.json({ diseases });
});

export const getDiseaseBySlug = asyncHandler(async (req, res) => {
  const disease = await Disease.findOne({ slug: req.params.slug });

  if (!disease) {
    return res.status(404).json({ message: "Disease not found" });
  }

  res.json({ disease });
});
