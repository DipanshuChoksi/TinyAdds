import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", (req, res, next) => analyticsController.getAdminAnalytics(req, res, next));

export default router;
