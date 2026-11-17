import { Router } from "express";
import { stateController } from "../controllers/state.controller.js";

const router = Router();

router.get("/", (req, res, next) => stateController.getPublicStates(req, res, next));
router.get("/:id", (req, res, next) => stateController.getPublicStateById(req, res, next));

export default router;
