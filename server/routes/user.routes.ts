import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/register", (req, res, next) => userController.register(req, res, next));
router.post("/login", (req, res, next) => userController.login(req, res, next));
router.post("/logout", (req, res) => userController.logout(req, res));
router.post("/forgot-password", (req, res, next) => userController.requestPasswordReset(req, res, next));
router.post("/verify-otp", (req, res, next) => userController.verifyPasswordResetOtp(req, res, next));
router.post("/reset-password", (req, res, next) => userController.resetPassword(req, res, next));
router.get("/me", requireAuth, (req, res, next) => userController.getMe(req, res, next));
router.patch("/profile", requireAuth, (req, res, next) => userController.updateProfile(req, res, next));

export default router;
