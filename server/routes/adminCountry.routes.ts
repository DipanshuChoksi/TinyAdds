import { Router } from "express";
import { countryController } from "../controllers/country.controller.js";

const router = Router();

router.get("/", (req, res, next) => countryController.getAdminCountries(req, res, next));
router.get("/:id", (req, res, next) => countryController.getCountryById(req, res, next));
router.post("/", (req, res, next) => countryController.createCountry(req, res, next));
router.put("/:id", (req, res, next) => countryController.updateCountry(req, res, next));
router.delete("/:id", (req, res, next) => countryController.deleteCountry(req, res, next));

export default router;
