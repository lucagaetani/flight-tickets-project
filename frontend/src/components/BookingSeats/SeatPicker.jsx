import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  Tooltip,
  CircularProgress
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
  const [openDialogSeats, setOpenDialogSeats] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    const firstAdultSeatIndex = 0;
    const firstAdultSeatName = `adult-${firstAdultSeatIndex}`;

    setCurrentSelection({
      seatName: firstAdultSeatName,
      seatNumber: "",
      seatPrice: "",
    });
  }, [adults]);

  useEffect(() => {
    console.log(selectedSeats);
  }, [selectedSeats]);

  useEffect(() => {
    console.log(currentSelection);
  },[currentSelection])

  useEffect(() => {
    console.log(state);
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
          seats = state.flightState.selectedReturningFlight[state.flightState.selectedSeatsReturning.length];
        } else {
          seats = state.flightState.selectedDepartureFlight[state.flightState.selectedSeatsDeparture ? state.flightState.selectedSeatsDeparture.length : 0];
        }
        const url = `http://localhost:3000/seats/getSeats?state=${encodeURIComponent(
          JSON.stringify(seats)
        )}`;
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.success) {
          setSeats(data.data);
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
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

  const handleClick = () => {
    const formData = state.flightState.formData;
    if (state.flightState.selectedSeatsDeparture) {
      delete state.flightState.selectedSeatsDeparture;
    }
    navigateTo("/booking", { state: { formData } });
  };

  const handleClose = () => {
    setOpenDialogSeats(false);
  };

  const handleSeatClick = (seatNumber, seatPrice) => {
    if (
      selectedSeats.find((obj) => {
        return (
          obj.seatNumber === seatNumber &&
          obj.seatName !== currentSelection.seatName
        );
      })
    ) {
      console.log("eee");
      setOpenDialogSeats(true);
    } else {
      setCurrentSelection((prevState) => ({
        ...prevState,
        seatNumber: seatNumber,
        seatPrice: seatPrice,
      }));
    }
  };

  const handleConfirm = () => {
    const flightState = state.flightState;

    if (state.flightState.selectedReturningFlight) {
      if (state.flightState.selectedSeatsDeparture) {
        flightState.selectedSeatsReturning = selectedSeats;
        navigateTo("/info", { state: { flightState } });
      } else {
        flightState.selectedSeatsDeparture = selectedSeats;
        navigateTo("/seats", { state: { flightState } });
      }
    } else {
      flightState.selectedSeatsDeparture = selectedSeats;
      navigateTo("/info", { state: { flightState } });
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
      <DefaultDialog toOpen={openDialogSeats} title={"Error"} contentText={"Seat selected. Please choose another"} />
      {state.flightState.selectedReturningFlight ? (
        <Cart
          formData={state.flightState.formData}
          selectedDepartureFlight={state.flightState.selectedDepartureFlight}
          selectedReturningFlight={state.flightState.selectedReturningFlight}
          selectedSeatsDeparture={state.flightState.selectedSeatsDeparture}
          priceDeparture={state.flightState.priceDeparture}
          priceReturning={state.flightState.priceReturning}
        />
      ) : (
        <Cart
          formData={state.flightState.formData}
          selectedDepartureFlight={state.flightState.selectedDepartureFlight}
          priceDeparture={state.flightState.priceDeparture}
        />
      )}

      <Container maxWidth="lg">
        <Grid
          container
          columns={{ xs: 1, md: 2 }}
          sx={{ mt: 1, width: "100%" }}
        >
          <Grid item xs={1} md={1} sx={{ mt: 1 }}>
            <Grid
              container
              spacing={{ xs: 0, md: 3.5 }}
              columns={{ xs: 12, sm: 8, md: 12 }}
              sx={{
                mt: 5,
                backgroundImage: "./src/assets/planeAirframe.png",
                backgroundRepeat: "no-repeat",
                height: "100%",
                width: "100%",
                p: 2,
              }}
            >
              {seats.map((seat, index) => {
                return (
                  <>
                    <Tooltip title={seat.price + "€"}>
                      <Grid item xs={2.5} key={seat.seat_number}>
                        <Typography
                          component={"span"}
                          sx={{ backgroundColor: "inherit" }}
                        >
                          <Paper
                            elevation={3}
                            style={{
                              padding: "0.5em",
                              backgroundColor: seat.isBooked
                                ? "#FF5733"
                                : selectedSeats.find((obj) => {
                                    return obj.seatNumber === seat.seat_number;
                                  })
                                ? "orange"
                                : "#DAF7A6",
                              disabled: seat.isBooked ? "true" : "false",
                              textAlign: "center",
                              margin: "1em",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                              flexFlow: "row wrap",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "lightblue";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = seat.isBooked
                                ? "#FF5733"
                                : selectedSeats.find((obj) => {
                                    return obj.seatNumber === seat.seat_number;
                                  })
                                ? "orange"
                                : "#DAF7A6";
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
                  </>
                );
              })}
            </Grid>
          </Grid>
          <Grid item xs={1} md={1} sx={{ mt: 1 }}>
            <Typography variant="h5">
              {!state.flightState.selectedSeatsDeparture
                ? `Choose a seat flight for ${state.flightState.formData.airportFrom} to ${state.flightState.formData.airportTo}`
                : `Choose a seat flight for ${state.flightState.formData.airportTo} to ${state.flightState.formData.airportFrom}`}
            </Typography>

            <Typography>
              {"It's not mandatory to choose a seat. In case of no choice, your seat will be chosen randomly before the flight."}
            </Typography>

            <Typography>
              {"Some information about seats: "}
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
                          ? "#D4D4D4"
                          : "white",
                    }}
                    elevation={
                      currentSelection.seatName === `adult-${index}` ? 3 : 1
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.backgroundColor = "#D4D4D4";
                      e.border = "2px solid #1976d2";
                      let selectedSeat;
                      let selectedPrice;
                      {
                        selectedSeats.find((obj) => {
                          return obj.seatName === `adult-${index}`;
                        })
                          ? (selectedSeat = selectedSeats.find((obj) => {
                              return obj.seatName === `adult-${index}`;
                            }).seatNumber)
                          : "";
                      }
                      {
                        selectedSeats.find((obj) => {
                          return obj.seatName === `adult-${index}`;
                        })
                          ? (selectedPrice = selectedSeats.find((obj) => {
                              return obj.seatName === `adult-${index}`;
                            }).seatPrice)
                          : "";
                      }
                      setCurrentSelection({
                        seatName: `adult-${index}`,
                        seatNumber: selectedSeat ? selectedSeat : "",
                        seatPrice: selectedPrice ? selectedPrice : "",
                      });
                    }}
                  >
                    <Typography variant="h6">Adult {index + 1}</Typography>
                    <Typography sx={{ mt: 2 }}>
                      Selected Seat:{" "}
                      {selectedSeats[index].seatNumber
                        ? selectedSeats.find((obj) => {
                            return obj.seatName === `adult-${index}`;
                          }).seatNumber
                        : "none"}
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
                          ? "#D4D4D4"
                          : "white",
                    }}
                    elevation={
                      currentSelection.seatName === `children-${index}` ? 3 : 1
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.backgroundColor = "#D4D4D4";
                      e.border = "2px solid #1976d2";
                      let selectedSeat;
                      let selectedPrice;
                      {
                        selectedSeats.find((obj) => {
                          return obj.seatName === `children-${index}`;
                        })
                          ? (selectedSeat = selectedSeats.find((obj) => {
                              return obj.seatName === `children-${index}`;
                            }).seatNumber)
                          : "";
                      }
                      {
                        selectedSeats.find((obj) => {
                          return obj.seatName === `children-${index}`;
                        })
                          ? (selectedPrice = selectedSeats.find((obj) => {
                              return obj.seatName === `children-${index}`;
                            }).seatPrice)
                          : "";
                      }
                      setCurrentSelection({
                        seatName: `children-${index}`,
                        seatNumber: selectedSeat ? selectedSeat : "",
                        seatPrice: selectedPrice ? selectedPrice : "",
                      });
                    }}
                  >
                    <Typography variant="h6">Children {index + 1}</Typography>
                    <Typography sx={{ mt: 2 }}>
                      Selected Seat:{" "}
                      {selectedSeats[index].seatNumber
                        ? selectedSeats.find((obj) => {
                            return obj.seatName === `children-${index}`;
                          }).seatNumber
                        : "none"}
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
              onClick={handleClick}
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
