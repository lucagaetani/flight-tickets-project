import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box
} from "@mui/material";
import CustomizedProgressBars from "../MUIComponents/CustomizedProgressBars";

const Loading = () => {
  const { state } = useLocation();
  const [title, setTitle] = useState("Request issued");
  const [value, setValue] = useState(0);
  const navigateTo = useNavigate();
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    console.log(state);
    (async () => {
      //Check if seats are empty to book it
      try {
        console.log(userData);
        const sendData = {
        };
        //Assign to every seat his flight
        const seatsFlightsDeparture = state.flightState.selectedSeatsDeparture.map((selectedSeats) => {
          return selectedSeats.map((seat, index) => {
            seat.flightNumber = state.flightState.selectedDepartureFlight[index].flight_number;
            seat.passengerInfo = state.flightState.arrayPassengerInfo[0];
            return seat;
          })
        });
        /*Prepare data to send, it will send:
            - seatsFlightsDeparture: seats chosen for each flight departure
            - arrayPassengerInfo: passenger info for each flight departure
            - userEmail: email of the user logged into the app
          Optionally, if the user has chosen returning flights:
            - seatsFlightsReturning: seats chosen for each flight returning
        */
        sendData.flightState = {
          seatsFlightsDeparture: seatsFlightsDeparture,
          userEmail: userData.email
        }
        if (state.flightState?.selectedReturningFlight) {
          const seatsFlightsReturning = state.flightState.selectedSeatsReturning.map((selectedSeats) => {
            return selectedSeats.map((seat, index) => {
              seat.flightNumber = state.flightState.selectedReturningFlight[index].flight_number;
              seat.passengerInfo = state.flightState.arrayPassengerInfo[0];
              return seat;
            })
          });
          sendData.flightState.seatsFlightsReturning = seatsFlightsReturning;
        }
        setTitle("Launched request. Waiting for answer");
        setValue(40);
        //Delete state
        delete state.flightState;
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          body: JSON.stringify(sendData)
        };
        const url = `http://localhost:3000/bookings/insertBookings`;
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        if (res.success) {
          setValue(100);
          setTitle("Loading complete");
          navigateTo("/end", { state: { res } });
        } else {
          setValue(100);
          setTitle("Loading complete");
          navigateTo("/end", { state: { res } });
        }
      } catch (error) {
        const res = {
          success: false,
          message: error
        }
        //navigateTo("/end", { state: { res } });
      }
    })();
  }, [state])

  return (
    <Box sx={{
      display: "flex",
      height: "80vh",
      pl: 3,
      pr: 3
    }}>
        <CustomizedProgressBars titleLoading={title} valueProgress={value} />
    </Box>
  );
}

export default Loading;