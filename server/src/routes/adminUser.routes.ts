import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

// Admin routes for users (only GET and DELETE per specifications)
router.get("/", (req, res, next) => userController.getAdminUsers(req, res, next));
router.get("/:id", (req, res, next) => userController.getUserById(req, res, next));
router.delete("/:id", (req, res, next) => userController.deleteUser(req, res, next));

export default router;
