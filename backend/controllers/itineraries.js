const Itineraries = require("../models/itineraries");
const sequelize = require("sequelize");
const { validationResult } = require("express-validator");

const getItinerariesForBooking = async (req, res, next) => {
  const decodedState = decodeURIComponent(req.query.state);
    const { airportFrom, airportTo, departingDate, returningDate } = JSON.parse(decodedState).formData;
}

exports.getItinerariesForBooking = getItinerariesForBooking;