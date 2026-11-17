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
   * GET /api/emotions/:id
   * Public get emotion by ID
   */
  async getPublicEmotionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const emotion = await emotionService.getPublicEmotionById(validId);
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
   * GET /api/admin/emotions/:id
   * Admin get emotion details by ID
   */
  async getEmotionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const emotion = await emotionService.getEmotionById(validId);
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
