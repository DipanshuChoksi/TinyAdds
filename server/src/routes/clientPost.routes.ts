import { Router } from "express";
import { clientPostController } from "../controllers/clientPost.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/", (req, res, next) => clientPostController.list(req, res, next));
router.post("/", (req, res, next) => clientPostController.create(req, res, next));
router.get("/:id", (req, res, next) => clientPostController.get(req, res, next));
router.put("/:id", (req, res, next) => clientPostController.update(req, res, next));
router.delete("/:id", (req, res, next) => clientPostController.remove(req, res, next));

export default router;
