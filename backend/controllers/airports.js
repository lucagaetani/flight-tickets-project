const Airports = require('../models/airports');
const createError = require('http-errors');
const { validationResult } = require('express-validator');

const getAirports = async (req, res, next) => {
    try {
        const airports = await Airports.findAll();

        res.status(200).json({ message: "Successfully retrieved all airports"});
        res.json(airports);

    } catch(error) {
        next(createError(500, 'Error during the retrival of airports'));
    }
};

const insertAirports = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(422, 'Validation error. You brought a non valid JSON. Please retry.'));
    }
  
    const { IATA_code, name, city, country } = req.body;
  
    try {
      const existingAirports = await Airports.findOne({
        attributes : ["IATA_code"],
        where: { IATA_code: IATA_code }
      });
  
      if (existingAirports) {
        return next(createError(400, 'Airport with this code already exists in database.'));
      }
  
      const newAirports = await Airports.create({
        IATA_code: IATA_code,
        name: name,
        city: city,
        country: country
      });
  
      res.send ({
        status: 200,
        message: 'Airport inserted successfully',
        data: newAirports
      });
      
    } catch (error) {
      console.error(error);
      next(createError(500, 'Can not insert airport'));
    }
  };

exports.insertAirports = insertAirports;
exports.getAirports = getAirports;