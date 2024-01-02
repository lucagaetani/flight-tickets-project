const Itineraries = require("../models/itineraries");
const Flights = require("../models/flights");
const Airports = require("../models/airports");
const Airlines = require("../models/airlines");
const { Op } = require("@sequelize/core");
const Itineraries_Flights = require("../models/itineraries_flights");
const instanceSequelize = require("../database");

const getItinerariesForBooking = async (req, res, next) => {
  try {
    const decodedState = decodeURIComponent(req.query.state);
    const { airportFrom, airportTo, date } = JSON.parse(decodedState);
    const dateToSearch00 = new Date(date);
    const dateToSearch23 = new Date(date);
    dateToSearch23.setHours(23, 59, 0, 0);

    const itineraries = await Itineraries.findAll({
      where: {
        fk_IATA_from: airportFrom,
        fk_IATA_to: airportTo,
        departure: {
          [Op.gte]: dateToSearch00,
          [Op.lte]: dateToSearch23
        },
      },
      include: [
        {
          model: Itineraries_Flights,
          as: "itFlights",
          include: [
            {
              model: Flights,
              as: "flight",
              include: [
                { model: Airports, as: 'departureAirport', attributes: ['name'] },
                { model: Airports, as: 'arrivalAirport', attributes: ['name'] },
                { model: Airlines, as: 'airline', attributes: ['name'] },
              ]
            }
          ]
        }
      ]
    });

    if (!itineraries) {
      return res.status(200).json({
        success: true,
        message: "No itineraries retrieved",
        data: itineraries
      });
    }

    if (itineraries.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Successfully retrieved 0 itineraries",
        data: itineraries
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved all itineraries",
      data: itineraries
    });

  } catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed retrieval of itineraries",
      error: error.message
    });
  }
}

exports.getItinerariesForBooking = getItinerariesForBooking;