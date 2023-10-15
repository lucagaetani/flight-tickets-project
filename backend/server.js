require('dotenv').config();
const { Sequelize } = require('sequelize');
const express = require("express");
const routers = require("./routers/airports");

const app = express();

//Connection to the database
const instanceSequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'mysql'
});
instanceSequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

app.use(express.json());
app.use('/', routers);


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening on port ' + listener.address().port);
});

module.exports = instanceSequelize;