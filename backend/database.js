const { Sequelize } = require('sequelize');
require('dotenv').config();

//Connection to the database
const instanceSequelize = new Sequelize(process.env.MYSQL_ADDON_DB, process.env.MYSQL_ADDON_USER, process.env.MYSQL_ADDON_PASSWORD, {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT,
    dialect: 'mysql'
});

module.exports = instanceSequelize;