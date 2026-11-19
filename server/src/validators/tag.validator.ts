import { Types } from "mongoose";
import { BadRequestError } from "../utils/errors.js";

export function validateObjectId(id: string, paramName = "id"): string {
  if (!id || typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Invalid ${paramName}: must be a valid 24-character hexadecimal ObjectId`);
  }
  return id;
}

export interface CreateTagInput {
  name: string;
  isActive?: boolean;
}

export interface UpdateTagInput {
  name?: string;
  isActive?: boolean;
}

export function validateCreateTag(body: unknown): CreateTagInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, isActive } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("Tag 'name' is required and must be a non-empty string");
  }

  const result: CreateTagInput = {
    name: name.trim(),
  };

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  return result;
}

export function validateUpdateTag(body: unknown): UpdateTagInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, isActive } = body as Record<string, unknown>;
  const result: UpdateTagInput = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new BadRequestError("'name' must be a non-empty string");
    }
    result.name = name.trim();
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  if (Object.keys(result).length === 0) {
    throw new BadRequestError("At least one field must be provided to update");
  }

  return result;
}
