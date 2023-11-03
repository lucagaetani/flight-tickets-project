const WebSocket = require("ws");
const seatsController = require("../controllers/seats");

const wss = new WebSocket.Server({
  noServer: true,
});

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "bookSeats") {
        const result = await seatsController.bookSeats(data.payload);
        ws.send(JSON.stringify({ type: "bookSeatsResult", payload: result }));
      }
      // Add more logic for other message types if needed
    } catch (error) {
      console.error(`WebSocket message handling error: ${error.message}`);
      // Handle errors as needed
    }
  });
});

module.exports = wss;
