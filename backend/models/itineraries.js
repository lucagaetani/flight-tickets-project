const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Flights = require("./flights");

const Itineraries = instanceSequelize.define(
  "Itineraries",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
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
    },
    fk_flight_numbers: {
      type: DataTypes.ARRAY,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Itineraries.hasMany(Flights, { foreignKey: 'fk_flight_numbers' });

async function insertItineraries() {
  await Itineraries.bulkCreate([
    {
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      departure: "2024-02-20 12:00:00.000 +00:00",
      arrival: "2024-02-20 14:30:00.000 +00:00",
      price: "46.0",
      fk_flight_numbers: ["U2 4833"]
    },
    {
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      fk_flight_numbers: ["U2 4826"]
    },
    {
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      fk_flight_numbers: ["U2 4009"]
    },
    {
      fk_IATA_from: "VCE",
      fk_IATA_to: "ORY",
      fk_flight_numbers: ["U2 2039", "U2 2835"]
    },
    {
      fk_IATA_from: "ORY",
      fk_IATA_to: "VCE",
      fk_flight_numbers: ["U2 4826"]
    },
    {
      fk_IATA_from: "ORY",
      fk_IATA_to: "VCE",
      fk_flight_numbers: ["AF 3294"]
    },
    {
      fk_IATA_from: "BNA",
      fk_IATA_to: "LHR",
      fk_flight_numbers: ["BA 222"]
    },
  ]);
}


(async () => {
    await Itineraries.sync({ force: true });
    insertItineraries();
})();


module.exports = Itineraries;
