import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Grid, Typography, Paper, Box } from "@mui/material";
import ButtonDisabled from "./ButtonDisabled";
import AirlineLogo from "./AirlineLogo";

const FlightsList = () => {
  const [rowsDeparture, setRowsDeparture] = useState([]);
  const [rowsReturning, setRowsReturning] = useState([]);
  const [selectedRowIdsDeparture, setSelectedRowIdsDeparture] = useState([]);
  const [selectedRowIdsReturning, setSelectedRowIdsReturning] = useState([]);
  const { state } = useLocation();
  const navigateTo = useNavigate();

  useEffect(() => {
    console.log(rowsDeparture);
  }, [rowsDeparture]);

  useEffect(() => {
    console.log(rowsReturning);
  }, [rowsReturning]);

  useEffect(() => {
    console.log(state);
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      try {
        const url = `http://localhost:3000/flights/getFlights?state=${encodeURIComponent(
          JSON.stringify(state)
        )}`;
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.success === true) {
          let arrayToInsert = [];
          //Departure
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
          setRowsDeparture(arrayToInsert);
          //Returning
          if (data.data[1]) {
            arrayToInsert = [];
            data.data[1].forEach((row) => {
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
            setRowsReturning(arrayToInsert);
          }
        } else {
          {
            console.log(`Error: ${data.message}${data.error ? ". " + data.error : ""}`);
          }
        }
      } catch (error) {
        {
          alert(`Error fetching data: ${error}`);
        }
      }
    })();
  }, [navigateTo, state]);


  const handleSelection = () => {
    
  }

  const handleBack = () => {
    navigateTo("/");
  };

  return (
    <Container minwidth="lg" minheight={300} sx={{ mt: 3, width: "100%" }}>
      <Typography sx={{ mt: 3, mb: 1 }} variant="h5" fontWeight={"bold"}>
        {state.formData.oneWay ? (
          `Choose departure flight`
        ) : (
          `Choose departure and returning flights`
        )}
      </Typography>

      <Grid container spacing={3} columns={{ xs: 1, md: 2}}>
      {state.formData.oneWay ? (
        <Grid item xs={1} md={2} sx={{
          p: 1
        }}>
          <Typography variant="h5" sx={{mt: 1}}>
            Departure flights from {state.formData.airportFrom} to {state.formData.airportTo}
          </Typography>
          {rowsDeparture.map((flight, index) => (
            <Paper
              elevation={3}
              sx={{
                backgroundColor: selectedRowIdsDeparture ? "grey" : "white",
                p: 2,
                ml: 2,
                mr: 2,
                mt: 2,
                transition: "0.5s linear",
                cursor: "pointer"
              }}
              onClick={() => setSelectedRowIdsDeparture(rowsDeparture[index])}
              key={`Departure-`+ index}
            >
              <Grid container columns={3}>
                <Grid item xs={1}>
                  <Typography fontWeight={"bold"}>
                    {flight.flight_number}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={1}>
                  <AirlineLogo airline={flight.airline}/>
                </Grid>
                <Grid item xs={1}>
                  <Typography >
                    Departure: {flight.departure}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography >
                    Arrival: {flight.arrival}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography >
                    Price: {flight.price}
                  </Typography>
                </Grid>
              </Grid> 
            </Paper>
          ))}
        </Grid>
      ) : (
        <>
        <Grid item xs={1} md={1}>
          <Typography variant="h5" sx={{mt: 1}}>
            Departure flight from {state.formData.airportFrom} to {state.formData.airportTo}
          </Typography>
          {rowsDeparture.map((flight, index) => (
            <Paper
              elevation={3}
              sx={{
                backgroundColor: selectedRowIdsDeparture ? "grey" : "white",
                p: 2,
                ml: 2,
                mr: 2,
                mt: 2,
                transition: "0.5s linear",
                cursor: "pointer"
              }}
              onClick={() => setSelectedRowIdsDeparture(rowsDeparture[index])}
              key={`Departure-`+ index}
            >
              <Grid container columns={3}>
                <Grid item xs={1}>
                  <Typography fontWeight={"bold"}>
                    {flight.flight_number}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={1}>
                  <AirlineLogo airline={flight.airline}/>
                </Grid>
                <Grid item xs={1}>
                  <Typography>
                    Departure: {flight.departure}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>
                    Arrival: {flight.arrival}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>
                    Price: {flight.price}
                  </Typography>
                </Grid>
              </Grid> 
            </Paper>
          ))}
        </Grid>
        <Grid item xs={1} md={1}>
          <Typography variant="h5" sx={{mt: 1}}>
            Returning flights from {state.formData.airportTo} to {state.formData.airportFrom}
          </Typography>
          {rowsReturning.map((flight, index) => (
            <Paper
              elevation={3}
              sx={{
                backgroundColor: selectedRowIdsReturning ? "grey" : "white",
                p: 2,
                ml: 2,
                mr: 2,
                mt: 2,
                transition: "0.5s linear",
                cursor: "pointer"
              }}
              onClick={() => setSelectedRowIdsReturning(rowsReturning[index])}
              key={`Returning-`+ index}
            >
              <Grid container columns={3}>
                <Grid item xs={1}>
                  <Typography fontWeight={"bold"}>
                    {flight.flight_number}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={1}>
                  <AirlineLogo airline={flight.airline}/>
                </Grid>
                <Grid item xs={1}>
                  <Typography >
                    Departure: {flight.departure}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography >
                    Arrival: {flight.arrival}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography >
                    Price: {flight.price}
                  </Typography>
                </Grid>
              </Grid> 
            </Paper>
          ))}
        </Grid>
        </>
      )}
      </Grid>

      <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 6, sm: 8, md: 12 }}
            sx={{ mt: 3, mb: 3 }}
            display={"flex"}
            justifyContent={"center"}
          >
            <Grid item xs={2}>
              <Button
                onClick={handleBack}
                sx={{ mt: 3, mr: 1 }}
                fullWidth
                variant="contained"
                color="primary"
              >
                Back
              </Button>
            </Grid>
            <ButtonDisabled />
          </Grid>
    </Container>
  );
};

export default FlightsList;
