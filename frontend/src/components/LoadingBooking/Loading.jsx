import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CircularProgress,
  Box
} from "@mui/material";

const Loading = () => {
  const { state } = useLocation();
  const navigateTo = useNavigate();
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    console.log(state);
    (async () => {
      //Check if seats are empty to book it
      try {
        state.userEmail = userData.email; 
        state.flightState.departureSeatsWithFlight = {
          arraySeats: state.flightState.selectedSeatsDeparture,
          flightNumber: state.flightState.selectedDepartureFlight
        }
        delete state.flightState.selectedSeatsDeparture;
        if (state.flightState.selectedReturningFlight) {
          //TODO
        }
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(state)
        };
        const url = `http://localhost:3000/booking/bookSeats`;
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        if (res.success) {
          navigateTo("/end", { state: { res } });
        } else {
          navigateTo("/end", { state: { res } });
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [state])

  return (
    <Box sx={{
      display: "flex",
      height: "80vh"
    }}>
      <CircularProgress sx={{
        margin: "auto"
      }} />
    </Box>
  );
}

export default Loading;