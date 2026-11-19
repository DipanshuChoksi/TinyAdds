import type { Request, Response, NextFunction } from "express";
import { tagService } from "../services/tag.service.js";
import {
  validateCreateTag,
  validateUpdateTag,
  validateObjectId,
} from "../validators/tag.validator.js";
import { sendSuccess } from "../utils/response.js";

export class TagController {
  /**
   * GET /api/tags
   * Public list of active tags (unpaginated)
   */
  async getPublicTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await tagService.getPublicTags();
      res.status(200).json(sendSuccess(items));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tags/:id
   * Public get tag by ID
   */
  async getPublicTagById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const tag = await tagService.getPublicTagById(validId);
      res.status(200).json(sendSuccess(tag));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/tags
   * Admin list of all tags (unpaginated)
   */
  async getAdminTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await tagService.getAdminTags();
      res.status(200).json(sendSuccess(items));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/tags/:id
   * Admin get tag details by ID
   */
  async getTagById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const tag = await tagService.getTagById(validId);
      res.status(200).json(sendSuccess(tag));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/tags
   * Admin create tag
   */
  async createTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateTag(req.body);
      const tag = await tagService.createTag(input);
      res.status(201).json(sendSuccess(tag));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/tags/:id
   * Admin update tag
   */
  async updateTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const input = validateUpdateTag(req.body);
      const tag = await tagService.updateTag(validId, input);
      res.status(200).json(sendSuccess(tag));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/tags/:id
   * Admin soft delete tag
   */
  async softDeleteTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      await tagService.softDeleteTag(validId);
      res.status(200).json(sendSuccess({ message: "Tag deleted successfully" }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/tags/:id/restore
   * Admin restore soft-deleted tag
   */
  async restoreTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const tag = await tagService.restoreTag(validId);
      res.status(200).json(sendSuccess(tag));
    } catch (error) {
      next(error);
    }
  }
}

export const tagController = new TagController();
