//Routers for Tickets
const express = require("express");
const { body } = require("express-validator");
const ticketsController = require("../controllers/tickets");

const router = express.Router();

router.post("/insertTickets", ticketsController.insertTickets);

module.exports = router;
