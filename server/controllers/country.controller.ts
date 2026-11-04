import type { Request, Response, NextFunction } from "express";
import { countryService } from "../services/country.service.js";
import {
  validateCreateCountry,
  validateUpdateCountry,
  validateNumericId,
  validatePagination,
} from "../validators/country.validator.js";
import { sendSuccess } from "../utils/response.js";

export class CountryController {
  /**
   * GET /api/countries
   * Public list of active countries
   */
  async getPublicCountries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const result = await countryService.getPublicCountries(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/countries/:id
   * Public get country by numeric ID
   */
  async getPublicCountryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const country = await countryService.getPublicCountryById(id);
      res.status(200).json(sendSuccess(country));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/countries
   * Admin list of countries (active and inactive)
   */
  async getAdminCountries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const result = await countryService.getAdminCountries(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/countries/:id
   * Admin get country by ID
   */
  async getCountryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const country = await countryService.getCountryById(id);
      res.status(200).json(sendSuccess(country));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/countries
   * Admin create country
   */
  async createCountry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateCountry(req.body);
      const country = await countryService.createCountry(input);
      res.status(201).json(sendSuccess(country));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/countries/:id
   * Admin update country
   */
  async updateCountry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      const input = validateUpdateCountry(req.body);
      const country = await countryService.updateCountry(id, input);
      res.status(200).json(sendSuccess(country));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/countries/:id
   * Admin soft delete country
   */
  async deleteCountry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateNumericId(req.params.id, "id");
      await countryService.softDeleteCountry(id);
      res.status(200).json(sendSuccess({ message: `Country with id ${id} deleted successfully` }));
    } catch (error) {
      next(error);
    }
  }
}

export const countryController = new CountryController();
