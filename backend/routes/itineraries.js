//Routers for Airports
const express = require("express");
const { body } = require("express-validator");
const itinerariesController = require("../controllers/itineraries");

const router = express.Router();

router.get("/getItinerariesForBooking", itinerariesController.getItinerariesForBooking);

module.exports = router;
