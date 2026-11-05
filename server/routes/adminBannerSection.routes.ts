import { Router } from "express";
import { bannerSectionController } from "../controllers/bannerSection.controller.js";

const router = Router();

// Admin routes for banner sections
router.get("/", (req, res, next) => bannerSectionController.getAdminBannerSections(req, res, next));
router.post("/", (req, res, next) => bannerSectionController.createBannerSection(req, res, next));
router.get("/:id", (req, res, next) => bannerSectionController.getBannerSectionById(req, res, next));
router.patch("/:id", (req, res, next) => bannerSectionController.updateBannerSection(req, res, next));
router.delete("/:id", (req, res, next) => bannerSectionController.softDeleteBannerSection(req, res, next));

export default router;
