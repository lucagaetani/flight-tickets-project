const express = require('express');

const router = express.Router();

//Routers for Flights
const flightsController = require('../controllers/flights');
router.get('/flights', flightsController.getFlights);

//Routers for Airports
const airportsController = require('../controllers/airports');
router.get('/airports', airportsController.getFlights);

//Routers for Reservations
const reservationsController = require('../reservations', reservationsController.getReservations);

module.exports = flightsController;
