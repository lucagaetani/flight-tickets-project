const { Sequelize } = require('sequelize');
require('dotenv').config();

//Connection to the database
const instanceSequelize = new Sequelize(process.env.POSTGRESQL_ADDON_DB, process.env.POSTGRESQL_ADDON_USER, process.env.POSTGRESQL_ADDON_PASSWORD, {
    host: process.env.POSTGRESQL_ADDON_HOST,
    port: process.env.POSTGRESQL_ADDON_PORT,
    dialect: 'postgres'
});

module.exports = instanceSequelize;