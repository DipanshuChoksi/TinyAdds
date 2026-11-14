import type { Request, Response, NextFunction } from "express";
import { clientPostService } from "../services/clientPost.service.js";
import { sendSuccess } from "../utils/response.js";
import { validatePost } from "../validators/post.validator.js";
import { validatePostListQuery } from "../validators/postQuery.validator.js";

function postId(req: Request): string {
  const value = req.params.id;
  return typeof value === "string" ? value : "";
}

export class ClientPostController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await clientPostService.list(req.userId, validatePostListQuery(req.query));
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

  async publicList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banner = typeof req.query.banner === "string" ? req.query.banner : undefined;
      const searchGroup = typeof req.query.searchGroup === "string" ? req.query.searchGroup : undefined;
      const searchCategory = typeof req.query.searchCategory === "string" ? req.query.searchCategory : undefined;
      const emotion = typeof req.query.emotion === "string" ? req.query.emotion : undefined;
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const fromDate = typeof req.query.fromDate === "string" ? req.query.fromDate : undefined;
      const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : undefined;
      const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : undefined;

      const result = await clientPostService.getPublicPosts({
        banner,
        searchGroup,
        searchCategory,
        emotion,
        search,
        fromDate,
        page,
        limit,
      });
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) { next(error); }
  }

  async publicGet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(sendSuccess(await clientPostService.getPublicPostById(postId(req))));
    } catch (error) { next(error); }
  }
}

export const clientPostController = new ClientPostController();
