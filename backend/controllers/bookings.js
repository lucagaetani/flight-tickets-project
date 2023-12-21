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

    const seatsFlightsDeparture = flightState.seatsFlightsDeparture;
    const seatsFlightsReturning = flightState.seatsFlightsReturning;

    for (const flight of seatsFlightsDeparture) {
      for (const seat of flight) {
        const seatCheckResult = await checkSeatForBooking(seat);
        if (!seatCheckResult) {
          await transaction.rollback();
          return res.status(400).json(seatCheckResult);
        }

        seat.seatNumber = seatCheckResult.seat_number;
        seat.seatPrice = seatCheckResult.price;
      }
    }

    const flightCheckResult = await checkFlightForBooking(seatsFlightsDeparture[0][0]);
    if (!flightCheckResult) {
      await transaction.rollback();
      return res.status(400).json(flightCheckResult);
    }

    if (seatsFlightsReturning) {
      for (const flight of seatsFlightsReturning) {
        for (const seat of flight) {
          const seatCheckResult = await checkSeatForBooking(seat);
          if (!seatCheckResult) {
            await transaction.rollback();
            return res.status(400).json(seatCheckResult);
          }

          seat.seatNumber = seatCheckResult.seat_number;
          seat.seatPrice = seatCheckResult.price;
        }
      }

      const flightCheckResult = await checkFlightForBooking(seatsFlightsReturning[0][0]);
      if (!flightCheckResult) {
        await transaction.rollback();
        return res.status(400).json(flightCheckResult);
      }
    }

    const email = flightState.userEmail;
    const existingEmail = await getUser(email);
    if (!existingEmail.success) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Non-existing email",
      });
    }

    //Insert departure booking with tickets
    for (const flight  of seatsFlightsDeparture) {
      for (const seat of flight) {
        const seatBooking = await Seats.update(
          {
            is_booked: true
          },
          {
            where: {
              seat_number: seat.seatName
            }
          },
          transaction
        );

        if (!seatBooking) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Cannot book departure seats",
          });
        }
      }
    }

    if (seatsFlightsReturning) {
      for (const flight of seatsFlightsReturning) {
        for (const seat of flight) {
          const seatBooking = await Seats.update(
            {
              is_booked: true
            },
            {
              where: {
                seat_number: seat.seatName
              }
            },
            transaction
          );
  
          if (!seatBooking) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: "Cannot book returning seats",
            });
          }
        }
      }
    }

    /**
     * Booking consist of:
     * - fk_email --> the email of the person who books (can differ from the info inserted)
     * - fk_itinerary_departure --> the itinerary chosen at the beginning for departure
     * - fk_itinerary_returning --> if returning exists, the itinerary chosen at the beginning for returning
     */
    const booking = await Bookings.create({
      fk_email: email,
      fk_itinerary_departure: seatsFlightsDeparture[0][0].itineraryId,
      fk_itinerary_returning: seatsFlightsReturning ? seatsFlightsReturning[0][0].itineraryId : null,
    }, transaction);

    if (!booking) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot booking departure",
      });
    }

    const ticket = await Tickets.create({
      name: "drip",
      surname: "tip",
      email: "dip",
      phone: "48329384",
      airplaneLuggage: 0,
      holdLuggage: 0,
      fk_seat_number: "A4",
      seat_price: 90.5,
      fk_flight_number: "U2 8484",
      fk_booking: 1
    }, transaction)

    const createTickets = async (flights, isReturning = false) => {
      for (const flight of flights) {
        for (const seat of flight) {
          const passengerInfo = seat.arrayPassengerInfo;
          console.log(passengerInfo);
          if (!passengerInfo["airportLuggage"]) {
            passengerInfo["airportLuggage"] = 0;
          }
          if (!passengerInfo["holdLuggage"]) {
            passengerInfo["holdLuggage"] = 0;
          }
          const ticketsBooking = await Tickets.create({
            name: passengerInfo["name"],
            surname: passengerInfo["surname"],
            email: passengerInfo["email"],
            phone: passengerInfo["phone"],
            airportLuggage: passengerInfo["airportLuggage"],
            holdLuggage: passengerInfo["holdLuggage"],
            fk_seat_number: seat.seatNumber,
            seat_price: seat.seatPrice,
            fk_flight_number: seat.flightNumber,
            fk_booking: booking.id,
          }, transaction);

          if (!ticketsBooking) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: `Cannot book ${isReturning ? "returning" : "departure"} tickets`,
            });
          }
        }
      }
    };

    await createTickets(seatsFlightsDeparture);

    if (seatsFlightsReturning) {
      await createTickets(seatsFlightsReturning, true);
    }

    await transaction.commit();

    if (seatsFlightsReturning) {
      res.status(200).send({
        success: true,
        message: "Departure booking inserted successfully",
        booking
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Departure and returning booking inserted successfully",
        booking
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
