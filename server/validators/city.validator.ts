import { BadRequestError } from "../utils/errors.js";
import { validateNumericId, validatePagination } from "./country.validator.js";

export { validateNumericId, validatePagination };

export interface CreateCityInput {
  name: string;
  countryId: number;
  stateId: number;
  isActive?: boolean;
}

export interface UpdateCityInput {
  name?: string;
  countryId?: number;
  stateId?: number;
  isActive?: boolean;
}

export function validateCreateCity(body: unknown): CreateCityInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, countryId, stateId, isActive } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("City 'name' is required and must be a non-empty string");
  }

  if (countryId === undefined || countryId === null) {
    throw new BadRequestError("City 'countryId' is required");
  }

  if (stateId === undefined || stateId === null) {
    throw new BadRequestError("City 'stateId' is required");
  }

  const parsedCountryId = validateNumericId(countryId, "countryId");
  const parsedStateId = validateNumericId(stateId, "stateId");

  const result: CreateCityInput = {
    name: name.trim(),
    countryId: parsedCountryId,
    stateId: parsedStateId,
  };

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  return result;
}

export function validateUpdateCity(body: unknown): UpdateCityInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, countryId, stateId, isActive } = body as Record<string, unknown>;
  const result: UpdateCityInput = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new BadRequestError("City 'name' cannot be empty");
    }
    result.name = name.trim();
  }

  if (countryId !== undefined) {
    result.countryId = validateNumericId(countryId, "countryId");
  }

  if (stateId !== undefined) {
    result.stateId = validateNumericId(stateId, "stateId");
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      throw new BadRequestError("'isActive' must be a boolean");
    }
    result.isActive = isActive;
  }

  if (Object.keys(result).length === 0) {
    throw new BadRequestError("At least one field ('name', 'countryId', 'stateId', or 'isActive') must be provided to update");
  }

  return result;
}
