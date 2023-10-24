const Airports = require('../models/airports');
const sequelize = require("sequelize");
const { validationResult } = require('express-validator');

const getAirports = async (req, res, next) => {
  try {
      const airports = await Airports.findAll({ order: [[(sequelize.col('name'), sequelize.col('country')), 'ASC']]});

      res.status(200).json({ 
        message: `Successfully retrieved ${airports.length} airports`, 
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
  
    const { IATA_code, name, country } = req.body;
  
    try {
      const existingAirports = await Airports.findByPk(IATA_code);
  
      if (existingAirports) {
        res.status(400).json({
          message: "Airport with this code already exists in database"
        });
      }
  
      const newAirports = await Airports.create({
        IATA_code: IATA_code,
        name: name,
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

exports.getAirports = getAirports;
exports.insertAirports = insertAirports;