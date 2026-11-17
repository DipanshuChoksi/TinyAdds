import type { Request, Response, NextFunction } from "express";
import { searchCategoryService } from "../services/searchCategory.service.js";
import {
  validateCreateSearchCategory,
  validateUpdateSearchCategory,
  validateObjectId,
  validatePagination,
} from "../validators/searchCategory.validator.js";
import { sendSuccess } from "../utils/response.js";

export class SearchCategoryController {
  /**
   * GET /api/search-categories
   * Public list of active search categories
   */
  async getPublicSearchCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = req.query.page || req.query.limit ? validatePagination(req.query) : undefined;
      const result = await searchCategoryService.getPublicSearchCategories(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/search-categories/:id
   * Public get search category by ID
   */
  async getPublicSearchCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const category = await searchCategoryService.getPublicSearchCategoryById(validId);
      res.status(200).json(sendSuccess(category));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/search-categories
   * Admin list of all search categories (including inactive)
   */
  async getAdminSearchCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = req.query.page || req.query.limit ? validatePagination(req.query) : undefined;
      const result = await searchCategoryService.getAdminSearchCategories(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/search-categories/:id
   * Admin get search category details by ID
   */
  async getSearchCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const category = await searchCategoryService.getSearchCategoryById(validId);
      res.status(200).json(sendSuccess(category));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/search-categories
   * Admin create search category
   */
  async createSearchCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateSearchCategory(req.body);
      const category = await searchCategoryService.createSearchCategory(input);
      res.status(201).json(sendSuccess(category));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/search-categories/:id
   * Admin update search category
   */
  async updateSearchCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const input = validateUpdateSearchCategory(req.body);
      const category = await searchCategoryService.updateSearchCategory(validId, input);
      res.status(200).json(sendSuccess(category));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/search-categories/:id
   * Admin soft delete search category
   */
  async softDeleteSearchCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      await searchCategoryService.softDeleteSearchCategory(validId);
      res.status(200).json(sendSuccess({ message: "Search Category deleted successfully" }));
    } catch (error) {
      next(error);
    }
  }
}

export const searchCategoryController = new SearchCategoryController();
