import { Types } from "mongoose";
import { BadRequestError } from "../utils/errors.js";

export interface ClientPostInput {
  contactPerson: string;
  contactNo: string;
  email: string;
  address: string;
  cityId?: number | null;
  cityName?: string;
  banner: Types.ObjectId | null;
  emotion: Types.ObjectId | null;
  searchGroup: Types.ObjectId | null;
  searchCategory: Types.ObjectId | null;
  fromDate: string;
  expiresAt?: Date | null;
  title: string;
  image: string;
  tags: Types.ObjectId[];
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

  const parseObjectId = (key: string): Types.ObjectId | null => {
    const value = input[key];
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string" || !Types.ObjectId.isValid(value)) {
      throw new BadRequestError(`${key} must be a valid ObjectId`);
    }
    return new Types.ObjectId(value);
  };

  const parseTags = (): Types.ObjectId[] => {
    const raw = input.tags;
    if (raw === undefined || raw === null) return [];
    if (!Array.isArray(raw)) {
      throw new BadRequestError("tags must be an array of ObjectIds");
    }

    return raw.map((item, idx) => {
      const val = typeof item === "string" ? item.trim() : String(item);
      if (!Types.ObjectId.isValid(val)) {
        throw new BadRequestError(`Invalid ObjectId in tags at index ${idx}`);
      }
      return new Types.ObjectId(val);
    });
  };

  return {
    contactPerson: get("contactPerson", 160, true),
    contactNo: get("contactNo", 20, true),
    email,
    address: get("address", 500),
    cityId: parsedCityId,
    cityName: typeof input.cityName === "string" ? input.cityName.trim().slice(0, 100) : "",
    banner: parseObjectId("banner"),
    emotion: parseObjectId("emotion"),
    searchGroup: parseObjectId("searchGroup"),
    searchCategory: null, // Removed validation for searchCategory as per the recent edits
    fromDate: get("fromDate", 10, true),
    expiresAt: (() => {
      const val = input.expiresAt;
      if (val === undefined || val === null || val === "") return null;
      const d = new Date(val as string | number | Date);
      if (isNaN(d.getTime())) throw new BadRequestError("expiresAt must be a valid date");
      return d;
    })(),
    title: get("title", 200, true),
    image: get("image", 8_000_000),
    tags: parseTags(),
    description: get("description", 100_000),
  };
}
