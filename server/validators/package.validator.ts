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

export interface CreatePackageInput {
  name: string;
  price: number;
  period?: "month" | "year";
  listingLimit: number;
  features?: string[];
  isPopular?: boolean;
  isActive?: boolean;
}

export interface UpdatePackageInput {
  name?: string;
  price?: number;
  period?: "month" | "year";
  listingLimit?: number;
  features?: string[];
  isPopular?: boolean;
  isActive?: boolean;
}

export function validateCreatePackage(body: unknown): CreatePackageInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, price, period, listingLimit, features, isPopular, isActive } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("Package 'name' is required and must be a non-empty string");
  }

  if (price === undefined || typeof price !== "number" || isNaN(price) || price < 0) {
    throw new BadRequestError("Package 'price' is required and must be a non-negative number");
  }

  if (listingLimit === undefined || typeof listingLimit !== "number" || isNaN(listingLimit) || listingLimit < 1) {
    throw new BadRequestError("Package 'listingLimit' is required and must be an integer >= 1");
  }

  const result: CreatePackageInput = {
    name: name.trim(),
    price: Number(price),
    listingLimit: Math.floor(Number(listingLimit)),
  };

  if (period !== undefined) {
    if (period !== "month" && period !== "year") {
      throw new BadRequestError("Package 'period' must be either 'month' or 'year'");
    }
    result.period = period;
  }

  if (features !== undefined) {
    if (!Array.isArray(features) || features.some((f) => typeof f !== "string")) {
      throw new BadRequestError("Package 'features' must be an array of strings");
    }
    result.features = features.map((f: string) => f.trim()).filter(Boolean);
  }

  if (isPopular !== undefined) {
    if (typeof isPopular !== "boolean") {
      throw new BadRequestError("'isPopular' must be a boolean");
    }
    result.isPopular = isPopular;
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  return result;
}

export function validateUpdatePackage(body: unknown): UpdatePackageInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, price, period, listingLimit, features, isPopular, isActive } = body as Record<string, unknown>;

  if (
    name === undefined &&
    price === undefined &&
    period === undefined &&
    listingLimit === undefined &&
    features === undefined &&
    isPopular === undefined &&
    isActive === undefined
  ) {
    throw new BadRequestError("At least one field must be provided to update");
  }

  const result: UpdatePackageInput = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new BadRequestError("Package 'name' must be a non-empty string");
    }
    result.name = name.trim();
  }

  if (price !== undefined) {
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      throw new BadRequestError("Package 'price' must be a non-negative number");
    }
    result.price = Number(price);
  }

  if (listingLimit !== undefined) {
    if (typeof listingLimit !== "number" || isNaN(listingLimit) || listingLimit < 1) {
      throw new BadRequestError("Package 'listingLimit' must be an integer >= 1");
    }
    result.listingLimit = Math.floor(Number(listingLimit));
  }

  if (period !== undefined) {
    if (period !== "month" && period !== "year") {
      throw new BadRequestError("Package 'period' must be either 'month' or 'year'");
    }
    result.period = period;
  }

  if (features !== undefined) {
    if (!Array.isArray(features) || features.some((f) => typeof f !== "string")) {
      throw new BadRequestError("Package 'features' must be an array of strings");
    }
    result.features = features.map((f: string) => f.trim()).filter(Boolean);
  }

  if (isPopular !== undefined) {
    if (typeof isPopular !== "boolean") {
      throw new BadRequestError("'isPopular' must be a boolean");
    }
    result.isPopular = isPopular;
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  return result;
}
