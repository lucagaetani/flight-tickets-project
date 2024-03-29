const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");

const Airlines = instanceSequelize.define(
  "Airlines",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
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

async function insertAirlines() {
  await Airlines.create({
    name: "easyJet",
  });

  await Airlines.create({
    name: "British Airlines",
  });

  await Airlines.create({
    name: "Air France",
  });

  await Airlines.create({
    name: "Lufthansa",
  });
}

//If uncommented, it inserts data into the database
/*
(async () => {
    await Airlines.sync({ force: true });
    insertAirlines();
})();
*/

module.exports = Airlines;
