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
const { QueryTypes } = require("sequelize");
const { insertTickets } = require("./tickets");
const Itineraries = require("../models/itineraries");
const Flights = require("../models/flights");
const Itineraries_Flights = require("../models/itineraries_flights");
const Airports = require("../models/airports");
const Airlines = require("../models/airlines");
const { Transaction } = require('sequelize');
const jwt = require("jsonwebtoken");

/**
 * Retrieves all bookings for a user.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @return {object} The response object with the bookings data.
 */
const getBookingsForUser = async (req, res, next) => {
  const decodedState = decodeURIComponent(req.query.state);
  const email = JSON.parse(decodedState);

  try {
    const user = await Users.findByPk(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User sent doesn't exists"
      });
    }

    const bookings = await Bookings.findAll({
      attributes: [
        'id'
      ],
      where: {
        fk_email: email
      },
      include: [{
        model: Itineraries,
        as: "itDep",
        attributes: ["arrival","departure","price","estimatedCO2"],
        include: [{
          model: Itineraries_Flights,
          as: "itFlights",
          include: [
            {
              model: Flights,
              as: "flight",
              include: [
                { model: Airlines, as: 'airline', attributes: ['name'] },
                { model: Airports, as: 'departureAirport', attributes: ['name']},
                { model: Airports, as: 'arrivalAirport', attributes: ['name']}
              ],
            },
          ]
        }]
      },
      {
        model: Itineraries,
        as: "itRet",
        include: [{
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
        }]
      },
      {
        model: Tickets,
        as: "tickets"
      },
    ],
    });

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved all bookings for the user",
      data: bookings
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Failed retrieval of bookings",
      error: error.message
    });
  }
}

/**
 * Inserts bookings into the system.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 * @return {Promise} A promise that resolves to the response object.
 */
