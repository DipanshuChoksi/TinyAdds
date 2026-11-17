import { Types } from "mongoose";
import { BadRequestError } from "../utils/errors.js";

export function validateObjectId(id: string, paramName = "id"): string {
  if (!id || typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Invalid ${paramName}: must be a valid 24-character hexadecimal ObjectId`);
  }
  return id;
}

export function validatePagination(query: { page?: unknown; limit?: unknown }): { page: number; limit: number; skip: number } {
  let page = 1;
  let limit = 20;

  if (query.page !== undefined) {
    const parsedPage = parseInt(String(query.page), 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    } else {
      throw new BadRequestError("Query parameter 'page' must be a positive integer");
    }
  }

  if (query.limit !== undefined) {
    const parsedLimit = parseInt(String(query.limit), 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
      limit = parsedLimit;
    } else {
      throw new BadRequestError("Query parameter 'limit' must be between 1 and 100");
    }
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export interface CreateBlogInput {
  title: string;
  content?: string;
  bannerImage?: string;
  isActive?: boolean;
}

export interface UpdateBlogInput {
  title?: string;
  content?: string;
  bannerImage?: string;
  isActive?: boolean;
}

export function validateCreateBlog(body: unknown): CreateBlogInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { title, content, bannerImage, isActive } = body as Record<string, unknown>;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new BadRequestError("Blog 'title' is required and must be a non-empty string");
  }

  if (title.trim().length > 300) {
    throw new BadRequestError("Blog 'title' cannot exceed 300 characters");
  }

  const input: CreateBlogInput = {
    title: title.trim(),
  };

  if (content !== undefined) {
    if (typeof content !== "string") {
      throw new BadRequestError("'content' must be a string");
    }
    input.content = content.trim();
  }

  if (bannerImage !== undefined) {
    if (typeof bannerImage !== "string") {
      throw new BadRequestError("'bannerImage' must be a string URL or path");
    }
    input.bannerImage = bannerImage.trim();
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    input.isActive = isActive;
  }

  return input;
}

export function validateUpdateBlog(body: unknown): UpdateBlogInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { title, content, bannerImage, isActive } = body as Record<string, unknown>;

  const hasAtLeastOneField =
    title !== undefined ||
    content !== undefined ||
    bannerImage !== undefined ||
    isActive !== undefined;

  if (!hasAtLeastOneField) {
    throw new BadRequestError("At least one field must be provided to update");
  }

  const input: UpdateBlogInput = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new BadRequestError("Blog 'title' must be a non-empty string");
    }
    if (title.trim().length > 300) {
      throw new BadRequestError("Blog 'title' cannot exceed 300 characters");
    }
    input.title = title.trim();
  }

  if (content !== undefined) {
    if (typeof content !== "string") {
      throw new BadRequestError("'content' must be a string");
    }
    input.content = content.trim();
  }

  if (bannerImage !== undefined) {
    if (typeof bannerImage !== "string") {
      throw new BadRequestError("'bannerImage' must be a string URL or path");
    }
    input.bannerImage = bannerImage.trim();
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    input.isActive = isActive;
  }

  return input;
}
