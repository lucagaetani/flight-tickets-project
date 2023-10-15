const Airports = require('../models/airports');

const getAirports = (req, res, next) => {
    const airports = Airports.findOne({
        attributes: ["IATA_code", "name"]
    });
    return airports;
};

module.exports = {getAirports};