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

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CreateCmsInput {
  title: string;
  slug: string;
  content?: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateCmsInput {
  title?: string;
  slug?: string;
  content?: string;
  image?: string;
  isActive?: boolean;
}

export function validateCreateCms(body: unknown): CreateCmsInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { title, slug, content, image, isActive } = body as Record<string, unknown>;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new BadRequestError("CMS 'title' is required and must be a non-empty string");
  }

  const trimmedTitle = title.trim();
  const result: CreateCmsInput = {
    title: trimmedTitle,
    slug: slug && typeof slug === "string" && slug.trim().length > 0 ? generateSlug(slug) : generateSlug(trimmedTitle),
  };

  if (content !== undefined) {
    if (typeof content !== "string") {
      throw new BadRequestError("'content' must be a string");
    }
    result.content = content.trim();
  }

  if (image !== undefined) {
    if (typeof image !== "string") {
      throw new BadRequestError("'image' must be a string");
    }
    result.image = image.trim();
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  return result;
}

export function validateUpdateCms(body: unknown): UpdateCmsInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { title, slug, content, image, isActive } = body as Record<string, unknown>;
  const result: UpdateCmsInput = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new BadRequestError("'title' must be a non-empty string");
    }
    result.title = title.trim();
  }

  if (slug !== undefined) {
    if (typeof slug !== "string" || slug.trim().length === 0) {
      throw new BadRequestError("'slug' must be a non-empty string");
    }
    result.slug = generateSlug(slug);
  }

  if (content !== undefined) {
    if (typeof content !== "string") {
      throw new BadRequestError("'content' must be a string");
    }
    result.content = content.trim();
  }

  if (image !== undefined) {
    if (typeof image !== "string") {
      throw new BadRequestError("'image' must be a string");
    }
    result.image = image.trim();
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  if (Object.keys(result).length === 0) {
    throw new BadRequestError("At least one valid field must be provided to update");
  }

  return result;
}
