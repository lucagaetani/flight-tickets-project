//Routers for Airports
const express = require('express');

const router = express.Router();

const airportsController = require('../controllers/airports');
router.get('/airports', airportsController.getAirports);

module.exports = router;
