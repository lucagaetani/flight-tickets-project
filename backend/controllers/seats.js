const Seats = require("../models/seats");
const LOCK = require("@sequelize/core");

const getSeatsForFlight = async (req, res, next) => {
  try {
    const decodedState = decodeURIComponent(req.query.state);
    const seatsJSON = JSON.parse(decodedState);

    const seats = await Seats.findAll({
      attributes: ["seat_number","price","is_booked"],
      where: {
        flight_number: seatsJSON.flight_number
      },
      order: [
        ['seat_number', 'ASC']
      ]
    });

    if (!seats) {
      return res.status(401).json({
        success: false,
        message: "No seats retrieved in this flight",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved seats",
      data: seats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed retrieval of seats",
      error: error.message,
    });
  }
};

const checkSeatForBooking = async (req, transaction, res, next) => {
  const { seatNumber, flightNumber } = req;
  
  try {
    const check = await Seats.findOne({
      where: {
        seat_number: seatNumber,
        flight_number: flightNumber
      },
      lock: LOCK.UPDATE,
      transaction
    });

    if (!check) {
      return {
        success: false,
        seat_number: seatNumber,
        message: `Seat ${seatNumber} doesn't exist`,
      };
    } else if (check.isBooked) {
      return {
        success: false,
        seat_number: check.seat_number,
        message: `Seat ${check.seat_number} booked previously`,
      };
    }

    return check;
  } catch(error) {
    return {
      success: false,
      message: "Failed checking of seat",
      error: error.message,
    };
  }
}


exports.getSeatsForFlight = getSeatsForFlight;
exports.checkSeatForBooking = checkSeatForBooking;
