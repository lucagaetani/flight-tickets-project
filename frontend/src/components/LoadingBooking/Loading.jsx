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

  /**
   * Removes the numbered suffixes from the keys of an object and returns a new object.
   *
   * @param {Object} obj - The object from which to remove the numbered suffixes.
   * @return {Object} - A new object with the numbered suffixes removed from the keys.
   */
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
        //Assign to every seat his respective flight
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
            - seatsFlightsReturning: seats chosen for each flight returning, flights chosen, itinerary id and info of the passenger
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
        console.log(sendData);

        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(sendData)
        };
        const url = `http://localhost:3000/bookings/insertBookings`;
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        if (res.success) {
          setValue(100);
          setTitle("Loading complete");
          //Brings you to the end page without errors
          navigateTo("/end", { state: { res } });
        } else {
          setValue(100);
          setTitle("Loading complete");
          //Brings you to the end page with errors
          navigateTo("/end", { state: { res } });
        }
      } catch (error) {
        const res = {
          success: false,
          message: error
        }
        //Brings you to the end page with errors
        setValue(100);
        setTitle("Loading complete");
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