const Itineraries = require("../models/itineraries");
const Flights = require("../models/flights");
const Airports = require("../models/airports");
const Airlines = require("../models/airlines");
const { Op } = require("@sequelize/core");
const Itineraries_Flights = require("../models/itineraries_flights");
const instanceSequelize = require("../database");

/**
 * Retrieves itineraries for a booking based on the provided request query.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise} A promise that resolves with the retrieved itineraries.
 */
const getItinerariesForBooking = async (req, res, next) => {
  try {
    //Takes the data from the HTTP request
    const decodedState = decodeURIComponent(req.query.state);
    const { airportFrom, airportTo, date } = JSON.parse(decodedState);
    //Set time to 00:00 and 23:59 for searching flights through all the day selected
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