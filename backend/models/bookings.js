const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Users = require("./users");
const Itineraries = require("./itineraries");
const Tickets = require("./tickets");

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
    fk_itinerary_departure: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fk_itinerary_returning: {
      type: DataTypes.INTEGER
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Bookings.belongsTo(Itineraries, {
	foreignKey: "fk_itinerary_departure",
  as: "itDep"
});

Bookings.belongsTo(Itineraries, {
	foreignKey: "fk_itinerary_returning",
  as: "itRet"
});

Bookings.belongsTo(Users, {
  foreignKey: "fk_email"
});

Bookings.hasMany(Tickets, {
  foreignKey: "fk_booking",
	as: "tickets"
});

/*
(async () => {
    await Bookings.sync({ force: true });
})();
*/

module.exports = Bookings;