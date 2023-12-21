const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Users = require("./users");
const Itineraries = require("./itineraries");

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
	foreignKey: "fk_itinerary_departure"
});

Bookings.belongsTo(Itineraries, {
	foreignKey: "fk_itinerary_returning"
});

Bookings.belongsTo(Users, {
  foreignKey: "fk_email"
});

/*
(async () => {
    await Bookings.sync({ force: true });
})();
*/

module.exports = Bookings;