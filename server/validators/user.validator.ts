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

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface ProfileUpdateInput {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  profileImage: string;
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new BadRequestError("Request body must be an object");
  return value as Record<string, unknown>;
}

function text(value: unknown, name: string, maxLength: number, required = false): string {
  if (typeof value !== "string") throw new BadRequestError(`${name} must be a string`);
  const clean = value.trim();
  if (required && !clean) throw new BadRequestError(`${name} is required`);
  if (clean.length > maxLength) throw new BadRequestError(`${name} is too long`);
  return clean;
}

function emailAddress(value: unknown): string {
  const email = text(value, "Email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestError("Enter a valid email address");
  return email;
}

function mobileNumber(value: unknown): string {
  const mobile = text(value, "Mobile", 20, true);
  if (!/^\+?[\d\s()-]{7,20}$/.test(mobile)) throw new BadRequestError("Enter a valid mobile number");
  return mobile;
}

export function validateRegistration(body: unknown): RegisterUserInput {
  const input = record(body);
  const password = text(input.password, "Password", 128, true);
  if (password.length < 8) throw new BadRequestError("Password must be at least 8 characters");
  return {
    firstName: text(input.firstName, "First name", 80, true),
    lastName: text(input.lastName, "Last name", 80, true),
    email: emailAddress(input.email),
    mobile: mobileNumber(input.mobile),
    password,
  };
}

export function validateLogin(body: unknown): { email: string; password: string } {
  const input = record(body);
  return { email: emailAddress(input.email), password: text(input.password, "Password", 128, true) };
}

export function validateProfileUpdate(body: unknown): ProfileUpdateInput {
  const input = record(body);
  return {
    firstName: text(input.firstName, "First name", 80, true),
    lastName: text(input.lastName, "Last name", 80),
    email: emailAddress(input.email),
    mobile: mobileNumber(input.mobile),
    country: text(input.country ?? "", "Country", 80),
    state: text(input.state ?? "", "State", 80),
    city: text(input.city ?? "", "City", 80),
    profileImage: text(input.profileImage ?? "", "Profile image", 8_000_000),
  };
}

export function validateEmail(body: unknown): string {
  return emailAddress(record(body).email);
}

export function validateOtp(body: unknown): { email: string; otp: string } {
  const input = record(body);
  const otp = text(input.otp, "OTP", 6, true);
  if (!/^\d{6}$/.test(otp)) throw new BadRequestError("OTP must contain 6 digits");
  return { email: emailAddress(input.email), otp };
}

export function validatePasswordReset(body: unknown): { email: string; password: string } {
  const input = record(body);
  const password = text(input.password, "Password", 128, true);
  if (password.length < 8) throw new BadRequestError("Password must be at least 8 characters");
  return { email: emailAddress(input.email), password };
}
