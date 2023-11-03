const Flights = require("../models/flights");
const Airports = require("../models/airports");
const Airlines = require("../models/airlines");
const sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const { Op } = require("@sequelize/core");

const getFlightsForBooking = async (req, res, next) => {
  try {
    const decodedState = decodeURIComponent(req.query.state);
    const { airportFrom, airportTo, departingDate, returningDate } =
      JSON.parse(decodedState).formData;
    const departure = new Date(departingDate);
    let arrayDepartureReturning = [];

    const whereClauseDeparture = {
      fk_IATA_from: airportFrom,
      fk_IATA_to: airportTo,
      departure: {
        [Op.gt]: departure,
      },
    };

    if (returningDate) {
      whereClauseDeparture.departure += {
        [Op.lt]: arrival,
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
      const arrival = new Date(returningDate);
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

    res.status(200).json({
      success: true,
      message: "Successfully retrieved flights",
      data: arrayDepartureReturning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed retrieval of flight",
      error: error.message,
    });
  }
};

exports.getFlightsForBooking = getFlightsForBooking;
