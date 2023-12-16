import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Grid, Typography, Paper, Box } from "@mui/material";
import ButtonDisabled from "./ButtonDisabled";
import AirlineLogo from "./AirlineLogo";

const FlightsList = () => {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [price, setPrice] = useState(0);
  const { state } = useLocation();
  const navigateTo = useNavigate();

  useEffect(() => {
    console.log(state);
    const dataToSend = {
      airportFrom: state.selectedDepartureFlight ? state.formData.airportTo : state.formData.airportFrom,
      airportTo: state.selectedDepartureFlight ? state.formData.airportFrom : state.formData.airportTo,
      date: state.selectedDepartureFlight ? state.formData.returningDate : state.formData.departingDate,
    };
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      try {
        const url = `http://localhost:3000/itineraries/getItinerariesForBooking?state=${encodeURIComponent(
          JSON.stringify(dataToSend)
        )}`;
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.success === true) {
          let arrayToInsert = [];
          console.log(data);
          data.data[0].forEach((row) => {
            let newRow = {
              flight_number: row.flight_number,
              airline: row.airline.name,
              fk_IATA_from: row.departureAirport.name,
              fk_IATA_to: row.arrivalAirport.name,
              departure: new Date(row.departure).toLocaleString(),
              arrival: new Date(row.arrival).toLocaleString(),
              price: row.price + " €",
            };
            arrayToInsert.push(newRow);
          });
          setRows(arrayToInsert);
        } else {
          {
            console.log(
              `Error: ${data.message}${data.error ? ". " + data.error : ""}`
            );
          }
        }
      } catch (error) {
        {
          alert(`Error fetching data: ${error}`);
        }
      }
    })();
  }, [navigateTo, state]);

  return (
    <Container minwidth="lg" sx={{ mt: 3, width: "100%" }}>
      <Typography sx={{ mt: 3, mb: 1 }} variant="h5" fontWeight={"bold"}>
        {state.formData.oneWay
          ? `1. Choose departure flight`
          : `1. Choose departure and returning flights`}
      </Typography>
    </Container>
  );
};

export default FlightsList;
