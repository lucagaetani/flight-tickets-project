const Airports = require('../models/airports');
const { validationResult } = require('express-validator');

const getAirports = async (req, res, next) => {
    try {
        const airports = await Airports.findAll();

        res.status(200).json({ message: "Successfully retrieved all airports", data: airports});

    } catch(error) {
        res.status(500).json({
          message: "Error during the retrival of airports",
          error: error.message
        });
    }
};

const getAirport = async (req, res, next) => {
  const { IATA_code } = req.body;

  try {
      const airports = await Airports.findByPk(IATA_code);

      res.status(200).json({ 
        message: "Successfully retrieved all airports", 
        data: airports
      });

  } catch(error) {
      res.status(500).json({
        message: "Error during the retrival of airports",
        error: error.message
      });
  }
};

const insertAirports = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation error: invalid JSON"
      });
    }
  
    const { IATA_code, name, city, country } = req.body;
  
    try {
      const existingAirports = await Airports.findOne({
        attributes : ["IATA_code"],
        where: { IATA_code: IATA_code }
      });
  
      if (existingAirports) {
        res.status(400).json({
          message: "Airport with this code already exists in database"
        });
      }
  
      const newAirports = await Airports.create({
        IATA_code: IATA_code,
        name: name,
        city: city,
        country: country
      });
  
      res.status(200).send({
        message: 'Airport inserted successfully',
        data: newAirports
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Can not insert airport, insert operation failed",
        error: error.message
      })
    }
};

exports.getAirport = getAirport;
exports.insertAirports = insertAirports;
exports.getAirports = getAirports;