const express = require("express");
const seatsController = require("../controllers/seats");

const router = express.Router();

router.get("/getSeats", seatsController.getSeatsForFlight);

module.exports = router;
