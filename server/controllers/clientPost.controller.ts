import type { Request, Response, NextFunction } from "express";
import { clientPostService } from "../services/clientPost.service.js";
import { sendSuccess } from "../utils/response.js";
import { BadRequestError } from "../utils/errors.js";
import { validatePost } from "../validators/post.validator.js";

function pagination(value: unknown, fallback: number, max: number): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < 1) throw new BadRequestError("Pagination values must be positive integers");
  return Math.min(parsed, max);
}

function postId(req: Request): string {
  const value = req.params.id;
  return typeof value === "string" ? value : "";
}

export class ClientPostController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = pagination(req.query.page, 1, Number.MAX_SAFE_INTEGER);
      const limit = pagination(req.query.limit, 10, 100);
      const result = await clientPostService.list(req.userId, page, limit);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) { next(error); }
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(200).json(sendSuccess(await clientPostService.get(req.userId, postId(req)))); }
    catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(201).json(sendSuccess(await clientPostService.create(req.userId, validatePost(req.body)))); }
    catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(200).json(sendSuccess(await clientPostService.update(req.userId, postId(req), validatePost(req.body)))); }
    catch (error) { next(error); }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await clientPostService.softDelete(req.userId, postId(req));
      res.status(200).json(sendSuccess({ message: "Post deleted" }));
    } catch (error) { next(error); }
  }
}

export const clientPostController = new ClientPostController();
