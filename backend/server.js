require('dotenv').config();
const express = require("express");
const cors = require('cors');
const instanceSequelize = require("./database");
const routerAirports = require("./routers/airports");

//APP
const app = express();
app.use(express.json());

//CORS
app.use(cors({
    origin: 'http://127.0.0.1',
    optionsSuccessStatus: 200
}));

//ROUTERS
app.use('/', routerAirports);

//DATABASE
instanceSequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

//LISTENER
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening on port ' + listener.address().port);
});