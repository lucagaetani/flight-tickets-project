import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CircularProgress,
  Box
} from "@mui/material";

const Loading = () => {
  const { state } = useLocation();

  useEffect(() => {
    console.log(state);
    /*
    flightState:
    {
      "selectedDepartureFlight": [
          "U2 4833"
      ],
      "formData": {
          "airportFrom": "VCE",
          "airportTo": "ORY",
          "departingDate": "2023-11-30",
          "returningDate": "",
          "oneWay": true,
          "adults": "2",
          "children": "1",
          "infants": 0
      },
      "arrayPassengerInfos": [
          {
              "name-0": "aaaaa",
              "surname-0": "aaaa",
              "email-0": "poi@doi.com",
              "phone-0": "23902389430",
              "airplane-luggage-0": "0",
              "hold-luggage-0": "",
              "seat-number-0": "A2",
              "seat-price-0": 100
          },
          {
              "name-1": "Doi",
              "surname-1": "Moi",
              "email-1": "sdklfjs@gmail.com",
              "phone-1": "29138023",
              "airplane-luggage-1": "1",
              "hold-luggage-1": "1",
              "seat-number-1": "A1",
              "seat-price-1": 120
          },
          {
              "name-2": "idjidj",
              "surname-2": "sdljsdkl",
              "email-2": "lol@mail.com",
              "phone-2": "293122310",
              "airplane-luggage-2": "1",
              "hold-luggage-2": "",
              "seat-number-2": "B2",
              "seat-price-2": 100
          }
      ]
    }
  */
    (async () => {
      /*
      //Check if seats are empty to book it
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      };
      const url = `http://localhost:3000/seats/getSeats?state=${encodeURIComponent(
          JSON.stringify(seats)
      )}`;
      const response = await fetch();
      */
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