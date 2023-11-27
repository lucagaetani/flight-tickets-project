const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Bookings = require("./bookings");
const Seats = require("./seats");

const Tickets = instanceSequelize.define(
	"Tickets",
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true
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
			type: DataTypes.DATE,
			allowNull: false
		},
		phone: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		airplaneLuggage: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		holdLuggage: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		fk_seat_number: {
			type: DataTypes.STRING,
			allowNull: false
		},
		fk_seat_price: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		fk_booking: {
			type: DataTypes.UUIDV4,
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

Tickets.belongsTo(Seats, {
	foreignKey: "fk_seat_number"
});

Tickets.belongsTo(Bookings, {
	foreignKey: "fk_seat_price"
});


/*
(async () => {
	await Tickets.sync({ force: true });
})();
*/

module.exports = Tickets;