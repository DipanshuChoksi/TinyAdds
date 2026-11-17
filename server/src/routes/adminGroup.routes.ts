import { Router } from "express";
import { groupController } from "../controllers/group.controller.js";

const router = Router();

// Admin routes for groups
router.get("/", (req, res, next) => groupController.getAdminGroups(req, res, next));
router.post("/", (req, res, next) => groupController.createGroup(req, res, next));
router.get("/:id", (req, res, next) => groupController.getGroupById(req, res, next));
router.patch("/:id", (req, res, next) => groupController.updateGroup(req, res, next));
router.delete("/:id", (req, res, next) => groupController.softDeleteGroup(req, res, next));

export default router;
