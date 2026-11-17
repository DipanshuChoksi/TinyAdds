import { Router } from "express";
import { packageController } from "../controllers/package.controller.js";

const router = Router();

// Public routes for packages
router.get("/", (req, res, next) => packageController.getPublicPackages(req, res, next));
router.get("/:id", (req, res, next) => packageController.getPublicPackageById(req, res, next));

export default router;
