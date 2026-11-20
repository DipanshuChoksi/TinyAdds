import { BadRequestError } from "../utils/errors.js";
import { validateNumericId, validatePagination } from "./country.validator.js";

export { validateNumericId, validatePagination };

export interface CreateStateInput {
  name: string;
  countryId: number;
  isActive?: boolean;
}

export interface UpdateStateInput {
  name?: string;
  countryId?: number;
  isActive?: boolean;
}

export interface StateListQuery {
  page: number;
  limit: number;
  skip: number;
  countryId?: number;
  search?: string;
}

const MAX_SEARCH_LENGTH = 100;

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function validateStateListQuery(query: unknown): StateListQuery {
  const q = (query ?? {}) as Record<string, unknown>;
  const { page, limit, skip } = validatePagination(q);

  let countryId: number | undefined;
  if (q.countryId !== undefined && q.countryId !== "" && q.countryId !== "all") {
    countryId = validateNumericId(q.countryId, "countryId");
  }

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

  const result: StateListQuery = { page, limit, skip };
  if (countryId !== undefined) {
    result.countryId = countryId;
  }
  if (search !== undefined) {
    result.search = search;
  }
  return result;
}

export function validateCreateState(body: unknown): CreateStateInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, countryId, isActive } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("State 'name' is required and must be a non-empty string");
  }

  if (countryId === undefined || countryId === null) {
    throw new BadRequestError("State 'countryId' is required");
  }

  const parsedCountryId = validateNumericId(countryId, "countryId");

  const result: CreateStateInput = {
    name: name.trim(),
    countryId: parsedCountryId,
  };

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  return result;
}

export function validateUpdateState(body: unknown): UpdateStateInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, countryId, isActive } = body as Record<string, unknown>;
  const result: UpdateStateInput = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new BadRequestError("State 'name' cannot be empty");
    }
    result.name = name.trim();
  }

  if (countryId !== undefined) {
    result.countryId = validateNumericId(countryId, "countryId");
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  if (Object.keys(result).length === 0) {
    throw new BadRequestError("At least one field ('name', 'countryId', or 'isActive') must be provided to update");
  }

  return result;
}
