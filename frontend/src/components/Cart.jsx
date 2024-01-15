//TODO: prezzo volo
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  Typography
} from "@mui/material";
import PropTypes from "prop-types";

const Cart = (props) => {
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let totalPrice = 0;
    totalPrice += props.priceDeparture;
    if (props.selectedReturningFlight) {
      totalPrice += props.priceReturning;
    }
    if (props.selectedSeatsReturning) {
      props.selectedSeatsReturning.forEach((selectedFlight) => {
        selectedFlight.forEach((seat) => {
          if (seat.seatPrice) {
            totalPrice += seat.seatPrice;
          }
        });
      });
    } else if (props.selectedSeatsDeparture) {
      props.selectedSeatsDeparture.forEach((selectedFlight) => {
        selectedFlight.forEach((seat) => {
          if (seat.seatPrice) {
            totalPrice += seat.seatPrice;
          }
        });
      });
    }
    if (props.arrayPassengerInfos) {
      props.arrayPassengerInfos.forEach((passenger, index) => {
        if (passenger[`hold-luggage-${index}`]) {
          totalPrice += (parseInt(passenger[`hold-luggage-${index}`])*65);
        }
      });
    }
    if (props.selectedSeats) {
      props.selectedSeats.forEach((selectedFlight) => {
        if (selectedFlight.seatPrice) {
          totalPrice += selectedFlight.seatPrice;
        }
      });
    }
    setTotalCartPrice(totalPrice);
    setLoading(false);
  }, [props]);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "15vh",
        }}
      >
        <CircularProgress
          sx={{
            margin: "auto",
          }}
        />
      </Box>
    );
  }

  Cart.propTypes = {
    //Gestire ritorno
    formData: PropTypes.object,
    selectedDepartureFlight: PropTypes.array,
    selectedReturningFlight: PropTypes.array,
    selectedSeatsDeparture: PropTypes.array,
    selectedSeatsReturning: PropTypes.array,
    priceDeparture: PropTypes.number,
    priceReturning: PropTypes.number,
    arrayPassengerInfos: PropTypes.array,
    selectedSeats: PropTypes.array
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "white",
        width: "100%",
        mt: 2,
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <Grid container sx={{ p: 1 }}>
        <Grid item xs={7} md={10}>
          <Typography variant="h3" fontWeight={"bold"}>
            Cart: € {totalCartPrice}
          </Typography>
        </Grid>
        <Grid item xs={5} md={2} sx={{ margin: "auto" }}>
          <Button
            onClick={handleClick}
            fullWidth
            variant="contained"
            color="primary"
          >
            {expanded ? "Hide" : "Show more"}
          </Button>
        </Grid>
      </Grid>
      <Collapse direction="vertical" in={expanded}>
        <Grid
          container
          justifyContent={"space-between"}
          spacing={2}
          columns={{ xs: 1, md: 13.2 }}
          sx={{ pl: "20px !important", pr: "5px !important", pt: 1, mt: "0px" }}
        >
          <Grid
            item
            xs={1}
            md={4}
            sx={{
              border: "1px solid white",
              borderRadius: "1rem",
              pt: "5px !important",
              mb: "5px !important",
              pb: "5px !important"
            }}
          >
            <Typography textAlign={"center"} fontWeight={"bold"}>
              Departure itinerary info
            </Typography>
            <Grid
              container
              justifyContent={"space-between"}
              columns={{ xs: 2 }}
            >
              <Grid item xs={1}>
                <Typography>From: {props.selectedDepartureFlight[0].departureAirport.name}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>To: {props.selectedDepartureFlight[props.selectedDepartureFlight.length-1].arrivalAirport.name}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>Departure: {new Date(props.selectedDepartureFlight[0].departure).toLocaleString("en-GB")}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>Arrival: {new Date(props.selectedDepartureFlight[props.selectedDepartureFlight.length-1].arrival).toLocaleString("en-GB")}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>
                  {props.selectedDepartureFlight.length === 1 ? `Flight chosen: ` : `Flights chosen: `}
                  {props.selectedDepartureFlight.map((flight, index) => {
                      if (index !== props.selectedDepartureFlight.length-1) {
                        return flight.flight_number + ", "
                      } else {
                        return flight.flight_number
                      }
                  })}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>Price: {props.priceDeparture} €</Typography>
              </Grid>
            </Grid>
          </Grid>
          {props.selectedReturningFlight && (
            <Grid
              item
              xs={1}
              md={4}
              sx={{
                border: "1px solid white",
                borderRadius: "1rem",
                pt: "5px !important",
                mb: "5px !important",
                pb: "5px !important"
              }}
            >
              <Typography textAlign={"center"} fontWeight={"bold"}>
                Returning itinerary info
              </Typography>
              <Grid
                container
                justifyContent={"space-between"}
                columns={{ xs: 2 }}
              >
                <Grid item xs={1}>
                  <Typography>From: {props.selectedReturningFlight[0].departureAirport.name}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>To: {props.selectedReturningFlight[props.selectedReturningFlight.length-1].arrivalAirport.name}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>Departure: {new Date(props.selectedReturningFlight[0].departure).toLocaleString("en-GB")}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>Arrival: {new Date(props.selectedReturningFlight[props.selectedReturningFlight.length-1].arrival).toLocaleString("en-GB")}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>
                    {props.selectedReturningFlight.length === 1 ? `Flight chosen: ` : `Flights chosen: `}
                    {props.selectedReturningFlight.map((flight, index) => {
                        if (index !== props.selectedReturningFlight.length-1) {
                          return flight.flight_number + ", "
                        } else {
                          return flight.flight_number
                        }
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>Price: {props.priceReturning} €</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid
            item
            xs={1}
            md={4}
            sx={{
              border: "1px solid white",
              borderRadius: "1rem",
              pt: "5px !important",
              mb: "5px !important",
              pb: "5px !important"
            }}
          >
            <Typography textAlign={"center"} fontWeight={"bold"}>
              Passenger info
            </Typography>
            <Typography>
              • {props.formData.adults} x{" "}
              {props.formData.adults > 1 ? "adults" : "adult"}
            </Typography>
            {(props.formData.children || props.formData.children > 0) && (
              <Typography>
                • {props.formData.children} x{" "}
                {props.formData.children > 1 ? "children" : "child"}
              </Typography>
            )}
          </Grid>
          {props.selectedSeatsDeparture && (
            <Grid
              item
              xs={1}
              md={4}
              sx={{
                border: "1px solid white",
                borderRadius: "1rem",
                pt: "5px !important",
                mb: "5px !important",
                pb: "5px !important"
              }}
            >
              <Typography textAlign={"center"} fontWeight={"bold"}>
                Seats departure info
              </Typography>
              {
                props.selectedSeatsDeparture.map((selectedFlight, selectedIndex) => (
                  <React.Fragment key={`flightSeats-`+selectedIndex}>
                    <Typography>
                      {props.selectedDepartureFlight[selectedIndex].flight_number && (
                        "• " + props.selectedDepartureFlight[selectedIndex].flight_number + ": "
                      )}
                    </Typography>
                    {selectedFlight.map((seat,index) => {
                      return (seat.seatNumber &&
                        <Typography key={`seat-${index}`}>
                          {"€ " + seat.seatPrice + " - Seat "  + seat.seatNumber + " - " + seat.seatName.charAt(0).toUpperCase() + seat.seatName.slice(1,5) + " " + seat.seatName.split("-")[1]}
                        </Typography>
                      )
                    })}
                  </React.Fragment>
                ))
              }
            </Grid>
          )}
          {props.selectedSeatsReturning && (
            <Grid
              item
              xs={1}
              md={4}
              sx={{
                border: "1px solid white",
                borderRadius: "1rem",
                pt: "5px !important",
                mb: "5px !important",
                pb: "5px !important"
              }}
            >
              <Typography textAlign={"center"} fontWeight={"bold"}>
                Seats returning info
              </Typography>
              {
                props.selectedSeatsReturning.map((selectedFlight, selectedIndex) => (
                  <React.Fragment key={`flightSeats-`+selectedIndex}>
                    <Typography>
                      {props.selectedReturningFlight[selectedIndex].flight_number ? (
                        "• " + props.selectedReturningFlight[selectedIndex].flight_number + ": "
                      ) : (
                        "none"
                      )}
                    </Typography>
                    {selectedFlight.map((seat,index) => {
                      return (seat.seatNumber &&
                        <Typography key={`seat-${index}`}>
                          {"€ " + seat.seatPrice + " - Seat "  + seat.seatNumber + " - " + seat.seatName.charAt(0).toUpperCase() + seat.seatName.slice(1,5) + " " + seat.seatName.split("-")[1]}
                        </Typography>
                      )
                    })}
                  </React.Fragment>
                ))
              }
            </Grid>
          )}
        </Grid>
      </Collapse>
    </Box>
  );
};

export default Cart;
