import { Router } from "express";
import { adminPostController } from "../controllers/adminPost.controller.js";
import { requireAdminAccess } from "../middleware/auth.js";

const router = Router();
router.use(requireAdminAccess);
router.get("/", (req, res, next) => adminPostController.list(req, res, next));
router.post("/", (req, res, next) => adminPostController.create(req, res, next));
router.patch("/:id/status", (req, res, next) => adminPostController.updateStatus(req, res, next));
router.get("/:id", (req, res, next) => adminPostController.get(req, res, next));
router.put("/:id", (req, res, next) => adminPostController.update(req, res, next));

export default router;
