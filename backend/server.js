require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth.js");
const instanceSequelize = require("./database");
//To generate the JWT_SECRET: node require("crypto").randomBytes(35).toString("hex")

//APP
/**
 * It creates the server by using Express
 */
const app = express();
app.use(express.json());

//CORS
/**
 * Cross-origin resource sharing (CORS) prevents the access to external domains to the API. Only http://localhost:5173 can send HTTP request
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

//COOKIE VERIFICATION
/**
 * cookieParser helps to manage cookies
 */
app.use(cookieParser());

//TOKEN VERIFICATION
app.get("/auth", auth.verifyCookie);

//ROUTERS
/**
 * It imports the routers for airports, users, flights, seats, bookings, itineraries and tickets
 * E.g. if i want to access to the airports API, i have to write an HTTP request with /airports/<function>
 */
const routerAirports = require("./routes/airports");
const routerUsers = require("./routes/users");
const routerFlights = require("./routes/flights");
const routerSeats = require("./routes/seats");
const routerBookings = require("./routes/bookings");
const routerItineraries = require("./routes/itineraries");
const routerTickets = require("./routes/tickets");

app.use("/airports", routerAirports);
app.use("/users", routerUsers);
app.use("/flights", routerFlights);
app.use("/seats", routerSeats);
app.use("/bookings", routerBookings);
app.use("/itineraries", routerItineraries);
app.use("/tickets", routerTickets);

//DATABASE
/**
 * Writes into console if i'm connected or not to the DB
 */
instanceSequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

//INITIALIZE TABLES/DATA
/**
 * Initialize the tables if they don't exist into database
 */
require("./models/airlines");
require("./models/airports");
require("./models/flights");
require("./models/itineraries");
require("./models/seats");
require("./models/itineraries_flights");
require("./models/tickets");

app.get("/", function (req, res) {
  res.send(req.headers, req.originalUrl, req.method, req.body);
});

//LISTENER OF SERVER
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening on port " + listener.address().port);
});