import type { Request, Response, NextFunction } from "express";
import { stateService } from "../services/state.service.js";
import {
  validateCreateState,
  validateUpdateState,
  validateNumericId,
  validatePagination,
} from "../validators/state.validator.js";
import { sendSuccess } from "../utils/response.js";

export class StateController {
  /**
   * GET /api/states
   * Public list of active states (optional ?countryId=)
   */
  async getPublicStates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const countryId = req.query.countryId ? validateNumericId(req.query.countryId, "countryId") : undefined;
      const result = await stateService.getPublicStates(pagination, countryId);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/states/:id
   * Public get state by numeric ID
   */
  async getPublicStateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const state = await stateService.getPublicStateById(id);
      res.status(200).json(sendSuccess(state));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/states
   * Admin list of states (active and inactive, optional ?countryId=)
   */
  async getAdminStates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const countryId = req.query.countryId ? validateNumericId(req.query.countryId, "countryId") : undefined;
      const result = await stateService.getAdminStates(pagination, countryId);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/states/:id
   * Admin get state by ID
   */
  async getStateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const state = await stateService.getStateById(id);
      res.status(200).json(sendSuccess(state));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/states
   * Admin create state
   */
  async createState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateState(req.body);
      const state = await stateService.createState(input);
      res.status(201).json(sendSuccess(state));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/states/:id
   * Admin update state
   */
  async updateState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const input = validateUpdateState(req.body);
      const state = await stateService.updateState(id, input);
      res.status(200).json(sendSuccess(state));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/states/:id
   * Admin soft delete state
   */
  async deleteState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      await stateService.softDeleteState(id);
      res.status(200).json(sendSuccess({ message: `State with id ${id} deleted successfully` }));
    } catch (error) {
      next(error);
    }
  }
}

export const stateController = new StateController();
