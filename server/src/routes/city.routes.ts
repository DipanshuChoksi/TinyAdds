import { Router } from "express";
import { cityController } from "../controllers/city.controller.js";

const router = Router();

router.get("/", (req, res, next) => cityController.getPublicCities(req, res, next));
router.get("/:id", (req, res, next) => cityController.getPublicCityById(req, res, next));

export default router;
