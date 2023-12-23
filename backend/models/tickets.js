const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Bookings = require("./bookings");
const Seats = require("./seats");
const Flights = require("./flights");

const Tickets = instanceSequelize.define(
	"Tickets",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		surname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false
		},
		airplane_luggage: {
			type: DataTypes.INTEGER,
		},
		hold_luggage: {
			type: DataTypes.INTEGER,
		},
		fk_seat_number: {
			type: DataTypes.STRING,
		},
		seat_price: {
			type: DataTypes.FLOAT,
		},
		fk_flight_number: {
			type: DataTypes.STRING,
			allowNull: false
		},
		fk_booking: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);

Tickets.belongsTo(Bookings, {
	foreignKey: "fk_booking"
});

Tickets.belongsTo(Flights, {
	foreignKey: "fk_flight_number"
});

Tickets.belongsTo(Seats, {
	foreignKey: "fk_seat_number"
});


/*
(async () => {
	await Tickets.sync({ force: true });
})();
*/


module.exports = Tickets;
