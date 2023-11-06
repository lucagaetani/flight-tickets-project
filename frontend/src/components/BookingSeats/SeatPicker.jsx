import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, Button, Container } from '@mui/material';

const SeatPicker = () => {
  const [seats, setSeats] = useState([]);
  const { state } = useLocation();
  const navigateTo = useNavigate();


  useEffect(() => {
    (async () => {
      try{
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }
        let seats;
        if (state.seatsDeparture){
          seats = state.flightState.selectedReturningFlight[0];
        } else {
          seats = state.flightState.selectedDepartureFlight[0];
        }
        const url = `http://localhost:3000/seats/getSeats?state=${encodeURIComponent(
            JSON.stringify(seats)
        )}`;
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.success) {
          setSeatsDeparture
        } else {
          console.log(data.error);
        }
      } catch(error){
        console.log(error);
      }
    })();
  }, []);

  //todo seats.map --> genera i posti
  return (
    <Container>
      
    </Container>
  );
};

export default SeatPicker;