const insertBookings = async (req, res, next) => {
  const transaction = await instanceSequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await transaction.rollback();
    return res.status(422).json({
      success: false,
      message: "Validation error: invalid JSON",
    });
  }

  try {
    //Checking if there is a cookie for the booking
    if (req.cookies.booking) {
      res.clearCookie("booking");
    } else {
      await transaction.rollback();
      return res.status(401).json({
        success: false,
        message: "Cookie expired",
      });
    }

    //Checking the consistency of all fks and data sent
    const flightState = req.body.flightState;
    const seatsFlightsDeparture = JSON.parse(flightState.seatsFlightsDeparture);
    const departureTicketsToBook = JSON.parse(flightState.seatsFlightsDeparture);
    const seatsFlightsReturning = JSON.parse(flightState.seatsFlightsReturning);
    const returningTicketsToBook = JSON.parse(flightState.seatsFlightsReturning);

    
    //Checks the availability of seats selected and the flight for booking. It also locks the seat for the current transaction
    const checkSeatsAndFlight = async (seatsFlight) => {
      for (const flight of seatsFlight) {
        for (const seat of flight) {
          //I can't lock a seat if isn't selected for booking
          if (seat.seatNumber && seat.seatPrice) {
            const seatCheckResult = await checkSeatForBooking(seat, transaction);
      
            if (!seatCheckResult) {
              await transaction.rollback();
              return res.status(400).json(seatCheckResult);
            }
    
            seat.seatNumber = seatCheckResult.seat_number;
            seat.seatPrice = seatCheckResult.price;
            seat.version = seatCheckResult.version;
          }
        }
      }
  
      const flightCheckResult = await checkFlightForBooking(seatsFlight[0][0]);
      if (!flightCheckResult) {
        await transaction.rollback();
        return res.status(400).json(flightCheckResult);
      }
    }

    await checkSeatsAndFlight(seatsFlightsDeparture);

    if (seatsFlightsReturning) {
      await checkSeatsAndFlight(seatsFlightsReturning);
    }

    //Check user email, if exists, i continue, otherwise i interrupt the transaction
    const email = flightState.userEmail;
    const existingEmail = await getUser(email);
    if (!existingEmail.success) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Non-existing email",
      });
    }

    /**
     * Insert departure booking with tickets
     * 
     * I've put a lock to the transaction for every seat i'm going to update, to avoid race conditions and to improve concurrency
     * I've also used optimistic locking to update the seats with the "version" field on the model.
     * If version isn't the same as the check on the database, the update will be rolled back
     */
    const updateSeats = async (seats, isReturning = false) => {
      for (const flight  of seats) {
        for (const seat of flight) {
          //I can't update a seat if isn't selected
          if (seat.seatNumber && seat.seatPrice) {
            const version = seat.version;
    
            const seatBooking = await Seats.update(
              {
                is_booked: true,
                version: instanceSequelize.literal('version + 1')
              },
              {
                where: {
                  seat_number: seat.seatNumber,
                  flight_number: seat.flightNumber,
                  version
                },
                transaction
              }
            );
  
            if (!seatBooking) {
              await transaction.rollback();
              return res.status(400).json({
                success: false,
                message: isReturning ? "Cannot book returning seats" : "Cannot book departure seats"
              });
            }
          }
        }
      }
    }

    await updateSeats(seatsFlightsDeparture);

    if (seatsFlightsReturning) {
      await updateSeats(seatsFlightsReturning, true);
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
    }, {transaction});

    
    //Generates an array of tickets based on the provided flights and optional flag for returning flights.
    const createTickets = (flights) => {
      const arrayOfTickets = [];
      for (const flight of flights) {
        for (const seat of flight) {
          arrayOfTickets.push({
            name: seat.arrayPassengerInfo["name"],
            surname: seat.arrayPassengerInfo["surname"],
            email: seat.arrayPassengerInfo["email"],
            phone: seat.arrayPassengerInfo["phone"],
            airportLuggage: seat.arrayPassengerInfo["airportLuggage"] || 0,
            holdLuggage: seat.arrayPassengerInfo["holdLuggage"] || 0,
            fk_seat_number: seat.seatNumber || null,
            seat_price: seat.seatPrice || null,
            fk_flight_number: seat.flightNumber,
            fk_booking: booking.id,
          });
        }
      }
      return arrayOfTickets;
    }
    
    //Insert tickets
    const departureTicketsBooking = await insertTickets(createTickets(departureTicketsToBook), transaction);
    if (!departureTicketsBooking.success || !departureTicketsBooking) {
      await transaction.rollback();
      return res.status(400).json(departureTicketsBooking);
    }

    if (returningTicketsToBook) {
      const returningTicketsBooking = await insertTickets(createTickets(returningTicketsToBook), transaction);
      if (!returningTicketsBooking.success || !returningTicketsBooking) {
        await transaction.rollback();
        return res.status(400).json(returningTicketsBooking);
      }
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

/**
 * Retrieves the remaining seats for a flight.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The response object.
 */
const getFlightRemainingSeats = async (req, res, next) => {
  //Takes the flightData from the HTTP request
  const decodedState = decodeURIComponent(req.query.state);
  const flightData = JSON.parse(decodedState);

  try {
    const totalSeatsResults = await Seats.findAll({
      attributes: [
        "flight_number",
        [
          instanceSequelize.fn('COUNT', instanceSequelize.col('seat_number')),
          'totalSeats',
        ],
      ],
      where: { flight_number: flightData.map(data => data.fk_flight_number) },
      group: ['flight_number'],
      raw: true,
    });

    
    // Query to get booked seats
    const bookedSeatsResults = await Tickets.findAll({
      attributes: [
        "fk_flight_number",
        [
          instanceSequelize.fn('COUNT', instanceSequelize.literal('1')),
          'bookedSeats',
        ],
      ],
      where: { fk_flight_number: flightData.map(data => data.fk_flight_number) },
      group: ['fk_flight_number'],
      raw: true,
    });

    //Insert the remaining seats into the original flightData array
    const enrichedFlightData = flightData.map(data => {
      const result = totalSeatsResults.find(result => result.flight_number === data.fk_flight_number);
      const totalSeats = result ? result.totalSeats : 0;
    
      const bookedSeatsResult = bookedSeatsResults.find(result => result.fk_flight_number === data.fk_flight_number);
      const bookedSeats = bookedSeatsResult ? bookedSeatsResult.bookedSeats : 0;
    
      return {
        ...data,
        remainingSeats: totalSeats - bookedSeats,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved remaining seats",
      data: enrichedFlightData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed retrival of remaining seats",
      error: error.message,
    });
  }
}

/**
 * Sets a cookie for 15 minutes (to prevent double bookings) with a JSON web token containing booking information.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @return {object} The response object with a JSON payload indicating the success or failure of the operation.
 */
const setBookingCookie = (req, res, next) => {
  try {
    //Set a cookie for 15 minutes
    const maxAge = 15 * 60 * 1000;

    const cookie = jwt.sign(
      {
        booking: "cookie-booking"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: maxAge,
      }
    );

    res.cookie("booking", cookie, {
      httpOnly: true,
      maxAge: maxAge,
      path: "/",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Cookie created correctly"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

/**
 * Retrieves the booking cookie from the request object.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @return {Object} The booking cookie or an error message.
 */
const getBookingCookie = (req, res, next) => {
  const cookie = req.cookies.booking;
  if (!cookie) {
    return res.status(401).json({
      success: false,
      message: "Cookie expired",
    });
  }
  try {
    //Verifies the cookie with the JWT_SECRET stored in the .env file
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);

    //If i'm beyond 15 minutes (max age of cookie), cookie expires
    if (((Math.floor(Date.now() / 1000)-decoded.iat)*1000) > 900000) {
      res.clearCookie("booking");
      return res.status(401).json({
        success: false,
        message: "Cookie expired",
      });
    }

    //Calculates the remained time for booking
    const timeRemained = new Date((new Date(decoded.iat*1000)).setMinutes(new Date(decoded.iat*1000).getMinutes() + 15)).getTime();

    return res.status(200).json({
      success: true,
      message: "Cookie parsed correctly",
      timeRemained
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }
};

/**
 * Deletes the booking cookie from the request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response object.
 */
const deleteBookingCookie = (req, res, next) => {
  const cookie = req.cookies.booking;
  if (!cookie) {
    return res.status(401).json({
      success: false,
      message: "Cookie expired",
    });
  }
  try {
    res.clearCookie("booking");

    return res.status(200).json({
      success: true,
      message: "Cookie deleted correctly",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.getBookingsForUser = getBookingsForUser;
exports.insertBookings = insertBookings;
exports.getFlightRemainingSeats = getFlightRemainingSeats;
exports.setBookingCookie = setBookingCookie;
exports.getBookingCookie = getBookingCookie;
exports.deleteBookingCookie = deleteBookingCookie;
