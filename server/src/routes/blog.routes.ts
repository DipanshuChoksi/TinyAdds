import { Router } from "express";
import { blogController } from "../controllers/blog.controller.js";

const router = Router();

// Public routes
router.get("/", (req, res, next) => blogController.getPublicBlogs(req, res, next));
router.get("/:id", (req, res, next) => blogController.getPublicBlogById(req, res, next));

export default router;
