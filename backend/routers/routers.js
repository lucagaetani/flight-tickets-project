const express = require('express');

const router = express.Router();

//Routers for Flights
const flightsController = require('../controllers/flights');
router.get('/flights', flightsController.getFlights);

//Routers for Reservations
const reservationsController = require('../reservations', reservationsController.getReservations);