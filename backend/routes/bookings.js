//Routers for Airports
const express = require("express");
const { body } = require("express-validator");
const bookingsController = require("../controllers/bookings");
const auth = require("../middleware/auth.js");

const router = express.Router();

//Validate the inputs
const validateBooking = [
  body("flightState.userEmail").trim().notEmpty(),
  body("flightState.seatsFlightsDeparture").trim().notEmpty(),
  body("flightState.seatsFlightsReturning").if(body("flightState.seatsFlightsReturning").notEmpty()).trim().notEmpty()
];

router.get("/getBookingsForUser", bookingsController.getBookingsForUser);

router.post("/insertBookings", validateBooking, auth.verifyUserToken, bookingsController.insertBookings);

router.get("/getFlightRemainingSeats", bookingsController.getFlightRemainingSeats);

router.post("/setBookingCookie", auth.verifyUserToken, bookingsController.setBookingCookie);

router.get("/getBookingCookie", bookingsController.getBookingCookie);

router.post("/deleteBookingCookie", auth.verifyUserToken, bookingsController.deleteBookingCookie);

module.exports = router;