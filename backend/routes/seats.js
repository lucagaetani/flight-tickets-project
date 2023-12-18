const express = require("express");
const { validationResult } = require("express-validator");
const seatsController = require("../controllers/seats");

const router = express.Router();

const validateSeats = [
  //TODO: booking
  /*
  body("IATA_code").trim().notEmpty().isLength({ max: 3 }),
  body("name").trim().notEmpty(),
  body("country").trim().notEmpty(),
  */
];

router.get("/getSeats", seatsController.getSeatsForFlight);

//router.post("/book", validateSeats, seatsController.bookSeats);

module.exports = router;
