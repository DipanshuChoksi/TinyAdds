import type { Request, Response, NextFunction } from "express";
import { groupService } from "../services/group.service.js";
import {
  validateCreateGroup,
  validateUpdateGroup,
  validateObjectId,
  validatePagination,
} from "../validators/group.validator.js";
import { sendSuccess } from "../utils/response.js";

export class GroupController {
  /**
   * GET /api/groups
   * Public list of active groups
   */
  async getPublicGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = req.query.page || req.query.limit ? validatePagination(req.query) : undefined;
      const result = await groupService.getPublicGroups(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/groups/:idOrSlug
   * Public get group by ID or slug
   */
  async getPublicGroupById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const param = (req.params.id as string).trim();
      const isHexId = /^[0-9a-fA-F]{24}$/.test(param);
      const group = isHexId
        ? await groupService.getPublicGroupById(param)
        : await groupService.getPublicGroupBySlug(param);
      res.status(200).json(sendSuccess(group));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/groups/slug/:slug
   * Explicit public get group by slug
   */
  async getPublicGroupBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = (req.params.slug as string).trim();
      const group = await groupService.getPublicGroupBySlug(slug);
      res.status(200).json(sendSuccess(group));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/groups
   * Admin list of all groups (including inactive)
   */
  async getAdminGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = req.query.page || req.query.limit ? validatePagination(req.query) : undefined;
      const result = await groupService.getAdminGroups(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/groups/:idOrSlug
   * Admin get group details by ID or slug
   */
  async getGroupById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const param = (req.params.id as string).trim();
      const isHexId = /^[0-9a-fA-F]{24}$/.test(param);
      const group = isHexId
        ? await groupService.getGroupById(param)
        : await groupService.getGroupBySlug(param);
      res.status(200).json(sendSuccess(group));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/groups/slug/:slug
   * Explicit admin get group by slug
   */
  async getGroupBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = (req.params.slug as string).trim();
      const group = await groupService.getGroupBySlug(slug);
      res.status(200).json(sendSuccess(group));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/groups
   * Admin create group
   */
  async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateCreateGroup(req.body);
      const group = await groupService.createGroup(input);
      res.status(201).json(sendSuccess(group));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/groups/:id
   * Admin update group
   */
  async updateGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const input = validateUpdateGroup(req.body);
      const group = await groupService.updateGroup(validId, input);
      res.status(200).json(sendSuccess(group));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/groups/:id
   * Admin soft delete group
   */
  async softDeleteGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      await groupService.softDeleteGroup(validId);
      res.status(200).json(sendSuccess({ message: "Group deleted successfully" }));
    } catch (error) {
      next(error);
    }
  }
}

export const groupController = new GroupController();
