import { Router } from "express";
import { cmsController } from "../controllers/cms.controller.js";

const router = Router();

// Admin routes for CMS
router.get("/", (req, res, next) => cmsController.getAdminCms(req, res, next));
router.post("/", (req, res, next) => cmsController.createCms(req, res, next));
router.get("/:id", (req, res, next) => cmsController.getCmsById(req, res, next));
router.patch("/:id", (req, res, next) => cmsController.updateCms(req, res, next));
router.delete("/:id", (req, res, next) => cmsController.softDeleteCms(req, res, next));

export default router;
