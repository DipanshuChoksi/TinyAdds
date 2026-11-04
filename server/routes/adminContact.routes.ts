import { Router } from "express";
import { contactController } from "../controllers/contact.controller.js";

const router = Router();

// Admin routes for managing customer inquiries
router.get("/", (req, res, next) => contactController.getAdminContacts(req, res, next));
router.get("/:id", (req, res, next) => contactController.getContactById(req, res, next));
router.put("/:id", (req, res, next) => contactController.updateContact(req, res, next));
router.delete("/:id", (req, res, next) => contactController.softDeleteContact(req, res, next));

export default router;
