import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";
import { User } from "../models/User.js";

export const SESSION_COOKIE = "tinyadds_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
export const ADMIN_SESSION_MAX_AGE_SECONDS = 3 * 60 * 60;

function sign(value: string): string {
  return createHmac("sha256", config.sessionSecret).update(value).digest("base64url");
}

function getCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.cookie?.split(";") ?? [];
  const item = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return item?.trim().slice(name.length + 1);
}

export function createSession(userId: string, maxAgeSeconds = SESSION_MAX_AGE_SECONDS): string {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Math.floor(Date.now() / 1000) + maxAgeSeconds })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function setSessionCookie(response: Response, userId: string, maxAgeSeconds = SESSION_MAX_AGE_SECONDS): void {
  response.cookie(SESSION_COOKIE, createSession(userId, maxAgeSeconds), {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds * 1000,
  });
}

export function clearSessionCookie(response: Response): void {
  response.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const session = getCookie(request, SESSION_COOKIE);
  const [payload, signature] = session?.split(".") ?? [];
  if (!payload || !signature) {
    response.status(401).json({ success: false, error: { code: "UNAUTHENTICATED", message: "Please log in to continue" } });
    return;
  }

  const expected = sign(payload);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    response.status(401).json({ success: false, error: { code: "UNAUTHENTICATED", message: "Session is invalid" } });
    return;
  }

  try {
    const data: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data !== "object" || data === null || !("userId" in data) || !("exp" in data)) throw new Error("Invalid session");
    const sessionData = data as { userId: unknown; exp: unknown };
    if (typeof sessionData.userId !== "string" || typeof sessionData.exp !== "number" || sessionData.exp <= Date.now() / 1000) throw new Error("Expired session");
    request.userId = sessionData.userId;
    next();
  } catch {
    response.status(401).json({ success: false, error: { code: "UNAUTHENTICATED", message: "Session has expired" } });
  }
}

export async function requireAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(request.userId).select("userType").lean();
    if (!user || user.userType !== "admin") {
      response.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Admin access is required" } });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdminAccess(request: Request, response: Response, next: NextFunction): void {
  requireAuth(request, response, (error?: unknown) => {
    if (error) {
      next(error);
      return;
    }
    void requireAdmin(request, response, next);
  });
}

declare global {
  namespace Express {
    interface Request {
      userId: string;
      isLocalAdmin?: boolean;
    }
  }
}
