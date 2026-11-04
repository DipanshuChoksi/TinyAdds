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

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateContactInput {
  status?: "pending" | "in_progress" | "resolved";
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  isActive?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCreateContact(body: unknown): CreateContactInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { name, email, phone, subject, message } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("Contact 'name' is required and must be a non-empty string");
  }
  if (name.trim().length > 100) {
    throw new BadRequestError("Contact 'name' cannot exceed 100 characters");
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    throw new BadRequestError("A valid 'email' address is required");
  }
  if (email.trim().length > 150) {
    throw new BadRequestError("Email cannot exceed 150 characters");
  }

  let formattedPhone = "";
  if (phone !== undefined && phone !== null && phone !== "") {
    if (typeof phone !== "string") {
      throw new BadRequestError("'phone' must be a string");
    }
    formattedPhone = phone.trim();
    if (formattedPhone.length > 10) {
      throw new BadRequestError("'phone' cannot exceed 10 characters");
    }
  }

  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    throw new BadRequestError("Contact 'subject' is required and must be a non-empty string");
  }
  if (subject.trim().length > 200) {
    throw new BadRequestError("Contact 'subject' cannot exceed 200 characters");
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw new BadRequestError("Contact 'message' is required and must be a non-empty string");
  }
  if (message.trim().length > 5000) {
    throw new BadRequestError("Message cannot exceed 5000 characters");
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: formattedPhone,
    subject: subject.trim(),
    message: message.trim(),
  };
}

export function validateUpdateContact(body: unknown): UpdateContactInput {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object");
  }

  const { status, name, email, phone, subject, message, isActive } = body as Record<string, unknown>;
  const result: UpdateContactInput = {};

  if (status !== undefined) {
    if (typeof status !== "string" || !["pending", "in_progress", "resolved"].includes(status)) {
      throw new BadRequestError("Invalid 'status'. Allowed values: 'pending', 'in_progress', 'resolved'");
    }
    result.status = status as "pending" | "in_progress" | "resolved";
  }

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new BadRequestError("'name' must be a non-empty string");
    }
    if (name.trim().length > 100) {
      throw new BadRequestError("'name' cannot exceed 100 characters");
    }
    result.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      throw new BadRequestError("A valid 'email' address is required");
    }
    if (email.trim().length > 150) {
      throw new BadRequestError("Email cannot exceed 150 characters");
    }
    result.email = email.trim().toLowerCase();
  }

  if (phone !== undefined) {
    if (typeof phone !== "string") {
      throw new BadRequestError("'phone' must be a string");
    }
    if (phone.trim().length > 10) {
      throw new BadRequestError("'phone' cannot exceed 10 characters");
    }
    result.phone = phone.trim();
  }

  if (subject !== undefined) {
    if (typeof subject !== "string" || subject.trim().length === 0) {
      throw new BadRequestError("'subject' must be a non-empty string");
    }
    if (subject.trim().length > 200) {
      throw new BadRequestError("'subject' cannot exceed 200 characters");
    }
    result.subject = subject.trim();
  }

  if (message !== undefined) {
    if (typeof message !== "string" || message.trim().length === 0) {
      throw new BadRequestError("'message' must be a non-empty string");
    }
    if (message.trim().length > 5000) {
      throw new BadRequestError("Message cannot exceed 5000 characters");
    }
    result.message = message.trim();
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
