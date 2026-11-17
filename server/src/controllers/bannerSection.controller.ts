import type { Request, Response, NextFunction } from "express";
import { bannerSectionService } from "../services/bannerSection.service.js";
import {
  validateCreateBannerSection,
  validateUpdateBannerSection,
  validateObjectId,
  validatePagination,
} from "../validators/bannerSection.validator.js";
import { sendSuccess } from "../utils/response.js";

export class BannerSectionController {
  /**
   * GET /api/banner-sections
   * Public list of active banner sections
   */
  async getPublicBannerSections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = req.query.page || req.query.limit ? validatePagination(req.query) : undefined;
      const result = await bannerSectionService.getPublicBannerSections(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/banner-sections/:id
   * Public get banner section by ID
   */
  async getPublicBannerSectionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const banner = await bannerSectionService.getPublicBannerSectionById(validId);
      res.status(200).json(sendSuccess(banner));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/banner-sections
   * Admin list of all banner sections (including inactive)
   */
  async getAdminBannerSections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = req.query.page || req.query.limit ? validatePagination(req.query) : undefined;
      const result = await bannerSectionService.getAdminBannerSections(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/banner-sections/:id
   * Admin get banner section details by ID
   */
  async getBannerSectionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const banner = await bannerSectionService.getBannerSectionById(validId);
      res.status(200).json(sendSuccess(banner));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/banner-sections
   * Admin create banner section
   */
  async createBannerSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateBannerSection(req.body);
      const banner = await bannerSectionService.createBannerSection(input);
      res.status(201).json(sendSuccess(banner));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/banner-sections/:id
   * Admin update banner section
   */
  async updateBannerSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const input = validateUpdateBannerSection(req.body);
      const banner = await bannerSectionService.updateBannerSection(validId, input);
      res.status(200).json(sendSuccess(banner));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/banner-sections/:id
   * Admin soft delete banner section
   */
  async softDeleteBannerSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      await bannerSectionService.softDeleteBannerSection(validId);
      res.status(200).json(sendSuccess({ message: "Banner section deleted successfully" }));
    } catch (error) {
      next(error);
    }
  }
}

export const bannerSectionController = new BannerSectionController();
