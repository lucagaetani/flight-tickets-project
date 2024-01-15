const sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const Tickets = require("../models/tickets");
const instanceSequelize = require("../database");

/**
 * Inserts an array of tickets into the database.
 *
 * @param {Array} req - The array of tickets to be inserted.
 * @param {Object} transaction - The transaction object for the database operation.
 * @return {Object} - An object indicating the success or failure of the operation.
 */
const insertTickets = async (req, transaction) => {
  const arrayOfTickets = req;

  try {
    for (const ticket of arrayOfTickets) {
      if (ticket.fk_seat_number){
        const existingTicket = await Tickets.findOne({
          where: {
            fk_flight_number: ticket.fk_flight_number,
            fk_seat_number: ticket.fk_seat_number
          }
        });
        if (existingTicket) {
          return {
            success: false,
            message: "Ticket already exists",
          };
        }
      }
    }

    //With bulkCreate i can insert a lot of tickets faster, without iterate-and-insert them
    const ticketBookings = await Tickets.bulkCreate(arrayOfTickets, {transaction});
    if (!ticketBookings) {
      return {
        success: false,
        message: "Cannot insert tickets",
      };
    }
    return { success: true, message: "Tickets inserted successfully" }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error
    };
  }
};

exports.insertTickets = insertTickets;