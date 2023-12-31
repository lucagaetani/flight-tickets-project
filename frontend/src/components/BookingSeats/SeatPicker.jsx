import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  Tooltip,
  CircularProgress,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog
} from "@mui/material";
import Cart from "../Cart";
import DefaultDialog from "../DefaultDialog";

const SeatPicker = () => {
  const [seats, setSeats] = useState([]);
  const { state } = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({
    seatName: "",
    seatNumber: "",
    seatPrice: "",
  });
  const [loading, setLoading] = useState(true);
  const { adults, children } = state.flightState.formData;
  const [openDialog, setOpenDialog] = useState(false);
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [openDialogBack, setOpenDialogBack] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    const firstAdultSeatIndex = 0;
    const firstAdultSeatName = `adult-${firstAdultSeatIndex}`;

    setCurrentSelection({
      seatName: firstAdultSeatName,
      seatNumber: "",
      seatPrice: "",
    });
  }, [state]);

  useEffect(() => {
    if (currentSelection.seatName && currentSelection.seatNumber) {
      setSelectedSeats((prevSelectedSeats) => {
        if (
          prevSelectedSeats.some(
            (obj) => obj.seatName === currentSelection.seatName
          )
        ) {
          return prevSelectedSeats.map((seat) =>
            seat.seatName === currentSelection.seatName
              ? { ...seat, seatNumber: currentSelection.seatNumber, seatPrice: currentSelection.seatPrice }
              : seat
          );
        } else {
          return [...prevSelectedSeats, currentSelection];
        }
      });
    }
  }, [currentSelection]);

  useEffect(() => {
    (async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        };
        let seats;
        if (
          (state.flightState?.selectedSeatsDeparture && state.flightState?.selectedSeatsDeparture.length === state.flightState.selectedDepartureFlight.length)
        ) {
          setSelectedSeats([]);
          seats = state.flightState.selectedReturningFlight[state.flightState.selectedSeatsReturning.length ? state.flightState.selectedSeatsReturning.length : 0];
        } else {
          seats = state.flightState.selectedDepartureFlight[state.flightState.selectedSeatsDeparture ? state.flightState.selectedSeatsDeparture.length : 0];
        }
        const url = `http://localhost:3000/seats/getSeats?state=${encodeURIComponent(
          JSON.stringify(seats)
        )}`;
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        if (res.success) {        
          setSeats(res.data);
        } else {
          setTitleDialog("Error");
          setContentDialog(`Error: ${res.message}`);
        }
      } catch (error) {
        setTitleDialog("Error");
        setContentDialog(`Error fetching data: ${error}`);
      }
      setLoading(false);
    })();

    setSelectedSeats(Array.from({length: (parseInt(adults))}, (_, i) => ({
      seatName: `adult-${i}`,
      seatNumber: "",
      seatPrice: "",
    })));

    setSelectedSeats((prevArray) => [
      ...prevArray,
      ...Array.from({ length: parseInt(children) }, (_, i) => ({
        seatName: `children-${i}`,
        seatNumber: "",
        seatPrice: "",
      })),
    ]);
  }, [state, adults, children]);

  const handleBack = () => {
    setOpenDialogBack(true);
  }

  const goBack = () => {
    const formData = state.flightState.formData;
    if (state.flightState.selectedSeatsDeparture) {
      delete state.flightState.selectedSeatsDeparture;
    }
    navigateTo("/booking", { state: { formData } });
  }

  const handleSeatClick = (seatNumber, seatPrice) => {
    if (
      selectedSeats.find((obj) => {
        return (
          obj.seatNumber === seatNumber &&
          obj.seatName !== currentSelection.seatName
        );
      })
    ) {
      setTitleDialog("Error");
      setContentDialog("Seat selected. Please choose another");
      setOpenDialog(true);
    } else {
      setCurrentSelection((prevState) => ({
        ...prevState,
        seatNumber: seatNumber,
        seatPrice: seatPrice,
      }));
    }
  };

  const handleConfirm = () => {
    console.log(state);
    const flightState = state.flightState;

    //First: i check if it's direct flight or not
    if (!flightState.formData.oneWay) {
      //It's not a direct flight: if the seats chosen (or not chosen) are in the same length of the number of flights, go forward, otherwise select seats for other flights
      if (flightState.selectedSeatsDeparture) {
        if ((flightState.selectedSeatsDeparture.length) === flightState.selectedDepartureFlight.length) {
          if (flightState.selectedSeatsReturning) {
            if ((flightState.selectedSeatsReturning.length+1) === flightState.selectedReturningFlight.length) {
              flightState.selectedSeatsReturning[flightState.selectedReturningFlight.length] = selectedSeats;
              navigateTo("/info", { state: { flightState } });
            } else {
              flightState.selectedSeatsReturning[flightState.selectedSeatsReturning.length] = selectedSeats;
              navigateTo("/seats", { state: { flightState } });
            }
          } else {
            flightState.selectedSeatsReturning = [];
            flightState.selectedSeatsReturning[0] = selectedSeats;
            if (flightState.selectedSeatsReturning.length === flightState.selectedReturningFlight.length) {
              navigateTo("/info", { state: { flightState } });
            } else {
              navigateTo("/seats", { state: { flightState } });
            }
          }
        } else {
          flightState.selectedSeatsDeparture[state.flightState.selectedSeatsDeparture.length] = selectedSeats;
          navigateTo("/seats", { state: { flightState } });
        }
      } else {
        flightState.selectedSeatsDeparture = [];
        flightState.selectedSeatsDeparture[0] = selectedSeats;
        navigateTo("/seats", { state: { flightState } });
      }
    } else {
      //It's a direct flight: if the seats chosen (or not chosen) are in the same length of the number of flights, go forward, otherwise select seats for other flights
      if (flightState.selectedSeatsDeparture) {
        if ((flightState.selectedSeatsDeparture.length+1) === state.flightState.selectedDepartureFlight.length) {
          flightState.selectedSeatsDeparture[state.flightState.selectedSeatsDeparture.length] = selectedSeats;
          navigateTo("/info", { state: { flightState } });
        } else {
          flightState.selectedSeatsDeparture[state.flightState.selectedSeatsDeparture.length] = selectedSeats;
          navigateTo("/seats", { state: { flightState } });
        }
      } else {
        flightState.selectedSeatsDeparture = [];
        flightState.selectedSeatsDeparture[0] = selectedSeats;
        navigateTo("/seats", { state: { flightState } });
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "80vh",
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

  return (
    <Box>
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} />
      <Dialog open={openDialogBack} onClose={() => setOpenDialogBack(!openDialogBack)}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              Are you sure? You will go to the itinerary selections and lose every selected seat for every flight.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={goBack}>Yes</Button>
          <Button onClick={() => setOpenDialogBack(!openDialogBack)}>No</Button>
        </DialogActions>
      </Dialog>
      {state.flightState.selectedReturningFlight ? (
        <Cart
          formData={state.flightState.formData}
          selectedDepartureFlight={state.flightState.selectedDepartureFlight}
          selectedReturningFlight={state.flightState.selectedReturningFlight}
          selectedSeatsDeparture={state.flightState.selectedSeatsDeparture}
          priceDeparture={state.flightState.priceDeparture}
          priceReturning={state.flightState.priceReturning}
          selectedSeats={selectedSeats}
        />
      ) : (
        <Cart
          formData={state.flightState.formData}
          selectedDepartureFlight={state.flightState.selectedDepartureFlight}
          selectedSeatsDeparture={state.flightState.selectedSeatsDeparture}
          priceDeparture={state.flightState.priceDeparture}
          selectedSeats={selectedSeats}
        />
      )}

      <Container maxWidth="lg">
        <Typography sx={{ mt: 3, mb: 1 }} variant="h5" fontWeight={"bold"}>
          {(state.flightState.formData.oneWay)
            ? `2. Choose seats for ${state.flightState.formData.airportFrom} - ${state.flightState.formData.airportTo}` 
            : (state.flightState.selectedDepartureFlight.length !== state.flightState.selectedSeatsDeparture?.length) ? `2. Choose departure flight for ${state.flightState.formData.airportFrom} - ${state.flightState.formData.airportTo}` : `2. Choose returning flight for ${state.flightState.formData.airportTo} - ${state.flightState.formData.airportFrom}`}
        </Typography>
        <Grid
          container
          spacing={1}
          columns={{ xs: 1, md: 2 }}
          sx={{ mt: 1, width: "100%" }}
        >
          <Grid item xs={1} md={1} sx={{ mt: 1,
              backgroundImage: `url('./src/assets/planeAirframe.png')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 125%",
            }}>
              <Grid
                container
                spacing={{ xs: 0, md: 3.5 }}
                columns={{ xs: 12, sm: 8, md: 12 }}
                sx={{
                  p: 0.5,
                  mt: "220px !important"
                }}
              >
                {seats.map((seat, index) => {
                  return (
                    <React.Fragment key={seat.seat_number}>
                      <Tooltip title={seat.price + "€"} style={{ 
                        pointerEvents: seat.is_booked ? "none" : "auto"
                      }}>
                        <Grid item xs={2.5}>
                          <Typography
                            component={"span"}
                            fontWeight={"bold"}
                            sx={{ backgroundColor: "inherit" }}
                          >
                            
                            <Paper
                              elevation={3}
                              style={{
                                padding: "0.5em",
                                backgroundColor: seat.is_booked
                                  ? "#D2122E"
                                  : selectedSeats.find((obj) => {
                                      return obj.seatNumber === seat.seat_number;
                                    })
                                  ? "#4B0082"
                                  : seat.price >= 100 ? "black" : seat.price >= 50 ? "#7CB9E8" : "#FFC72C",
                                textAlign: "center",
                                margin: "1em",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                                flexFlow: "row wrap",
                                color: "white"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "green";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = seat.is_booked
                                ? "#D2122E"
                                : selectedSeats.find((obj) => {
                                    return obj.seatNumber === seat.seat_number;
                                  })
                                ? "#4B0082"
                                : seat.price >= 100 ? "black" : seat.price >= 50 ? "#7CB9E8" : "#FFC72C";
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSeatClick(seat.seat_number, seat.price);
                              }}
                            >
                              {seat.seat_number}
                            </Paper>
                          </Typography>
                        </Grid>
                      </Tooltip>
                      {seat.seat_number === "C4" && (
                        <Grid item xs={12} key={"empty" + index}>
                          {}
                        </Grid>
                      )}
                      {index % 4 === 1 && (
                        <Grid item xs={2} key={"empty" + index}>
                          {}
                        </Grid>
                      )}
                    </React.Fragment>
                  );
                })}
              </Grid>
          </Grid>
          <Grid item xs={1} md={1} sx={{ mt: 1 }}>
            <Typography variant="h5">
              {state.flightState.formData.oneWay
                ? `You're choosing seats for flight: ${state.flightState.selectedDepartureFlight[state.flightState.selectedSeatsDeparture ? state.flightState.selectedSeatsDeparture.length : 0].flight_number}`
                : (state.flightState.selectedDepartureFlight.length !== state.flightState.selectedSeatsDeparture?.length) ? "You're choosing seats for flight: " + state.flightState.selectedDepartureFlight[state.flightState.selectedSeatsDeparture?.length || 0].flight_number : "You're choosing seats for flight: " + state.flightState.selectedReturningFlight[state.flightState.selectedSeatsReturning?.length || 0].flight_number}
            </Typography>

            <Typography>
              {"It's not mandatory to choose a seat. In case of no choice, your seat will be chosen randomly before the flight."}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              {"Some information about seats: "}
            </Typography>

            <Typography>
              {"• "} 
              <span style={{color: "black", fontWeight: "bold"}}>BUSINESS</span>
              {" "}
              seats costs 100 or more euros.
            </Typography>

            <Typography>
              {"• "} 
              <span style={{color: "#7CB9E8", fontWeight: "bold"}}>SMART</span>
              {" "}
              seats costs from 50 to 99 euros.
            </Typography>

            <Typography>
              {"• "} 
              <span style={{color: "#FFC72C", fontWeight: "bold"}}>ECONOMY</span>
              {" "}
              seats costs from 0 to 49 euros.
            </Typography>

            <Typography>
              {"• "} 
              <span style={{color: "#D2122E", fontWeight: "bold"}}>RED</span>
              {" "}
              seats are booked and cannot be selected.
            </Typography>

            {adults
              ? Array.from({ length: adults }, (_, index) => (
                  <Paper
                    key={`adult-${index}`}
                    sx={{
                      p: 2,
                      ml: 2,
                      mr: 2,
                      mt: 2,
                      transition: "0.5s linear",
                      cursor: "pointer",
                      backgroundColor:
                        currentSelection.seatName === `adult-${index}`
                          ? "#E0E0E0"
                          : "white",
                    }}
                    elevation={
                      currentSelection.seatName === `adult-${index}` ? 3 : 1
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.backgroundColor = "#E0E0E0";
                      e.border = "2px solid #1976d2";
                      let selectedSeat;
                      let selectedPrice;
                      const selectedSeatObj = selectedSeats.find((obj) => {
                        return obj.seatName === `adult-${index}`;
                      });
                      if (selectedSeatObj) {
                        selectedSeat = selectedSeatObj.seatNumber;
                        selectedPrice = selectedSeatObj.seatPrice;
                      }
                      setCurrentSelection({
                        seatName: `adult-${index}`,
                        seatNumber: selectedSeat || "",
                        seatPrice: selectedPrice || "",
                      });
                    }}
                  >
                    <Typography variant="h6">Adult {index + 1}</Typography>
                    <Typography sx={{ mt: 1 }}>
                      Selected Seat:{" "}
                      {selectedSeats.find((obj) => {
                            return obj.seatName === `adult-${index}`;
                      }).seatNumber}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      Selected Seat Price: € {" "}
                      {selectedSeats.find((obj) => {
                            return obj.seatName === `adult-${index}`;
                      }).seatPrice}
                    </Typography>
                  </Paper>
                ))
              : null}

            {children
              ? Array.from({ length: children }, (_, index) => (
                  <Paper
                    key={`children-${index}`}
                    sx={{
                      p: 2,
                      ml: 2,
                      mr: 2,
                      mt: 2,
                      transition: "0.5s linear",
                      cursor: "pointer",
                      backgroundColor:
                        currentSelection.seatName === `children-${index}`
                          ? "#E0E0E0"
                          : "white",
                    }}
                    elevation={
                      currentSelection.seatName === `children-${index}` ? 3 : 1
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.backgroundColor = "#E0E0E0";
                      e.border = "2px solid #1976d2";
                      let selectedSeat;
                      let selectedPrice;
                      const selectedSeatObj = selectedSeats.find((obj) => {
                        return obj.seatName === `children-${index}`;
                      });
                      if (selectedSeatObj) {
                        selectedSeat = selectedSeatObj.seatNumber;
                        selectedPrice = selectedSeatObj.seatPrice;
                      }
                      setCurrentSelection({
                        seatName: `children-${index}`,
                        seatNumber: selectedSeat || "",
                        seatPrice: selectedPrice || "",
                      });
                    }}
                  >
                    <Typography variant="h6">Children {index + 1}</Typography>
                    <Typography sx={{ mt: 1 }}>
                      Selected Seat:{" "}
                      {selectedSeats.find((obj) => {
                            return obj.seatName === `children-${index}`;
                      }).seatNumber}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      Selected Seat Price: € {" "}
                      {selectedSeats.find((obj) => {
                            return obj.seatName === `children-${index}`;
                      }).seatPrice}
                    </Typography>
                  </Paper>
                ))
              : null}
          </Grid>
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
          <Grid item xs={2}>
            <Button
              onClick={handleConfirm}
              sx={{ mt: 3, mr: 1 }}
              fullWidth
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SeatPicker;