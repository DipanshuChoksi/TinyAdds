import { Router } from "express";
import { cityController } from "../controllers/city.controller.js";

const router = Router();

router.get("/", (req, res, next) => cityController.getAdminCities(req, res, next));
router.get("/:id", (req, res, next) => cityController.getCityById(req, res, next));
router.post("/", (req, res, next) => cityController.createCity(req, res, next));
router.put("/:id", (req, res, next) => cityController.updateCity(req, res, next));
router.delete("/:id", (req, res, next) => cityController.deleteCity(req, res, next));

export default router;
