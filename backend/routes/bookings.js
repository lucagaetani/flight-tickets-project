//Routers for Airports
const express = require("express");
const { body } = require("express-validator");
const bookingsController = require("../controllers/bookings");

const router = express.Router();

const validateBooking = [
  //TODO: booking
  /*
  body("IATA_code").trim().notEmpty().isLength({ max: 3 }),
  body("name").trim().notEmpty(),
  body("country").trim().notEmpty(),
  */
];

router.get("/getBookingsForUser", bookingsController.getBookingsForUser);

router.get("/getBooking", bookingsController.getBooking);

router.post("/insertBookings", validateBooking, bookingsController.insertBookings);

module.exports = router;