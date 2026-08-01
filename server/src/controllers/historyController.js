import Prediction from "../models/Prediction.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getPredictionHistory = asyncHandler(async (req, res) => {
  const { search = "", filter = "" } = req.query;
  const query = { user: req.user._id };

  if (search) {
    query.diseaseName = { $regex: search, $options: "i" };
  }

  if (filter === "healthy") {
    query.healthy = true;
  } else if (filter === "diseased") {
    query.healthy = false;
  }

  const predictions = await Prediction.find(query)
    .sort({ createdAt: -1 })
    .populate("disease");
  res.json({ predictions });
});

export const getPredictionById = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("disease");

  if (!prediction) {
    return res.status(404).json({ message: "Prediction not found" });
  }

  res.json({ prediction });
});

export const deletePrediction = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!prediction) {
    return res.status(404).json({ message: "Prediction not found" });
  }

  res.json({ message: "Prediction deleted successfully" });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalPredictions = await Prediction.countDocuments({
    user: req.user._id,
  });
  const diseasedCount = await Prediction.countDocuments({
    user: req.user._id,
    healthy: false,
  });
  const healthyCount = await Prediction.countDocuments({
    user: req.user._id,
    healthy: true,
  });
  const recentPredictions = await Prediction.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    stats: {
      totalPredictions,
      diseasedCount,
      healthyCount,
      recentPredictions,
    },
  });
});
