const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");

const Airports = instanceSequelize.define(('Airports'), {
    IATA_code: {
        type: DataTypes.STRING(3),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
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

//Airports.sync({force: true});
module.exports = Airports;