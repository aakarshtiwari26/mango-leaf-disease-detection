import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPrediction,
  downloadPredictionReport,
} from "../controllers/predictionController.js";
import { imageUpload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/", protect, imageUpload.single("image"), createPrediction);
router.get("/:id/report", protect, downloadPredictionReport);

export default router;
