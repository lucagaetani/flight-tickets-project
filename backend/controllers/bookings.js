const Flights = require("../models/flights");
const Airports = require("../models/airports");
const Airlines = require("../models/airlines");
const Bookings = require("../models/bookings");
const sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const { Op } = require("@sequelize/core");
const Users = require("../models/users");

const getBooking = async (req, res, next) => {
  try {
    const decodedState = decodeURIComponent(req.query.state);
    const { airportFrom, airportTo, departingDate, returningDate } =
      JSON.parse(decodedState).formData;
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

const insertBookings = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error: invalid JSON",
    });
  }

  const { email, flight_number, date1, date2 } = req.body;

  const existingEmail = await Users.findByPk({email, transaction});
  if (!existingEmail) {
    await transaction.rollback();
    return res.status(400).json({
      success: false,
      message: "Non-existing email. Create user with this email then retry",
    });
  }

  const existingFlightNumber = await Flights.findByPk({flight_number, transaction});
  if (!existingFlightNumber) {
    await transaction.rollback();
    return res.status(400).json({
      success: false,
      message: "Non-existing flight number. Create a flight with this flight number then retry",
    });
  }

  try {
    const newBooking = await Bookings.create({
      fk_email: email,
      fk_flight: flight_number,
      date_departure: date1,
      date_arrival: date2
    }, transaction);

    await transaction.commit();

    res.status(200).send({
      success: true,
      message: "Booking inserted successfully",
      data: newBooking,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Can not insert booking, insert operation failed",
      error: error.message,
    });
  }
};

exports.getBooking = getBooking;
exports.getBookingsForUser = getBookingsForUser;
exports.insertBookings = insertBookings;
