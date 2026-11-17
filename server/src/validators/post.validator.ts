import { BadRequestError } from "../utils/errors.js";

export interface ClientPostInput {
  contactPerson: string;
  contactNo: string;
  email: string;
  address: string;
  cityId?: number | null;
  cityName?: string;
  banner: string;
  emotion: string;
  searchGroup: string;
  searchCategory: string;
  fromDate: string;
  title: string;
  image: string;
  tag: string;
  description: string;
}

export function validatePost(body: unknown): ClientPostInput {
  if (typeof body !== "object" || body === null || Array.isArray(body)) throw new BadRequestError("Request body must be an object");
  const input = body as Record<string, unknown>;
  const get = (key: keyof ClientPostInput, max: number, required = false): string => {
    const value = input[key] ?? "";
    if (typeof value !== "string") throw new BadRequestError(`${key} must be a string`);
    const clean = value.trim();
    if (required && !clean) throw new BadRequestError(`${key} is required`);
    if (clean.length > max) throw new BadRequestError(`${key} is too long`);
    return clean;
  };
  const email = get("email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestError("Enter a valid email address");

  let parsedCityId: number | null = null;
  if (input.cityId !== undefined && input.cityId !== null && input.cityId !== "") {
    const num = Number(input.cityId);
    if (!Number.isInteger(num) || num < 1) throw new BadRequestError("cityId must be a positive integer");
    parsedCityId = num;
  }

  return {
    contactPerson: get("contactPerson", 160, true),
    contactNo: get("contactNo", 20, true),
    email,
    address: get("address", 500),
    cityId: parsedCityId,
    cityName: typeof input.cityName === "string" ? input.cityName.trim().slice(0, 100) : "",
    banner: get("banner", 100),
    emotion: get("emotion", 100),
    searchGroup: get("searchGroup", 100),
    searchCategory: get("searchCategory", 100),
    fromDate: get("fromDate", 10, true),
    title: get("title", 200, true),
    image: get("image", 8_000_000),
    tag: get("tag", 300),
    description: get("description", 100_000),
  };
}
