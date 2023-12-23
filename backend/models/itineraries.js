const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Flights = require("./flights");
const Itineraries_Flights = require("./itineraries_flights");

const Itineraries = instanceSequelize.define(
  "Itineraries",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    estimatedCO2: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Itineraries.hasMany(Itineraries_Flights, {
  foreignKey: "fk_itinerary",
});

async function insertItineraries() {
  await Itineraries.bulkCreate([
    {
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      departure: "2024-02-20 12:00:00.000 +00:00",
      arrival: "2024-02-20 14:30:00.000 +00:00",
      price: "46.0",
      estimatedCO2: "120"
    },
    {
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      departure: "2024-02-20 15:00:00.000 +00:00",
      arrival: "2024-02-20 17:30:00.000 +00:00",
      price: "96.0",
      estimatedCO2: "100"
    },
    {
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      departure: "2024-02-21 12:00:00.000 +00:00",
      arrival: "2024-02-21 14:30:00.000 +00:00",
      price: "89.0",
      estimatedCO2: "150"
    },
    {
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      departure: "2024-02-22 18:00:00.000 +00:00",
      arrival: "2024-02-23 07:30:00.000 +00:00",
      price: "178.0",
      estimatedCO2: "220"
    },
    {
      fk_IATA_from: "ORY",
      fk_IATA_to: "VCE",
      departure: "2024-02-20 15:00:00.000 +00:00",
      arrival: "2024-02-20 17:30:00.000 +00:00",
      price: "96.0",
      estimatedCO2: "155"
    },
    {
      fk_IATA_from: "ORY",
      fk_IATA_to: "VCE",
      departure: "2024-03-01 11:00:00.000 +00:00",
      arrival: "2024-03-01 13:30:00.000 +00:00",
      price: "160.0",
      estimatedCO2: "100"
    },
    {
      fk_IATA_from: "BNA",
      fk_IATA_to: "LHR",
      departure: "2023-11-30 19:45:00.000 +00:00",
      arrival: "2023-11-31 08:45:00.000 +00:00",
      price: "120.0",
      estimatedCO2: "150"
    },
  ]);
}

/*
(async () => {
    await Itineraries.sync({ force: true });
    insertItineraries();
})();
*/

module.exports = Itineraries;
