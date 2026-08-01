import { Router } from "express";
import {
  deletePrediction,
  getDashboardStats,
  getPredictionById,
  getPredictionHistory,
} from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats", protect, getDashboardStats);
router.get("/", protect, getPredictionHistory);
router.get("/:id", protect, getPredictionById);
router.delete("/:id", protect, deletePrediction);

export default router;
