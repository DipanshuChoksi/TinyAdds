import { Router } from "express";
import { groupController } from "../controllers/group.controller.js";

const router = Router();

// Public routes for groups
router.get("/", (req, res, next) => groupController.getPublicGroups(req, res, next));
router.get("/:id", (req, res, next) => groupController.getPublicGroupById(req, res, next));

export default router;
