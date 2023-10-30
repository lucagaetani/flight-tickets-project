const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Airports = require("./airports");
const Airlines = require("./airlines");

const Flights = instanceSequelize.define(('Flights'), {
    flight_number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fk_IATA_from: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    fk_IATA_to: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    departure: {
        type: DataTypes.DATE,
        allowNull: false
    },
    arrival: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fk_airline: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_stopover: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Flights.belongsTo(Airports, {
    foreignKey: 'fk_IATA_from'
});

Flights.belongsTo(Airports, {
    foreignKey: 'fk_IATA_to'
});

Flights.belongsTo(Airlines, {
    foreignKey: 'fk_airline'
});

Flights.belongsTo(Flights, {
    foreignKey: 'fk_stopover'
});


async function insertFlights() {
    await Flights.create({
            flight_number: "U2 4833",
            fk_IATA_from: "VCE",
            fk_IATA_to: "ORY",
            departure: "2023-12-25 12:00:00",
            arrival: "2023-12-25 14:30:00",
            price: "76.0",
            fk_airline: 1,
            fk_stopover: null
    });

    await Flights.create({
        flight_number: "BA 222",
        fk_IATA_from: "BNA",
        fk_IATA_to: "LHR",
        departure: "2023-11-30 19:45:00",
        arrival: "2023-11-31 08:45:00",
        price: "120.0",
        fk_airline: 2,
        fk_stopover: null
    });

}

//Flights.sync({force: true});
insertFlights();

module.exports = Flights;