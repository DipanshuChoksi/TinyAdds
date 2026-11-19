import { Router } from "express";
import { tagController } from "../controllers/tag.controller.js";

const router = Router();

// Public routes
router.get("/", (req, res, next) => tagController.getPublicTags(req, res, next));
router.post("/", (req, res, next) => tagController.createTag(req, res, next));
router.get("/:id", (req, res, next) => tagController.getPublicTagById(req, res, next));

export default router;
