const Seats = require("../models/seats");

const getSeatsForFlight = async (req, res, next) => {
  try {
    const decodedState = decodeURIComponent(req.query.state);
    const { flightNumber } = JSON.parse(decodedState).formData;

    const seats = await Seats.findAll({
      where: { flightNumber },
    });

    res.status(200).json({
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

const bookSeats = async (payload) => {
  const transaction = await sequelize.transaction();

  try {
    for (const booking of payload) {
      const { flightNumber, seats } = booking;

      for (const seatNumber of seats) {
        const seat = await Seats.findOne({
          where: { flightNumber, seatNumber, isBooked: false },
          transaction,
        });

        if (!seat) {
          await transaction.rollback();
          return {
            success: false,
            message: `Seat ${seatNumber} not available for flight ${flightNumber}`,
          };
        }

        await seat.update({ isBooked: true }, { transaction });
      }
    }

    await transaction.commit();
    return { success: true, message: "Seats booked successfully" };
  } catch (error) {
    await transaction.rollback();
    console.error(`Error booking seats: ${error.message}`);
    return { success: false, message: "Error booking seats" };
  }
};

exports.getSeatsForFlight = getSeatsForFlight;
exports.bookSeats = bookSeats;
