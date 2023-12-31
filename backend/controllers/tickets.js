const sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const Tickets = require("../models/tickets");
const instanceSequelize = require("../database");

const insertTickets = async (req, res, next) => {
  const arrayOfTickets = req;

  try {
    for (const ticket of arrayOfTickets) {
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
    const ticketBookings = await Tickets.bulkCreate(arrayOfTickets);
    if (!ticketBookings) {
      return {
        success: false,
        message: "Cannot insert tickets",
      };
    }
    return ticketBookings;
  } catch (error) {
    return {
      success: false,
      message: error
    };
  }
};

exports.insertTickets = insertTickets;