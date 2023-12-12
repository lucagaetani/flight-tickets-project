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
  const [priceDeparture, setPriceDeparture] = useState(0);
  const [priceReturning, setPriceReturning] = useState(0);
  const [yesReturning, setYesReturning] = useState(true);
  const { state } = useLocation();
  const navigateTo = useNavigate();

  useEffect(() => {
    console.log(state);
    setYesReturning(!state.formData.oneWay);
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

  const handleBack = () => {
    navigateTo("/");
  };

  return (
    <Container minwidth="lg" sx={{ mt: 3, width: "100%" }}>
      <Typography sx={{ mt: 3, mb: 1 }} variant="h5" fontWeight={"bold"}>
        {state.formData.oneWay
          ? `1. Choose departure flight`
          : `1. Choose departure and returning flights`}
      </Typography>

      <Grid container spacing={3} columns={{ xs: 1, md: 2 }}>
        {state.formData.oneWay ? (
          <Grid
            item
            xs={1}
            md={2}
          >
            <Typography
              variant="h5"
              sx={{ p: 2 }}
            >
              Departure flights from {state.formData.airportFrom} to{" "}
              {state.formData.airportTo}
            </Typography>
            <Box
              sx={{
                overflow: "auto",
                height: "450px",
              }}
            >
              {rowsDeparture.map((flight, index) => (
                <Paper
                  elevation={selectedRowIdsDeparture[0] === flight.flight_number ? 3 : 1}
                  sx={{
                    backgroundColor: selectedRowIdsDeparture[0] === flight.flight_number ? "#D4D4D4" : "white",
                    p: 2,
                    ml: 2,
                    mr: 2,
                    mt: 2,
                    transition: "0.5s linear",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedRowIdsDeparture([
                      flight.flight_number,
                    ]);
                    setPriceDeparture(parseInt(flight.price));
                  }}
                  key={`Departure-` + index}
                >
                  <Grid container columns={3}>
                    <Grid item xs={1}>
                      <Typography fontWeight={"bold"}>
                        {flight.flight_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>
                      <Box sx={{ height: "43px", width: "246px" }}>
                        <AirlineLogo airline={flight.airline} />
                      </Box>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography>Departure: {flight.departure}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography>Arrival: {flight.arrival}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography>Price: {flight.price}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          </Grid>
        ) : (
          <>
            <Grid
              item
              xs={1}
              md={1}
            >
              <Typography
                variant="h5"
                sx={{ p: 2 }}
              >
                Departure flight from {state.formData.airportFrom} to{" "}
                {state.formData.airportTo}
              </Typography>
              <Box sx={{ overflow: "auto", height: "500px", pb: 0.5 }}>
                {rowsDeparture.map((flight, index) => (
                  <Paper
                    elevation={selectedRowIdsDeparture[0] === flight.flight_number ? 3 : 1}
                    sx={{
                      backgroundColor: selectedRowIdsDeparture[0] === flight.flight_number
                        ? "#D4D4D4"
                        : "white",
                      p: 2,
                      ml: 2,
                      mr: 2,
                      mt: 2,
                      transition: "0.5s linear",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRowIdsDeparture([
                        flight.flight_number,
                      ]);
                      setPriceDeparture(parseInt(flight.price));
                    }}
                    key={`Departure-` + index}
                  >
                    <Grid container columns={3}>
                      <Grid item xs={1}>
                        <Typography fontWeight={"bold"}>
                          {flight.flight_number}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={1}>
                        <AirlineLogo airline={flight.airline} />
                      </Grid>
                      <Grid item xs={1}>
                        <Typography>Departure: {flight.departure}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography>Arrival: {flight.arrival}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography>Price: {flight.price}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            </Grid>
            <Grid
              item
              xs={1}
              md={1}
            >
              <Typography
                variant="h5"
                sx={{ p: 2 }}
              >
                Returning flights from {state.formData.airportTo} to{" "}
                {state.formData.airportFrom}
              </Typography>
              <Box sx={{ overflow: "auto", height: "450px", pb: 0.5 }}>
                {rowsReturning.map((flight, index) => (
                  <Paper
                    elevation={selectedRowIdsReturning[0] === flight.flight_number ? 3 : 1}
                    sx={{
                      backgroundColor: selectedRowIdsReturning[0] === flight.flight_number
                        ? "#D4D4D4"
                        : "white",
                      p: 2,
                      ml: 2,
                      mr: 2,
                      mt: 2,
                      transition: "0.5s linear",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRowIdsReturning([
                        flight.flight_number,
                      ]);
                      setPriceReturning(parseInt(flight.price));
                    }}
                    key={`Returning-` + index}
                  >
                    <Grid container columns={3}>
                      <Grid item xs={1}>
                        <Typography fontWeight={"bold"}>
                          {flight.flight_number}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={1}>
                        <AirlineLogo airline={flight.airline} />
                      </Grid>
                      <Grid item xs={1}>
                        <Typography>Departure: {flight.departure}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography>Arrival: {flight.arrival}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography>Price: {flight.price}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
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
        {yesReturning ? (
          <ButtonDisabled
            isDisabled={selectedRowIdsDeparture.length === 0}
            formData={state.formData}
            selectedDepartureFlight={selectedRowIdsDeparture}
            selectedReturningFlight={selectedRowIdsReturning}
            priceDeparture={priceDeparture}
            priceReturning={priceReturning}
            isDisabledReturning={selectedRowIdsReturning.length === 0}
          />
        ) : (
          <ButtonDisabled
            isDisabled={selectedRowIdsDeparture.length === 0}
            formData={state.formData}
            priceDeparture={priceDeparture}
            selectedDepartureFlight={selectedRowIdsDeparture}
          />
        )}
      </Grid>
    </Container>
  );
};

export default FlightsList;
