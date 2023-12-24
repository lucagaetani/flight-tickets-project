const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Flights = require("./flights");

const Itineraries_Flights = instanceSequelize.define(
  "Itineraries_Flights",
  {
    fk_itinerary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fk_flight_number: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Itineraries_Flights.belongsTo(Flights, {
  foreignKey: "fk_flight_number",
  as: "flight"
});

async function insertItineraries_Flights() {
  await Itineraries_Flights.bulkCreate([{
      fk_itinerary: 1,
      fk_flight_number: "U2 4833"
  },
  {
    fk_itinerary: 2,
    fk_flight_number: "U2 4826"
  },{
    fk_itinerary: 3,
    fk_flight_number: "U2 4009"
  },{
    fk_itinerary: 4,
    fk_flight_number: "U2 2039"
  },{
    fk_itinerary: 4,
    fk_flight_number: "U2 2835"
  },{
    fk_itinerary: 5,
    fk_flight_number: "U2 4890"
  },{
    fk_itinerary: 6,
    fk_flight_number: "AF 3294"
  },{
    fk_itinerary: 7,
    fk_flight_number: "BA 222"
  }]);
}

/*
(async () => {
    await Itineraries_Flights.sync({ force: true });
    insertItineraries_Flights();
})();
*/

module.exports = Itineraries_Flights;