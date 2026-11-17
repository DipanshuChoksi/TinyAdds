import { Router } from "express";
import { cmsController } from "../controllers/cms.controller.js";

const router = Router();

// Public routes
router.get("/", (req, res, next) => cmsController.getPublicCms(req, res, next));
router.get("/:slug", (req, res, next) => cmsController.getPublicCmsBySlug(req, res, next));

export default router;
