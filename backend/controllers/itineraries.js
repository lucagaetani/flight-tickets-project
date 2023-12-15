const Itineraries = require("../models/itineraries");
const sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const Flights = require("../models/flights");
const Airports = require("../models/airports");
const Airlines = require("../models/airlines");

const getItinerariesForBooking = async (req, res, next) => {
  try {
    const decodedState = decodeURIComponent(req.query.state);
    const { airportFrom, airportTo, date } = JSON.parse(decodedState).data;
    const dateToSearch = new Date(date);

    const itineraries = await Itineraries.findAll({
      where: {
        airportFrom,
        airportTo,
        departure: dateToSearch
      },
      include: [
        {
          model: Flights,
          include: [
            { model: Airports, as: 'departureAirport', attributes: ['name'] },
            { model: Airports, as: 'arrivalAirport', attributes: ['name'] },
            { model: Airlines, as: 'airline', attributes: ['name'] },
          ],
          attributes: ['flight_number', 'fk_IATA_from', 'fk_IATA_to', 'departure', 'arrival', 'price', 'fk_airline'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Successfully retrieved all itineraries",
      data: itineraries
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Failed retrieval of itineraries",
      error
    });
  }
}

exports.getItinerariesForBooking = getItinerariesForBooking;