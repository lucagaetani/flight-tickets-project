require('dotenv').config();
const express = require("express");
const cors = require('cors');
const instanceSequelize = require("./database");

//APP
const app = express();
app.use(express.json());

//CORS
app.use(cors({
    origin: 'http://127.0.0.1',
    optionsSuccessStatus: 200
}));

//ROUTERS
const routerAirports = require("./routes/airports");
const routerUsers = require("./routes/users");
const routerLogin = require("./routes/login");
app.use('/airports', routerAirports);
app.use('/users', routerUsers);
app.use('/login', routerLogin);

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