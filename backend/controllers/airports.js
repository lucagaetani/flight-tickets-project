const Airports = require('../models/airports');
const createError = require('http-errors');
const { validationResult } = require('express-validator');

const getAirports = async (req, res, next) => {
    try {
        const Airports = await Airports.findAll();
        res.status(200).json({ msg: "Successfully retrieved all airports"});
        res.json(Airports);
    } catch(error) {
        next(createError(500, 'Error during the retrival of airports'));
    }
};

const insertAirports = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(422, 'Validation error', { errors: errors.array() }));
    }
  
    const { IATA_code, name } = req.body;
  
    try {
      const existingAirports = await Airports.findOne({
        attributes : ["IATA_code"],
        where: { IATA_code: IATA_code }
      });
  
      if (existingAirports) {
        return next(createError(400, 'Airport with this code already exists'));
      }
  
      const newAirports = await Airports.create({
        IATA_code: IATA_code,
        name: name,
      });
  
      res.message = 'Airport inserted successfully';
      res.data = newAirports;
    } catch (error) {
      console.error(error);
      next(createError(500, 'Can not insert airport into database'));
    }
  };

exports.insertAirports = insertAirports;
exports.getAirports = getAirports;