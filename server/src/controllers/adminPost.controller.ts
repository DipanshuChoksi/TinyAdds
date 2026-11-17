import type { Request, Response, NextFunction } from "express";
import { clientPostService } from "../services/clientPost.service.js";
import { sendSuccess } from "../utils/response.js";
import { BadRequestError } from "../utils/errors.js";
import { validatePost } from "../validators/post.validator.js";
import { validatePostListQuery } from "../validators/postQuery.validator.js";

const POST_STATUSES = ["pending", "approved", "rejected"] as const;
type PostStatus = (typeof POST_STATUSES)[number];

function postId(req: Request): string {
  const value = req.params.id;
  return typeof value === "string" ? value : "";
}

function validateModeration(body: unknown): { status: PostStatus; rejectionComment: string } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) throw new BadRequestError("Request body must be an object");
  const input = body as Record<string, unknown>;
  if (typeof input.status !== "string" || !POST_STATUSES.includes(input.status as PostStatus)) {
    throw new BadRequestError("A valid post status is required");
  }
  if (input.rejectionComment !== undefined && typeof input.rejectionComment !== "string") {
    throw new BadRequestError("Rejection comment must be a string");
  }
  const rejectionComment = typeof input.rejectionComment === "string" ? input.rejectionComment.trim() : "";
  if (rejectionComment.length > 2000) throw new BadRequestError("Rejection comment cannot exceed 2000 characters");
  return { status: input.status as PostStatus, rejectionComment };
}

export class AdminPostController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await clientPostService.listForAdmin(validatePostListQuery(req.query));
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) { next(error); }
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(200).json(sendSuccess(await clientPostService.getForAdmin(postId(req)))); }
    catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validatePost(req.body);
      const post = req.isLocalAdmin
        ? await clientPostService.createForAdmin(input)
        : await clientPostService.create(req.userId, input);
      res.status(201).json(sendSuccess(post));
    }
    catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(200).json(sendSuccess(await clientPostService.updateForAdmin(postId(req), validatePost(req.body)))); }
    catch (error) { next(error); }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateModeration(req.body);
      const localAdmin = req.isLocalAdmin === true;
      const post = await clientPostService.updateStatus(
        postId(req),
        localAdmin ? null : req.userId,
        input.status,
        input.rejectionComment,
        localAdmin ? "Local Admin" : undefined
      );
      res.status(200).json(sendSuccess(post));
    } catch (error) { next(error); }
  }
}

export const adminPostController = new AdminPostController();
