const sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const Tickets = require("../models/tickets");
const instanceSequelize = require("../database");

const insertTickets = async (req, res, next) => {
  const transaction = await instanceSequelize.transaction();
  try {
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
    console.log(ticket);
    if (ticket) {
      res.status(200).json({
        success: true
      });
    } else {
      transaction.rollback();
      res.status(401).json({
        success: false
      });
    }
    transaction.commit();
  } catch (error) {
    transaction.rollback();
    res.status(400).json({
      success: false
    });
  }
};

exports.insertTickets = insertTickets;