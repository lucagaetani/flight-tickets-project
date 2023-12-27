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

  //It's purpose is to remove the "-0", "-1", "-2" etc. on the key names, to make a more cleaned json to send
  const removeNumberedSuffixes = (obj) => {
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = key.replace(/-\d+$/, '');
        result[newKey] = obj[key];
      }
    }
    return result;
  }

  useEffect(() => {
    console.log(state);
    (async () => {
      //Check if seats are empty to book it
      try {
        const sendData = {
        };
        //Assign to every seat his flight
        const seatsFlightsDeparture = state.flightState.selectedSeatsDeparture.map((selectedSeats, selectedIndex) => {
          return selectedSeats.map((seat, index) => {
            seat.flightNumber = state.flightState.selectedDepartureFlight[selectedIndex].flight_number;
            seat.itineraryId = state.flightState.selectedDepartureItinerary.id;
            seat.arrayPassengerInfo = removeNumberedSuffixes(state.flightState.arrayPassengerInfo[index]);
            return seat;
          })
        });

        
        /*
          Prepare data to send, it will send:
            - seatsFlightsDeparture: seats chosen for each flight departure, flights chosen, itinerary id and info of the passenger
            - userEmail: email of the user logged into the app
          Optionally, if the user has chosen returning flights:
            - seatsFlightsReturning: seats chosen for each flight returning and flights chosen, flights chosen and itinerary id
        */
        sendData.flightState = {
          seatsFlightsDeparture: seatsFlightsDeparture,
          userEmail: userData.email
        }
        if (state.flightState?.selectedReturningFlight) {
          const seatsFlightsReturning = state.flightState.selectedSeatsReturning.map((selectedSeats, selectedIndex) => {
            return selectedSeats.map((seat, index) => {
              seat.flightNumber = state.flightState.selectedReturningFlight[selectedIndex].flight_number;
              seat.itineraryId = state.flightState.selectedReturningItinerary.id;
              seat.arrayPassengerInfo = removeNumberedSuffixes(state.flightState.arrayPassengerInfo[index]);
              return seat;
            })
          });
          sendData.flightState.seatsFlightsReturning = seatsFlightsReturning;
        }

        //Update the progress bar
        setTitle("Launched request. Waiting for answer");
        setValue(40);

        //Delete current state
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
        navigateTo("/end", { state: { res } });
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