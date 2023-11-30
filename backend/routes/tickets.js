//Routers for Airports
const express = require("express");
const { body } = require("express-validator");
const ticketsController = require("../controllers/booking");

const router = express.Router();

const validateTicket = [
  //TODO: booking
  /*
  body("IATA_code").trim().notEmpty().isLength({ max: 3 }),
  body("name").trim().notEmpty(),
  body("country").trim().notEmpty(),
  */
];

router.get("/getTickets", ticketsController.getTickets);

router.post("/insertTicket", validateTicket, ticketsController.insertTickets);

module.exports = router;