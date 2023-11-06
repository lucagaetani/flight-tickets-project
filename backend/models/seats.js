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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    is_booked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
  {
    primaryKey: ["seat_number", "flight_number"],
  }
);

Seats.belongsTo(Flights, {
  foreignKey: "flight_number",
});

async function insertSeats() {
  await Seats.bulkCreate([
    {
      seat_number: "A1",
      flight_number: "U2 4833",
      price: 120.0,
    },
    {
      seat_number: "A2",
      flight_number: "U2 4833",
      price: 100.0,
    },
    {
      seat_number: "A3",
      flight_number: "U2 4833",
      price: 100.0,
    },
    {
      seat_number: "A4",
      flight_number: "U2 4833",
      price: 120.0,
    },
    {
      seat_number: "B1",
      flight_number: "U2 4833",
      price: 60.0,
    },
    {
      seat_number: "B2",
      flight_number: "U2 4833",
      price: 55.0,
    },
    {
      seat_number: "B3",
      flight_number: "U2 4833",
      price: 55.0,
    },
    {
      seat_number: "B4",
      flight_number: "U2 4833",
      price: 60.0,
    },
    {
      seat_number: "C1",
      flight_number: "U2 4833",
      price: 50.0,
    },
    {
      seat_number: "C2",
      flight_number: "U2 4833",
      price: 45.0,
    },
    {
      seat_number: "C3",
      flight_number: "U2 4833",
      price: 45.0,
    },
    {
      seat_number: "C4",
      flight_number: "U2 4833",
      price: 55.0,
    },
  ]);
}

/*
(async () => {
    await Seats.sync({ force: true });
    insertSeats();
})();
*/

module.exports = Seats;
