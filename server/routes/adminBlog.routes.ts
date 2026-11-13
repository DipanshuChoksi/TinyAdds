import { Router } from "express";
import { blogController } from "../controllers/blog.controller.js";

const router = Router();

// Admin routes for blogs
router.get("/", (req, res, next) => blogController.getAdminBlogs(req, res, next));
router.post("/", (req, res, next) => blogController.createBlog(req, res, next));
router.get("/:id", (req, res, next) => blogController.getBlogById(req, res, next));
router.patch("/:id", (req, res, next) => blogController.updateBlog(req, res, next));
router.delete("/:id", (req, res, next) => blogController.softDeleteBlog(req, res, next));

export default router;
