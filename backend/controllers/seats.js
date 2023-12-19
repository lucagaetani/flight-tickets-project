const Seats = require("../models/seats");

const getSeatsForFlight = async (req, res, next) => {
  try {
    const decodedState = decodeURIComponent(req.query.state);
    const seatsJSON = JSON.parse(decodedState);

    const seats = await Seats.findAll({
      attributes: ["seat_number","price","is_booked"],
      where: {
        flight_number: seatsJSON.flight_number
      },
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

const checkSeatForBooking = async (req, res, next) => {
  const { seatNumber, flightNumber } = req;
  try {
    const check = await Seats.findOne({
      where: {
        seat_number: seatNumber,
        flight_number: flightNumber
      }
    });

    if (!check) {
      return res.status(400).json({
        success: false,
        seat_number: seatNumber,
        message: `Seat ${seatNumber} doesn't exist`,
      });
    } else if (check.isBooked) {
      return res.status(400).json({
        success: false,
        seat_number: check.seat_number,
        message: `Seat ${check.seat_number} booked previously`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully checked seat"
    });
  } catch(error) {
    return res.status(500).json({
      success: false,
      message: "Failed checking of seat",
      error: error.message,
    });
  }
}


exports.getSeatsForFlight = getSeatsForFlight;
exports.checkSeatForBooking = checkSeatForBooking;
