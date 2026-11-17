import { Router } from "express";
import { searchCategoryController } from "../controllers/searchCategory.controller.js";

const router = Router();

// Admin routes for search categories
router.get("/", (req, res, next) => searchCategoryController.getAdminSearchCategories(req, res, next));
router.post("/", (req, res, next) => searchCategoryController.createSearchCategory(req, res, next));
router.get("/:id", (req, res, next) => searchCategoryController.getSearchCategoryById(req, res, next));
router.patch("/:id", (req, res, next) => searchCategoryController.updateSearchCategory(req, res, next));
router.delete("/:id", (req, res, next) => searchCategoryController.softDeleteSearchCategory(req, res, next));

export default router;
