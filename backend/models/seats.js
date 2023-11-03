const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Flights = require("./flights");

const Seats = instanceSequelize.define(
  "Seats",
  {
    seat_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flight_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_booked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    primaryKey: ["seat_number", "flight_number"],
  }
);

Seats.belongsTo(Flights, {
  foreignKey: "flight_number",
});

module.exports = Seats;
