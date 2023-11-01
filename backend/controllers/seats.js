const Seats = require('../models/seats');
const sequelize = require("sequelize");
const { validationResult } = require('express-validator');

const getSeatsForFlight = async (req, res, next) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();
    
        for (const { flightNumber, seatNumbers } of flightSeatData) {
            const seats = await Seats.findAll({
                where: {
                    flight_number: flightNumber,
                    seat_number: seatNumbers,
                    booked: false
                },
                transaction
            });
    
            if (seats.length !== seatNumbers.length) {
                await transaction.rollback();
                return { success: false, message: 'One or more seats are not available for booking.' };
            }
    
            for (const seatNumber of seatNumbers) {
                await Seats.update(
                    { booked: true, user_id: userId },
                    { where: { flight_number: flightNumber, seat_number: seatNumber }, transaction }
                );
            }
        }
    
        await transaction.commit();
    
        return { success: true, message: 'Seats booked successfully.' };
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
    
        console.error('Error booking seats:', error);
        return { success: false, message: 'Error booking seats.' };
    }
};

exports.getFlightsForBooking = getFlightsForBooking;