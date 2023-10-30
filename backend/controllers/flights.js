const Flights = require('../models/flights');
const Airports = require('../models/airports');
const sequelize = require("sequelize");
const { validationResult } = require('express-validator');
const { Op } = require("@sequelize/core");

const getFlightsForBooking = async (req, res, next) => {
    try{
        const decodedState = decodeURIComponent(req.query.state);
        const { airportFrom, airportTo, departingDate } = JSON.parse(decodedState).formData;
        const departure = new Date(departingDate);
        
        const flights = await Flights.findAll({
            where: {
                fk_IATA_from: airportFrom,
                fk_IATA_to: airportTo, 
                departure: {
                    [Op.gt]: departure
                }
            },
            include: [
                {
                    model: Airports,
                    as: 'departureAirport',
                    attributes: ['name']
                },
                {
                    model: Airports,
                    as: 'arrivalAirport',
                    attributes: ['name']
                },
            ]
        });

        res.status(200).json({
            success: true,
            message: "Successfully retrieved flights",
            data: flights
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed retrieval of flight",
            error: error.message
        });
    }
};

exports.getFlightsForBooking = getFlightsForBooking;