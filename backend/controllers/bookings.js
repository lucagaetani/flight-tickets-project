const Bookings = require("../models/bookings");
const Users = require("../models/users");
const Tickets = require("../models/tickets");
const sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const { Op } = require("@sequelize/core");
const { checkSeatForBooking } = require("./seats");
const { checkFlightForBooking } = require("./flights");

const getBookingsForUser = async (req, res, next) => {
  const decodedState = decodeURIComponent(req.query.state);
  const { email } = JSON.parse(decodedState);

  try {
    const user = Users.findByPk(email);
    if (!user) {
      res.status(400).json({
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
    res.status(500).json({
      success: false,
      message: "Failed retrieval of flight",
      error: error.message,
    });
  }
};

const insertBookings = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  let res;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error: invalid JSON",
    });
  }

  try {
    //Checking all fks and data sent
    let res = await checkSeatForBooking(flightState.departureSeatsWithFlight);
    if (!res) {
      await transaction.rollback();
      return res;
    }

    if (flightState.returningSeatsWithFlight) {
      let res = await checkSeatForBooking(flightState.returningSeatsWithFlight);
      if (!res) {
        await transaction.rollback();
        return res;
      }
    }
    
    const flightState = req.body.flightState;
    res = await checkFlightForBooking(flightState.selectedDepartureFlight);
    if (!res) {
      await transaction.rollback();
      return res;
    } else {
      const departureFlight = res;
    }

    if (flightState.selectedReturningFlight) {
      res = checkFlightForBooking(flightState.selectedReturningFlight);
      if (!res) {
        await transaction.rollback();
        return res;
      } else {
        const returningFlight = res;
      }
    }

    const email = flightState.userEmail;
    const existingEmail = await Users.findByPk({ email, transaction });
    if (!existingEmail) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Non-existing email",
      });
    }

    //Insert departure booking with tickets
    const departureBooking = await Bookings.create({
      fk_email: email,
      fk_flight: departureFlight.flight_number,
      date_departure: departureFlight.departure,
      date_arrival: departureFlight.arrival
    }, transaction);

    flightState.arrayDeparturePassengerInfos.map(async(ticket,index) => {
      await Tickets.create({
        name: ticket["name-"+index],
        surname: ticket["surname-"+index],
        email: ticket["email-"+index],
        phone: ticket["phone-"+index],
        airportLuggage: ticket["airportLuggage-"+index] ? ticket["airportLuggage-"+index] : 0,
        holdLuggage: ticket["holdLuggage-"+index] ? ticket["holdLuggage-"+index] : 0,
        fk_seat_number: ticket["seat_number-"+index],
        fk_seat_price: ticket["seat_price-"+index],
        fk_booking: departureBooking.id,
      }, transaction);
    });

    if (flightState.selectedReturningFlight) {
      //TODO
      const returningBooking = await Bookings.create({
        fk_email: email,
        fk_flight: returningFlight.flight_number,
        date_departure: returningFlight.departure,
        date_arrival: returningFlight.arrival
      }, transaction);

      flightState.arrayReturningPassengerInfos.map(async(ticket,index) => {
        await Tickets.create({
          name: ticket["name-"+index],
          surname: ticket["surname-"+index],
          email: ticket["email-"+index],
          phone: ticket["phone-"+index],
          airportLuggage: ticket["airportLuggage-"+index] ? ticket["airportLuggage-"+index] : 0,
          holdLuggage: ticket["holdLuggage-"+index] ? ticket["holdLuggage-"+index] : 0,
          fk_seat_number: ticket["seat_number-"+index],
          fk_seat_price: ticket["seat_price-"+index],
          fk_booking: departureBooking.id,
        }, transaction);
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
