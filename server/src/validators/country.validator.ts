import { BadRequestError } from "../utils/errors.js";

export interface CountryListQuery {
  page: number;
  limit: number;
  skip: number;
  search?: string;
}

const MAX_SEARCH_LENGTH = 100;

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function validateCountryListQuery(query: unknown): CountryListQuery {
  const q = (query ?? {}) as Record<string, unknown>;
  const { page, limit, skip } = validatePagination(q);

  let search: string | undefined;
  if (typeof q.search === "string") {
    const trimmed = q.search.trim();
    if (trimmed.length > MAX_SEARCH_LENGTH) {
      throw new BadRequestError(`search must be at most ${MAX_SEARCH_LENGTH} characters`);
    }
    if (trimmed.length > 0) {
      search = escapeRegex(trimmed);
    }
  }

  const result: CountryListQuery = { page, limit, skip };
  if (search !== undefined) {
    result.search = search;
  }
  return result;
}

export function validateNumericId(id: unknown, paramName = "id"): number {
  const parsed = parseInt(String(id), 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new BadRequestError(`Invalid ${paramName}: must be a positive integer`);
  }
  return parsed;
}

export function validatePagination(query: { page?: unknown; limit?: unknown }): { page: number; limit: number; skip: number } {
  let page = 1;
  let limit = Number.MAX_SAFE_INTEGER;

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
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = parsedLimit;
    } else {
      throw new BadRequestError("Query parameter 'limit' must be a positive integer");
    }
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export interface CreateCountryInput {
  name: string;
  isActive?: boolean;
}

export interface UpdateCountryInput {
  name?: string;
  isActive?: boolean;
}

export function validateCreateCountry(body: unknown): CreateCountryInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, isActive } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("Country 'name' is required and must be a non-empty string");
  }

  const result: CreateCountryInput = {
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

export function validateUpdateCountry(body: unknown): UpdateCountryInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, isActive } = body as Record<string, unknown>;
  const result: UpdateCountryInput = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new BadRequestError("Country 'name' cannot be empty");
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
    throw new BadRequestError("At least one field ('name' or 'isActive') must be provided to update");
  }

  return result;
}
