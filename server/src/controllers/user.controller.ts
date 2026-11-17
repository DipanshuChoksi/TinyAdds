import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";
import { clearSessionCookie, setSessionCookie } from "../middleware/auth.js";
import { sendSuccess } from "../utils/response.js";
import {
  validateEmail,
  validateLogin,
  validateObjectId,
  validateOtp,
  validatePagination,
  validatePasswordReset,
  validateProfileUpdate,
  validateRegistration,
} from "../validators/user.validator.js";

export class UserController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateRegistration(req.body);
      const user = await userService.register(input);
      res.status(201).json(sendSuccess(user));
    } catch (error) { next(error); }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateLogin(req.body);
      const user = await userService.login(input.email, input.password);
      setSessionCookie(res, user.id);
      res.status(200).json(sendSuccess(user));
    } catch (error) { next(error); }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    clearSessionCookie(res);
    res.status(200).json(sendSuccess({ message: "Logged out" }));
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(200).json(sendSuccess(await userService.getProfile(req.userId))); }
    catch (error) { next(error); }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateProfileUpdate(req.body);
      res.status(200).json(sendSuccess(await userService.updateProfile(req.userId, input)));
    } catch (error) { next(error); }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.requestPasswordReset(validateEmail(req.body));
      res.status(200).json(sendSuccess({ message: "If the account exists, a verification code has been sent" }));
    } catch (error) { next(error); }
  }

  async verifyPasswordResetOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validateOtp(req.body);
      await userService.verifyPasswordResetOtp(input.email, input.otp);
      res.status(200).json(sendSuccess({ message: "Verification code accepted" }));
    } catch (error) { next(error); }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validatePasswordReset(req.body);
      await userService.resetPassword(input.email, input.password);
      res.status(200).json(sendSuccess({ message: "Password updated successfully" }));
    } catch (error) { next(error); }
  }

  /**
   * Admin: List users
   * GET /api/admin/users
   */
  async getAdminUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = validatePagination(req.query);
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const result = await userService.getAdminUsers(pagination, search);
      res.status(200).json(sendSuccess(result.items, result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Get user by ID
   * GET /api/admin/users/:id
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateObjectId(req.params.id as string, "id");
      const user = await userService.getUserById(id);
      res.status(200).json(sendSuccess(user));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Soft delete user
   * DELETE /api/admin/users/:id
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = validateObjectId(req.params.id as string, "id");
      await userService.softDeleteUser(id);
      res.status(200).json(sendSuccess({ message: "User deleted successfully" }));
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
