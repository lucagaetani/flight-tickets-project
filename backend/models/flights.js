const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Airports = require("./airports");
const Airlines = require("./airlines");

const Flights = instanceSequelize.define(('Flights'), {
    flight_number: {
        type: DataTypes.STRING,
        primaryKey: true
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
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Flights.belongsTo(Airports, {
    foreignKey: 'fk_IATA_from',
    as: "departureAirport"
});

Flights.belongsTo(Airports, {
    foreignKey: 'fk_IATA_to',
    as: "arrivalAirport"
});

Flights.belongsTo(Airlines, {
    foreignKey: 'fk_airline',
    as: "airline"
});

Flights.belongsTo(Flights, {
    foreignKey: 'fk_stopover'
});


async function insertFlights() {
    await Flights.bulkCreate([{
            flight_number: "U2 4833",
            fk_IATA_from: "VCE",
            fk_IATA_to: "ORY",
            departure: "2024-02-20 12:00:00.000 +00:00",
            arrival: "2024-02-20 14:30:00.000 +00:00",
            price: "76.0",
            fk_airline: 1,
            fk_stopover: null
        },
        {
            flight_number: "U2 4826",
            fk_IATA_from: "VCE",
            fk_IATA_to: "ORY",
            departure: "2024-02-20 15:00:00.000 +00:00",
            arrival: "2024-02-20 17:30:00.000 +00:00",
            price: "76.0",
            fk_airline: 1,
            fk_stopover: null
        },
        {
            flight_number: "U2 4009",
            fk_IATA_from: "VCE",
            fk_IATA_to: "ORY",
            departure: "2024-02-21 12:00:00.000 +00:00",
            arrival: "2024-02-21 14:30:00.000 +00:00",
            price: "76.0",
            fk_airline: 1,
            fk_stopover: null
        },
        {
            flight_number: "BA 222",
            fk_IATA_from: "BNA",
            fk_IATA_to: "LHR",
            departure: "2023-11-30 19:45:00.000 +00:00",
            arrival: "2023-11-31 08:45:00.000 +00:00",
            price: "120.0",
            fk_airline: 2,
            fk_stopover: null
        }
    ]);
}

/*
(async () => {
    await Flights.sync({ force: true });
    insertFlights();
})();
*/

module.exports = Flights;