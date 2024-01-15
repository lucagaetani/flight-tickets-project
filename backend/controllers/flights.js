const Flights = require("../models/flights");
const Airports = require("../models/airports");
const Airlines = require("../models/airlines");
const { validationResult } = require("express-validator");
const { Op } = require("@sequelize/core");
const instanceSequelize = require("../database");

/**
 * Retrieves flights for a booking based on the provided request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise} A promise that resolves to the retrieved flights.
 */
const getFlightsForBooking = async (req, res, next) => {
  try {
    //Takes the data from the HTTP request
    const decodedState = decodeURIComponent(req.query.state);
    const { airportFrom, airportTo, departingDate, returningDate } = JSON.parse(decodedState).formData;
    const departure = new Date(departingDate);
    let arrayDepartureReturning = [];
    let whereClauseDeparture;
    let arrival;

    if (returningDate) {
      arrival = new Date(returningDate);
      whereClauseDeparture = {
        fk_IATA_from: airportFrom,
        fk_IATA_to: airportTo,
        departure: {
          [Op.gt]: departure,
          [Op.lt]: arrival
        },
      };
    } else {
      whereClauseDeparture = {
        fk_IATA_from: airportFrom,
        fk_IATA_to: airportTo,
        departure: {
          [Op.gt]: departure,
        },
      };
    }


    arrayDepartureReturning.push(
      await Flights.findAll({
        where: whereClauseDeparture,
        include: [
          {
            model: Airports,
            as: "departureAirport",
            attributes: ["name"],
          },
          {
            model: Airports,
            as: "arrivalAirport",
            attributes: ["name"],
          },
          {
            model: Airlines,
            as: "airline",
            attributes: ["name"],
          },
        ],
      })
    );

    if (returningDate) {
      arrayDepartureReturning.push(
        await Flights.findAll({
          where: {
            fk_IATA_from: airportTo,
            fk_IATA_to: airportFrom,
            departure: {
              [Op.gt]: departure,
              [Op.lt]: arrival,
            },
          },
          include: [
            {
              model: Airports,
              as: "departureAirport",
              attributes: ["name"],
            },
            {
              model: Airports,
              as: "arrivalAirport",
              attributes: ["name"],
            },
            {
              model: Airlines,
              as: "airline",
              attributes: ["name"],
            },
          ],
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved flights",
      data: arrayDepartureReturning,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed retrieval of flight",
      error: error.message,
    });
  }
};

const checkFlightForBooking = async (req, res, next) => {
  const { flightNumber } = req;

  const existingFlightNumberDeparture = await Flights.findByPk(flightNumber);
    if (!existingFlightNumberDeparture) {
      return {
        success: false,
        message: "Non-existing departure flight number",
      };
    }
  return existingFlightNumberDeparture;
}


exports.getFlightsForBooking = getFlightsForBooking;
exports.checkFlightForBooking = checkFlightForBooking;