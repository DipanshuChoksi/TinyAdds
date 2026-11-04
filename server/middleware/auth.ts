import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";

export const SESSION_COOKIE = "tinyadds_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function sign(value: string): string {
  return createHmac("sha256", config.sessionSecret).update(value).digest("base64url");
}

function getCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.cookie?.split(";") ?? [];
  const item = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return item?.trim().slice(name.length + 1);
}

export function createSession(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function setSessionCookie(response: Response, userId: string): void {
  response.cookie(SESSION_COOKIE, createSession(userId), {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
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

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
