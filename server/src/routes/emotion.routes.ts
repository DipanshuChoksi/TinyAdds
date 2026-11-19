import { Router } from "express";
import { emotionController } from "../controllers/emotion.controller.js";

const router = Router();

// Public routes
router.get("/", (req, res, next) => emotionController.getPublicEmotions(req, res, next));
router.get("/slug/:slug", (req, res, next) => emotionController.getPublicEmotionBySlug(req, res, next));
router.get("/:id", (req, res, next) => emotionController.getPublicEmotionById(req, res, next));

export default router;
