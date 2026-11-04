import { Router } from "express";
import { stateController } from "../controllers/state.controller.js";

const router = Router();

router.get("/", (req, res, next) => stateController.getAdminStates(req, res, next));
router.get("/:id", (req, res, next) => stateController.getStateById(req, res, next));
router.post("/", (req, res, next) => stateController.createState(req, res, next));
router.put("/:id", (req, res, next) => stateController.updateState(req, res, next));
router.delete("/:id", (req, res, next) => stateController.deleteState(req, res, next));

export default router;
