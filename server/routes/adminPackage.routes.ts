import { Router } from "express";
import { packageController } from "../controllers/package.controller.js";

const router = Router();

// Admin routes for packages
router.get("/", (req, res, next) => packageController.getAdminPackages(req, res, next));
router.post("/", (req, res, next) => packageController.createPackage(req, res, next));
router.get("/:id", (req, res, next) => packageController.getPackageById(req, res, next));
router.patch("/:id", (req, res, next) => packageController.updatePackage(req, res, next));
router.delete("/:id", (req, res, next) => packageController.softDeletePackage(req, res, next));

export default router;
