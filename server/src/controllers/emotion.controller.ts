import type { Request, Response, NextFunction } from "express";
import { emotionService } from "../services/emotion.service.js";
import {
  validateCreateEmotion,
  validateUpdateEmotion,
  validateObjectId,
  validatePagination,
} from "../validators/emotion.validator.js";
import { sendSuccess } from "../utils/response.js";

export class EmotionController {
  /**
   * GET /api/emotions
   * Public list of active emotions
   */
  async getPublicEmotions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const result = await emotionService.getPublicEmotions(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/emotions/:idOrSlug
   * Public get emotion by ID or slug
   */
  async getPublicEmotionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const param = (req.params.id as string).trim();
      const isHexId = /^[0-9a-fA-F]{24}$/.test(param);
      const emotion = isHexId
        ? await emotionService.getPublicEmotionById(param)
        : await emotionService.getPublicEmotionBySlug(param);
      res.status(200).json(sendSuccess(emotion));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/emotions/slug/:slug
   * Explicit public get emotion by slug
   */
  async getPublicEmotionBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = (req.params.slug as string).trim();
      const emotion = await emotionService.getPublicEmotionBySlug(slug);
      res.status(200).json(sendSuccess(emotion));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/emotions
   * Admin list of all emotions (including inactive)
   */
  async getAdminEmotions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const result = await emotionService.getAdminEmotions(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/emotions/:idOrSlug
   * Admin get emotion details by ID or slug
   */
  async getEmotionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const param = (req.params.id as string).trim();
      const isHexId = /^[0-9a-fA-F]{24}$/.test(param);
      const emotion = isHexId
        ? await emotionService.getEmotionById(param)
        : await emotionService.getEmotionBySlug(param);
      res.status(200).json(sendSuccess(emotion));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/emotions/slug/:slug
   * Explicit admin get emotion by slug
   */
  async getEmotionBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = (req.params.slug as string).trim();
      const emotion = await emotionService.getEmotionBySlug(slug);
      res.status(200).json(sendSuccess(emotion));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/emotions
   * Admin create emotion
   */
  async createEmotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateEmotion(req.body);
      const emotion = await emotionService.createEmotion(input);
      res.status(201).json(sendSuccess(emotion));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/emotions/:id
   * Admin update emotion
   */
  async updateEmotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const input = validateUpdateEmotion(req.body);
      const emotion = await emotionService.updateEmotion(validId, input);
      res.status(200).json(sendSuccess(emotion));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/emotions/:id
   * Admin soft delete emotion
   */
  async softDeleteEmotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      await emotionService.softDeleteEmotion(validId);
      res.status(200).json(sendSuccess({ message: "Emotion successfully deleted" }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/emotions/:id/restore
   * Admin restore soft-deleted emotion
   */
  // async restoreEmotion(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const validId = validateObjectId(req.params.id as string);
  //     const emotion = await emotionService.restoreEmotion(validId);
  //     res.status(200).json(sendSuccess(emotion));
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export const emotionController = new EmotionController();
