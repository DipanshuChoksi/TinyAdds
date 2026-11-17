import { Router } from "express";
import { bannerSectionController } from "../controllers/bannerSection.controller.js";

const router = Router();

// Public routes for banner sections
router.get("/", (req, res, next) => bannerSectionController.getPublicBannerSections(req, res, next));
router.get("/:id", (req, res, next) => bannerSectionController.getPublicBannerSectionById(req, res, next));

export default router;
