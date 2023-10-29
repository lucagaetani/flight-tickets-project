const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Airports = require("./airports");

const Flights = instanceSequelize.define(('Flights'), {
    flight_number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    departure: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    arrival: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    airplane: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Flights.sync({force: true});

Flights.belongsTo(Airports, {
        foreignKey: 'fk_IATA_from'
});

Flights.belongsTo(Airports, {
        foreignKey: 'fk_IATA_to'
});

Flights.belongsTo(Flights, {
    foreignKey: 'fk_stopover'
})