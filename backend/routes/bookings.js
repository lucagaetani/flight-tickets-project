//Routers for Airports
const express = require("express");
const { body } = require("express-validator");
const bookingsController = require("../controllers/bookings");
const auth = require("../middleware/auth.js");

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

router.post("/insertBookings", validateBooking, auth.verifyUserToken, bookingsController.insertBookings);

router.get("/getFlightRemainingSeats", bookingsController.getFlightRemainingSeats);

router.post("/setBookingCookie", auth.verifyUserToken, bookingsController.setBookingCookie);

router.get("/getBookingCookie", bookingsController.getBookingCookie);

router.post("/deleteBookingCookie", auth.verifyUserToken, bookingsController.deleteBookingCookie);

module.exports = router;