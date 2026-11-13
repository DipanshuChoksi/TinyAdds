import type { Request, Response, NextFunction } from "express";
import { blogService } from "../services/blog.service.js";
import {
  validateCreateBlog,
  validateUpdateBlog,
  validateObjectId,
  validatePagination,
} from "../validators/blog.validator.js";
import { sendSuccess } from "../utils/response.js";

export class BlogController {
  /**
   * GET /api/blogs
   * Public list of active blogs
   */
  async getPublicBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const result = await blogService.getPublicBlogs(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blogs/:id
   * Public get blog by ID
   */
  async getPublicBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const blog = await blogService.getPublicBlogById(validId);
      res.status(200).json(sendSuccess(blog));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/blogs
   * Admin list of all blogs (including inactive)
   */
  async getAdminBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const result = await blogService.getAdminBlogs(pagination);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/blogs/:id
   * Admin get blog details by ID
   */
  async getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const blog = await blogService.getBlogById(validId);
      res.status(200).json(sendSuccess(blog));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/blogs
   * Admin create new blog
   */
  async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateCreateBlog(req.body);
      const blog = await blogService.createBlog(validatedData);
      res.status(201).json(sendSuccess(blog));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/blogs/:id
   * Admin update blog
   */
  async updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      const validatedData = validateUpdateBlog(req.body);
      const blog = await blogService.updateBlog(validId, validatedData);
      res.status(200).json(sendSuccess(blog));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/blogs/:id
   * Admin soft delete blog
   */
  async softDeleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validId = validateObjectId(req.params.id as string);
      await blogService.softDeleteBlog(validId);
      res.status(200).json(sendSuccess({ message: "Blog successfully deleted" }));
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
