import { Router } from "express";
import { contactController } from "../controllers/contact.controller.js";

const router = Router();

// Public route to submit contact inquiries
router.post("/", (req, res, next) => contactController.submitContact(req, res, next));

export default router;
