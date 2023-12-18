//Routers for Flights
const express = require("express");
const { body } = require("express-validator");
const flightsController = require("../controllers/flights");

const router = express.Router();

router.get("/getFlights", flightsController.getFlightsForBooking);

module.exports = router;
