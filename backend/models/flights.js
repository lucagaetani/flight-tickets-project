const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Airports = require("./airports");
const Airlines = require("./airlines");

const Flights = instanceSequelize.define(
  "Flights",
  {
    flight_number: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fk_IATA_from: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    fk_IATA_to: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    departure: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    arrival: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fk_airline: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Flights.belongsTo(Airports, {
  foreignKey: "fk_IATA_from",
  as: "departureAirport",
});

Flights.belongsTo(Airports, {
  foreignKey: "fk_IATA_to",
  as: "arrivalAirport",
});

Flights.belongsTo(Airlines, {
  foreignKey: "fk_airline",
  as: "airline",
});

async function insertFlights() {
  await Flights.bulkCreate([
    {
      flight_number: "U2 4833",
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      departure: "2024-02-20 12:00:00.000 +00:00",
      arrival: "2024-02-20 14:30:00.000 +00:00",
      price: "46.0",
      fk_airline: 1,
      fk_stopover: null,
    },
    {
      flight_number: "U2 4826",
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      departure: "2024-02-20 15:00:00.000 +00:00",
      arrival: "2024-02-20 17:30:00.000 +00:00",
      price: "96.0",
      fk_airline: 1,
      fk_stopover: null,
    },
    {
      flight_number: "U2 4009",
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      departure: "2024-02-21 12:00:00.000 +00:00",
      arrival: "2024-02-21 14:30:00.000 +00:00",
      price: "89.0",
      fk_airline: 1,
      fk_stopover: null,
    },
    {
      flight_number: "U2 2039",
      fk_IATA_from: "VCE",
      fk_IATA_to: "LHR",
      departure: "2024-02-22 18:00:00.000 +00:00",
      arrival: "2024-02-22 19:30:00.000 +00:00",
      price: "89.0",
      fk_airline: 1,
      fk_stopover: null,
    },
    {
      flight_number: "U2 2835",
      fk_IATA_from: "LHR",
      fk_IATA_to: "ORY",
      departure: "2024-02-23 04:00:00.000 +00:00",
      arrival: "2024-02-23 07:30:00.000 +00:00",
      price: "89.0",
      fk_airline: 1,
      fk_stopover: null,
    },
    {
      flight_number: "U2 4890",
      fk_IATA_from: "ORY",
      fk_IATA_to: "VCE",
      departure: "2024-02-25 10:00:00.000 +00:00",
      arrival: "2024-02-25 12:30:00.000 +00:00",
      price: "50.0",
      fk_airline: 1,
      fk_stopover: null,
    },
    {
      flight_number: "AF 3294",
      fk_IATA_from: "ORY",
      fk_IATA_to: "VCE",
      departure: "2024-03-01 11:00:00.000 +00:00",
      arrival: "2024-03-01 13:30:00.000 +00:00",
      price: "160.0",
      fk_airline: 3,
      fk_stopover: null,
    },
    {
      flight_number: "BA 222",
      fk_IATA_from: "BNA",
      fk_IATA_to: "LHR",
      departure: "2023-11-30 19:45:00.000 +00:00",
      arrival: "2023-11-31 08:45:00.000 +00:00",
      price: "120.0",
      fk_airline: 2,
      fk_stopover: null,
    },
  ]);
}

//If uncommented, it inserts data into the database
/*
(async () => {
    await Flights.sync({ force: true });
    insertFlights();
})();
*/

module.exports = Flights;
