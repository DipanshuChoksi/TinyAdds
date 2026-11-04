import type { Request, Response, NextFunction } from "express";
import { cityService } from "../services/city.service.js";
import {
  validateCreateCity,
  validateUpdateCity,
  validateNumericId,
  validatePagination,
} from "../validators/city.validator.js";
import { sendSuccess } from "../utils/response.js";

export class CityController {
  /**
   * GET /api/cities
   * Public list of active cities (optional ?countryId=&stateId=)
   */
  async getPublicCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const countryId = req.query.countryId ? validateNumericId(req.query.countryId, "countryId") : undefined;
      const stateId = req.query.stateId ? validateNumericId(req.query.stateId, "stateId") : undefined;
      const result = await cityService.getPublicCities(pagination, countryId, stateId);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/cities/:id
   * Public get city by numeric ID
   */
  async getPublicCityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const city = await cityService.getPublicCityById(id);
      res.status(200).json(sendSuccess(city));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/cities
   * Admin list of cities (active and inactive, optional filters)
   */
  async getAdminCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const countryId = req.query.countryId ? validateNumericId(req.query.countryId, "countryId") : undefined;
      const stateId = req.query.stateId ? validateNumericId(req.query.stateId, "stateId") : undefined;
      const result = await cityService.getAdminCities(pagination, countryId, stateId);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/cities/:id
   * Admin get city by ID
   */
  async getCityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const city = await cityService.getCityById(id);
      res.status(200).json(sendSuccess(city));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/cities
   * Admin create city
   */
  async createCity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateCity(req.body);
      const city = await cityService.createCity(input);
      res.status(201).json(sendSuccess(city));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/cities/:id
   * Admin update city
   */
  async updateCity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const input = validateUpdateCity(req.body);
      const city = await cityService.updateCity(id, input);
      res.status(200).json(sendSuccess(city));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/cities/:id
   * Admin soft delete city
   */
  async deleteCity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      await cityService.softDeleteCity(id);
      res.status(200).json(sendSuccess({ message: `City with id ${id} deleted successfully` }));
    } catch (error) {
      next(error);
    }
  }
}

export const cityController = new CityController();
