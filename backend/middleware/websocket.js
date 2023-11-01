const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // Validate and process the message
      if (data.action === 'bookSeat') {
        await bookSeat(data.seatNumber, data.flightNumber, ws);
      }
    } catch (error) {
      console.error('Invalid message format:', error.message);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    // Implement any necessary cleanup or logging
  });
});

async function bookSeat(seatNumber, flightNumber, ws) {
  const t = await sequelize.transaction();

  try {
    const seat = await Seat.findByPk({ seatNumber, flightNumber }, { transaction: t });

    if (!seat || seat.isBooked) {
      ws.send(JSON.stringify({ action: 'seatAlreadyBooked', seatNumber, flightNumber }));
    } else {
      // Update the seat as booked within the transaction
      await seat.update({ isBooked: true }, { transaction: t });
      await t.commit();
      ws.send(JSON.stringify({ action: 'seatBooked', seatNumber, flightNumber }));
    }
  } catch (error) {
    await t.rollback(); // Rollback the transaction on error
    console.error('Error booking seat:', error.message);
    ws.send(JSON.stringify({ error: 'Error booking seat' }));
  }
}

module.exports = wss;
