import { Router } from "express";
import { searchCategoryController } from "../controllers/searchCategory.controller.js";

const router = Router();

// Public routes for search categories
router.get("/", (req, res, next) => searchCategoryController.getPublicSearchCategories(req, res, next));
router.get("/:id", (req, res, next) => searchCategoryController.getPublicSearchCategoryById(req, res, next));

export default router;
