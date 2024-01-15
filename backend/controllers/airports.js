const Airports = require("../models/airports");
const sequelize = require("sequelize");
const { validationResult } = require("express-validator");

/**
 * Retrieves all airports from the database and sends a JSON response with the data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response with the data.
 */
const getAirports = async (req, res, next) => {
  try {
    const airports = await Airports.findAll({
      order: [[(sequelize.col("name"), sequelize.col("country")), "ASC"]],
    });

    res.status(200).json({
      success: true,
      message: `Successfully retrieved ${airports.length} airports`,
      data: airports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during the retrival of airports",
      error: error.message,
    });
  }
};

exports.getAirports = getAirports;
