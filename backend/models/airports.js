const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");
const Flights = require("./flights");

const Airports = instanceSequelize.define(('Airports'), {
    IATA_code: {
        type: DataTypes.STRING(3),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Airports.hasMany(Flights, {
    foreignKey: 'fk_IATA_from'
});

Airports.hasMany(Flights, {
    foreignKey: 'fk_IATA_to'
});

Airports.sync({force: true});
module.exports = Airports;