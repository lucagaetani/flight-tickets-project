const Bookings = require("../models/bookings");
const Users = require("../models/users");
const Tickets = require("../models/tickets");
const instanceSequelize = require("../database");
const { validationResult } = require("express-validator");
const { Op } = require("@sequelize/core");
const { checkSeatForBooking } = require("./seats");
const { checkFlightForBooking } = require("./flights");
const Seats = require("../models/seats");
const { getUser } = require("./users");

const getBookingsForUser = async (req, res, next) => {
  const decodedState = decodeURIComponent(req.query.state);
  const { email } = JSON.parse(decodedState);

  try {
    const user = Users.findByPk(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User sent doesn't exists"
      });
    }

    const bookings = Bookings.findAll({
      where: {
        fk_email: email
      }
    });

    res.status(501).json({
      success: true,
      message: "",
      data: bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed retrieval of bookings",
      error: error.message
    });
  }
}

const getBooking = async (req, res, next) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed retrieval of flight",
      error: error.message,
    });
  }
};

const insertBookings = async (req, res, next) => {
  const transaction = await instanceSequelize.transaction();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error: invalid JSON",
    });
  }

  try {
    //Checking the consistency of all fks and data sent
    const flightState = req.body.flightState;

    flightState.seatsFlightsDeparture.map(async (flight, index) => {
      let res = await checkSeatForBooking(flight[index]);
      if (!res) {
        await transaction.rollback();
        return res;
      }

      res = await checkFlightForBooking(flight[index].flight_number);
      if (!res) {
        await transaction.rollback();
        return res;
      }
    });

    if (flightState.seatsFlightsReturning) {
      flightState.seatsFlightsReturning.map(async (flight, index) => {
        let res = await checkSeatForBooking(flight[index]);
        if (!res) {
          await transaction.rollback();
          return res;
        }

        res = await checkFlightForBooking(flight[index].flight_number);
        if (!res) {
          await transaction.rollback();
          return res;
        }
      });
    }

    const email = flightState.userEmail;
    const existingEmail = await getUser(email);
    if (!existingEmail) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Non-existing email",
      });
    }

    //Insert departure booking with tickets
    flightState.seatsFlightsDeparture.map(async (flight, index) => {
      const seatsBooking = await Seats.update({
        seat_number: flight[index].seatNumber,
        is_booked: true
      }, transaction);

      if (!seatsBooking) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Cannot booking departure seats",
        });
      }
    });

    if (flightState.seatsFlightsReturning) {
      flightState.seatsFlightsReturning.map(async (flight, index) => {
        const seatsBooking = await Seats.update({
          seat_number: flight[index].seatNumber,
          is_booked: true
        }, transaction);

        if (!seatsBooking) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Cannot booking returning seats",
          });
        }
      });
    }

    flightState.seatsFlightsDeparture.map(async (flight, index) => {
      const departureBooking = await Bookings.create({
        fk_email: email,
        fk_flight: departureFlight.flight_number,
        date_departure: departureFlight.departure,
        date_arrival: departureFlight.arrival
      }, transaction);

      if (!departureBooking) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Cannot booking departure",
        });
      }

      const ticketsBooking = await Tickets.create({
        name: flight[index]["name-"+index],
        surname: flight[index]["surname-"+index],
        email: flight[index]["email-"+index],
        phone: flight[index]["phone-"+index],
        airportLuggage: flight[index]["airportLuggage-"+index] ? flight[index]["airportLuggage-"+index] : 0,
        holdLuggage: flight[index]["holdLuggage-"+index] ? flight[index]["holdLuggage-"+index] : 0,
        fk_seat_number: flight[index].seatNumber,
        fk_seat_price: flight[index].seatPrice,
        fk_booking: departureBooking.id,
      }, transaction);

      if (!ticketsBooking) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Cannot booking departure tickets",
        });
      }
    });


    if (flightState.seatsFlightsReturning) {
      flightState.seatsFlightsReturning.map(async (flight, index) => {
        const departureBooking = await Bookings.create({
          fk_email: email,
          fk_flight: departureFlight.flight_number,
          date_departure: departureFlight.departure,
          date_arrival: departureFlight.arrival
        }, transaction);
  
        if (!departureBooking) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Cannot booking returning",
          });
        }
  
        const ticketsBooking = await Tickets.create({
          name: flight[index]["name-"+index],
          surname: flight[index]["surname-"+index],
          email: flight[index]["email-"+index],
          phone: flight[index]["phone-"+index],
          airportLuggage: flight[index]["airportLuggage-"+index] ? flight[index]["airportLuggage-"+index] : 0,
          holdLuggage: flight[index]["holdLuggage-"+index] ? flight[index]["holdLuggage-"+index] : 0,
          fk_seat_number: flight[index].seatNumber,
          fk_seat_price: flight[index].seatPrice,
          fk_booking: departureBooking.id,
        }, transaction);
  
        if (!ticketsBooking) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Cannot booking returning tickets",
          });
        }
      });
    }

    await transaction.commit();

    if (flightState.selectedReturningFlight) {
      res.status(200).send({
        success: true,
        message: "Departure booking inserted successfully",
        departureBooking
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Departure and returning booking inserted successfully",
        departureBooking,
        returningBooking
      });
    }

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
