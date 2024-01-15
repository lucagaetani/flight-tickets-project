//Routers for Airports
const express = require("express");
const { body } = require("express-validator");
const airportsController = require("../controllers/airports");

const router = express.Router();

//Validate the inputs
const validateAirport = [
  body("IATA_code").trim().notEmpty().isLength({ max: 3 }),
  body("name").trim().notEmpty(),
  body("country").trim().notEmpty(),
];

router.get("/getAirports", airportsController.getAirports);

module.exports = router;
