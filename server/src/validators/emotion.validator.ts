import { Types } from "mongoose";
import { BadRequestError } from "../utils/errors.js";
import { generateSlug } from "../utils/slug.js";

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

export interface CreateEmotionInput {
  name: string;
  slug: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateEmotionInput {
  name?: string;
  slug?: string;
  image?: string;
  isActive?: boolean;
}

export function validateCreateEmotion(body: unknown): CreateEmotionInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, slug, image, isActive } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("Emotion 'name' is required and must be a non-empty string");
  }

  const trimmedName = name.trim();
  const generatedSlug = slug && typeof slug === "string" && slug.trim().length > 0
    ? generateSlug(slug)
    : generateSlug(trimmedName);

  const result: CreateEmotionInput = {
    name: trimmedName,
    slug: generatedSlug,
  };

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

export function validateUpdateEmotion(body: unknown): UpdateEmotionInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, slug, image, isActive } = body as Record<string, unknown>;

  if (name === undefined && slug === undefined && image === undefined && isActive === undefined) {
    throw new BadRequestError("At least one valid field must be provided to update");
  }

  const result: UpdateEmotionInput = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new BadRequestError("'name' must be a non-empty string");
    }
    result.name = name.trim();
  }

  if (slug !== undefined) {
    if (typeof slug !== "string" || slug.trim().length === 0) {
      throw new BadRequestError("'slug' must be a non-empty string");
    }
    result.slug = generateSlug(slug);
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
