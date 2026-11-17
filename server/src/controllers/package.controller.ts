import type { Request, Response, NextFunction } from "express";
import { packageService } from "../services/package.service.js";
import {
  validateCreatePackage,
  validateUpdatePackage,
  validateObjectId,
  validatePagination,
} from "../validators/package.validator.js";
import { sendSuccess } from "../utils/response.js";

export class PackageController {
  /**
   * GET /api/packages
   * Public list of active packages
   */
  async getPublicPackages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = req.query.page || req.query.limit ? validatePagination(req.query) : undefined;
      const result = await packageService.getPublicPackages(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/packages/:id
   * Public get package by ID
   */
  async getPublicPackageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const pkg = await packageService.getPublicPackageById(validId);
      res.status(200).json(sendSuccess(pkg));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/packages
   * Admin list of all packages (including inactive)
   */
  async getAdminPackages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = req.query.page || req.query.limit ? validatePagination(req.query) : undefined;
      const result = await packageService.getAdminPackages(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/packages/:id
   * Admin get package details by ID
   */
  async getPackageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const pkg = await packageService.getPackageById(validId);
      res.status(200).json(sendSuccess(pkg));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/packages
   * Admin create package
   */
  async createPackage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreatePackage(req.body);
      const pkg = await packageService.createPackage(input);
      res.status(201).json(sendSuccess(pkg));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/packages/:id
   * Admin update package
   */
  async updatePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const input = validateUpdatePackage(req.body);
      const pkg = await packageService.updatePackage(validId, input);
      res.status(200).json(sendSuccess(pkg));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/packages/:id
   * Admin soft delete package
   */
  async softDeletePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      await packageService.softDeletePackage(validId);
      res.status(200).json(sendSuccess({ message: "Package deleted successfully" }));
    } catch (error) {
      next(error);
    }
  }
}

export const packageController = new PackageController();
