const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Flights = require("./flights");
const Users = require("./users");

const Bookings = instanceSequelize.define(
  "Bookings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fk_flight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Bookings.belongsTo(Flights, {
	foreignKey: "fk_flight"
});

Bookings.belongsTo(Users, {
  foreignKey: "fk_email"
})

/*
(async () => {
    await Booking.sync({ force: true });
})();
*/

module.exports = Bookings;