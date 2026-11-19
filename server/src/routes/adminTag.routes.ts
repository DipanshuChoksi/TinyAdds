import { Router } from "express";
import { tagController } from "../controllers/tag.controller.js";

const router = Router();

// Admin routes for tags
router.get("/", (req, res, next) => tagController.getAdminTags(req, res, next));
router.post("/", (req, res, next) => tagController.createTag(req, res, next));
router.get("/:id", (req, res, next) => tagController.getTagById(req, res, next));
router.patch("/:id", (req, res, next) => tagController.updateTag(req, res, next));
router.delete("/:id", (req, res, next) => tagController.softDeleteTag(req, res, next));
// router.patch("/:id/restore", (req, res, next) => tagController.restoreTag(req, res, next));

export default router;
