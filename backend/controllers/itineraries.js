const Itineraries = require("../models/itineraries");
const sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const Flights = require("../models/flights");
const Airports = require("../models/airports");
const Airlines = require("../models/airlines");
const { Op } = require("@sequelize/core");

const getItinerariesForBooking = async (req, res, next) => {
  try {
    const decodedState = decodeURIComponent(req.query.state);
    const { airportFrom, airportTo, date } = JSON.parse(decodedState);
    const dateToSearch = new Date(date);

    const itineraries = await Itineraries.findAll({
      where: {
        fk_IATA_from: airportFrom,
        fk_IATA_to: airportTo,
        departure: dateToSearch
      }
    });

    if (itineraries.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Successfully retrieved all itineraries, but they are 0",
        data: itineraries
      });
    }

    const flights = await Flights.findAll({
      where: {
        flight_number: {
          [Op.in]: itineraries.fk_flight_numbers
        }
      },
      include: [
        { model: Airports, as: 'departureAirport', attributes: ['name'] },
        { model: Airports, as: 'arrivalAirport', attributes: ['name'] },
        { model: Airlines, as: 'airline', attributes: ['name'] },
      ]
    });

    for (let i=0; i<itineraries.fk_flight_numbers.length; i++) {
      itineraries.fk_flight_numbers[i] = flights[i];
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieved all itineraries",
      data: itineraries
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Failed retrieval of itineraries",
      error: error.message
    });
  }
}

exports.getItinerariesForBooking = getItinerariesForBooking;