const Airports = require('../models/airports');

const getAirports = (req, res, next) => {
    const airports = Airports.findOne({
        attributes: ["IATA_code", "name"]
    });
    return airports;
};

const validateAirports = (req, res) => {

}

const insertAirports = (req, res, next) => {
    
}

module.exports = {getAirports};