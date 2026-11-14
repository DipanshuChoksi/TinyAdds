import { Router } from "express";
import { clientPostController } from "../controllers/clientPost.controller.js";

const router = Router();

// Public routes for approved posts (date-filtered)
router.get("/", (req, res, next) => clientPostController.publicList(req, res, next));
router.get("/:id", (req, res, next) => clientPostController.get(req, res, next));

export default router;
