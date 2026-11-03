import { Router } from "express";
import { emotionController } from "../controllers/emotion.controller.js";

const router = Router();

// Admin routes for emotions
router.get("/", (req, res, next) => emotionController.getAdminEmotions(req, res, next));
router.post("/", (req, res, next) => emotionController.createEmotion(req, res, next));
router.get("/:id", (req, res, next) => emotionController.getEmotionById(req, res, next));
router.patch("/:id", (req, res, next) => emotionController.updateEmotion(req, res, next));
router.delete("/:id", (req, res, next) => emotionController.softDeleteEmotion(req, res, next));
// router.patch("/:id/restore", (req, res, next) => emotionController.restoreEmotion(req, res, next));

export default router;

