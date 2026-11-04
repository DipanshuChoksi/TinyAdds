import type { Request, Response, NextFunction } from "express";
import { cmsService } from "../services/cms.service.js";
import {
  validateCreateCms,
  validateUpdateCms,
  validateObjectId,
  validatePagination,
} from "../validators/cms.validator.js";
import { sendSuccess } from "../utils/response.js";

export class CmsController {
  /**
   * GET /api/cms
   * Public list of active CMS pages
   */
  async getPublicCms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const result = await cmsService.getPublicCms(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/cms/:slug
   * Public get CMS page by slug
   */
  async getPublicCmsBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = (req.params.slug as string).trim().toLowerCase();
      const cms = await cmsService.getPublicCmsBySlug(slug);
      res.status(200).json(sendSuccess(cms));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/cms
   * Admin list of all CMS pages (including inactive)
   */
  async getAdminCms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const result = await cmsService.getAdminCms(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/cms/:id
   * Admin get CMS page by ID
   */
  async getCmsById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const cms = await cmsService.getCmsById(validId);
      res.status(200).json(sendSuccess(cms));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/cms
   * Admin create a new CMS page
   */
  async createCms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateCms(req.body);
      const cms = await cmsService.createCms(input);
      res.status(201).json(sendSuccess(cms));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/cms/:id
   * Admin update a CMS page
   */
  async updateCms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const input = validateUpdateCms(req.body);
      const cms = await cmsService.updateCms(validId, input);
      res.status(200).json(sendSuccess(cms));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/cms/:id
   * Admin soft delete a CMS page
   */
  async softDeleteCms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      await cmsService.softDeleteCms(validId);
      res.status(200).json(sendSuccess({ message: `CMS page with id '${validId}' soft-deleted successfully` }));
    } catch (error) {
      next(error);
    }
  }
}

export const cmsController = new CmsController();
