require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth.js');
const instanceSequelize = require("./database");

//APP
const app = express();
app.use(express.json());

//CORS
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}));

//TOKEN VERIFICATION
app.get("/auth", auth.verifyUserToken);

//COOKIE VERIFICATION
app.use(cookieParser());

//ROUTERS
const routerAirports = require("./routes/airports");
const routerUsers = require("./routes/users");
app.use('/airports', routerAirports);
app.use('/users', routerUsers);

//DATABASE
instanceSequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

app.get("/", function (req, res) {
    res.send(req.headers, req.originalUrl, req.method, req.body);
});

//LISTENER
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening on port ' + listener.address().port);
});