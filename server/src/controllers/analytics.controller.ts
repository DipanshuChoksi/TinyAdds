import type { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service.js";
import { sendSuccess } from "../utils/response.js";

export class AnalyticsController {
  async getAdminAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await analyticsService.getAdminAnalytics();
      res.status(200).json(sendSuccess(analytics));
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
