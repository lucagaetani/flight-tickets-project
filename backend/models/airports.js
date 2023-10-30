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
    country: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

async function insertAirports() {
    await Airports.create({
            IATA_code: "VCE",
            name: "Venice Marco Polo",
            country: "Italy"
    });

    await Airports.create({
            IATA_code: "ORY",
            name: "Paris Orly",
            country: "France"
    });

    await Airports.create({
            IATA_code: "LHR",
            name: "London Heathrow",
            country: "United Kingdom"
    });

    await Airports.create({
            IATA_code: "BNA",
            name: "Nashville International",
            country: "United States of America"
    });
}

/*
(async () => {
    await Airports.sync({ force: true });
    insertAirports();
})();
*/

module.exports = Airports;