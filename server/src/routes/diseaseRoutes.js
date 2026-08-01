import { Router } from "express";
import {
  getDiseaseBySlug,
  getDiseases,
} from "../controllers/diseaseController.js";

const router = Router();

router.get("/", getDiseases);
router.get("/:slug", getDiseaseBySlug);

export default router;
