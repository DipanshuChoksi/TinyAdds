import { Router } from "express";
import { countryController } from "../controllers/country.controller.js";

const router = Router();

router.get("/", (req, res, next) => countryController.getPublicCountries(req, res, next));
router.get("/:id", (req, res, next) => countryController.getPublicCountryById(req, res, next));

export default router;
