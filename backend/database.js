const { Sequelize } = require("sequelize");
require("dotenv").config();

//It setups the database with server and connects it to Sequelize (by creating a new instance of it)
const instanceSequelize = new Sequelize(
  process.env.POSTGRESQL_ADDON_DB,
  process.env.POSTGRESQL_ADDON_USER,
  process.env.POSTGRESQL_ADDON_PASSWORD,
  {
    host: process.env.POSTGRESQL_ADDON_HOST,
    port: process.env.POSTGRESQL_ADDON_PORT,
    dialect: "postgres",
  }
);

module.exports = instanceSequelize;
