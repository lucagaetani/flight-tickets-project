require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const WebSocket = require("ws");
const wss = require("./middleware/websocket");
const auth = require("./middleware/auth.js");
const instanceSequelize = require("./database");
///node require("crypto").randomBytes(35).toString("hex")

//APP
const app = express();
app.use(express.json());

//CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

//COOKIE VERIFICATION
app.use(cookieParser());

//TOKEN VERIFICATION
app.get("/auth", auth.verifyCookie);

//WEBSERVER
wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", (message) => {
    console.log(`Received message from client: ${message}`);
  });
});

//ROUTERS
const routerAirports = require("./routes/airports");
const routerUsers = require("./routes/users");
const routerFlights = require("./routes/flights");
const routerSeats = require("./routes/seats");
app.use("/airports", routerAirports);
app.use("/users", routerUsers);
app.use("/flights", routerFlights);
app.use("/seats", routerSeats);

//DATABASE
instanceSequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

//INITIALIZE TABLES/DATA
require("./models/airlines");
require("./models/airports");
require("./models/flights");
require("./models/seats");

app.get("/", function (req, res) {
  res.send(req.headers, req.originalUrl, req.method, req.body);
});

//LISTENER
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening on port " + listener.address().port);
});

listener.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
