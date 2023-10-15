const { Sequelize, DataTypes } = require("sequelize");

const Airports = Sequelize.define(('Airports'), {
    IATA_code: {
        type: DataTypes.STRING(3),
        primaryKey: true
    },
    name: DataTypes.STRING
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Airports;