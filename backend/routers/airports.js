//Routers for Airports
const express = require('express');
const { body } = require('express-validator');
const airportsController = require('../controllers/airports');

const router = express.Router();

const validateAirports = [
    body('IATA_code')
    .trim()
    .notEmpty()
    .isLength({max: 3})
    .withMessage('Invalid IATA_code'),
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Invalid name')
];

router.get('/', airportsController.getAirports);

router.post('/', validateAirports, airportsController.insertAirports);
  
module.exports = router;
