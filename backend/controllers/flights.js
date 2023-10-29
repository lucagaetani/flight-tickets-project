const Flights = require('../models/airports');
const sequelize = require("sequelize");
const { validationResult } = require('express-validator');

const getFlightsForBooking = async (req, res, next) => {
    const { airportFrom, airportTo, departure } = req.body;

    try{
        const flights = await Flights.findAll({
            where: {
                fk_ai
            }
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