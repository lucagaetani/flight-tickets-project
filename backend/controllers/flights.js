const Flights = require('../models/airports');
const Airports = require('../models/airports');
const sequelize = require("sequelize");
const { validationResult } = require('express-validator');
const { Op } = require("@sequelize/core");

const getFlightsForBooking = async (req, res, next) => {
    const { airportFrom, airportTo, departure, arrival } = req.query.state;
    try{
        const flights = await Flights.findAll({
            where: {
                fk_IATA_from: airportFrom,
                fk_IATA_to: airportTo, 
                date: {
                    [Op.between]: [departure, arrival]
                }
            },
            include: [
                {
                    model: Airports,
                    as: 'departureAirport',
                    attributes: ['IATA_code', 'name', 'country']
                },
                {
                    model: Airports,
                    as: 'arrivalAirport',
                    attributes: ['IATA_code', 'name', 'country']
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