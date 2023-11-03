import { useState, useEffect } from "react";
import Seat from "./Seat";

const SeatPicker = ({ onSelect }) => {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          "http://localhost:3000/seats/getSeats",
          requestOptions
        );
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };

    fetchSeats();
  }, []);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    // Toggle seat selection
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seat)) {
        return prevSelectedSeats.filter(
          (selectedSeat) => selectedSeat !== seat
        );
      } else {
        return [...prevSelectedSeats, seat];
      }
    });

    // Notify parent component of seat selection
    onSelect(seat);
  };

  return (
    <div>
      <h2>Seat Picker</h2>
      <div>
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((seat, seatIndex) => (
              <Seat
                key={seatIndex}
                seat={seat}
                selected={selectedSeats.includes(seat)}
                onClick={() => handleSeatClick(seat)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatPicker;