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
  CircularProgress,
} from "@mui/material";

const SeatPicker = () => {
  const [seats, setSeats] = useState([]);
  const { state } = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({
    seatName: "",
    seatNumber: ""
  });
  const [loading, setLoading] = useState(true);
  const { adults, children } = state.flightState.formData;
  const navigateTo = useNavigate();

  useEffect(() => {
    const firstAdultSeatIndex = 0;
    const firstAdultSeatName = `adult-${firstAdultSeatIndex}`;

    setCurrentSelection({
      seatName: firstAdultSeatName,
      seatNumber: "",
    });
  }, [adults]);

  useEffect(() => {
    if (currentSelection.seatName && currentSelection.seatNumber) {
      setSelectedSeats((prevSelectedSeats) => {
        if (prevSelectedSeats.some((obj) => obj.seatName === currentSelection.seatName)) {
          return prevSelectedSeats.map((seat) =>
            seat.seatName === currentSelection.seatName
              ? { ...seat, seatNumber: currentSelection.seatNumber }
              : seat
          );
        } else {
          return [...prevSelectedSeats, currentSelection];
        }
      });
    }
  }, [currentSelection])

  useEffect(() => {
    console.log(selectedSeats);
  }, [selectedSeats])

  useEffect(() => {
    console.log(state);
    (async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        };
        let seats;
        if (state.seatsDeparture) {
          seats = state.flightState.selectedReturningFlight[0];
        } else {
          seats = state.flightState.selectedDepartureFlight[0];
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
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [state]);

  const handleClick = () => {
    const formData = state.flightState.formData;
    navigateTo("/booking", { state: { formData } });
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.find((obj) => { return obj.seatNumber === seatNumber && obj.seatName !== currentSelection.seatName })) {
      {alert("Seat selected, choose another!")}
    } else {
      setCurrentSelection((prevState) => ({
        ...prevState,
        seatNumber: seatNumber
      }),
      );
    }
  };

  const handleConfirm = () => {
    if (state.flightState.selectedReturningFlight) {
      //TODO
      console.log("a");
    } else {
      const flightState = state.flightState;
      flightState.selectedSeatsDeparture = selectedSeats;
      navigateTo("/info", { state: { flightState } });
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: "flex",
        height: "80vh"
      }}>
        <CircularProgress sx={{
          margin: "auto"
        }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box>
        <Grid container 
        spacing={{ xs: 0, md: 3.5 }} columns={{ xs: 12, sm: 8, md: 12 }}
        sx={{ mt: 5, backgroundImage: "./src/assets/planeAirframe.png", backgroundRepeat: "no-repeat", height: '100%', width: "100%", p: 2 }}>
          {seats.map((seat, index) => {
            return (
              <>
                <Tooltip title={seat.price + "€"}>
                  <Grid item xs={2.5} key={seat.seat_number}>
                    <Typography component={'span'} sx={{ backgroundColor: 'inherit' }}>
                      <Paper
                        elevation={3}
                        style={{
                          padding: "0.5em",
                          backgroundColor: seat.isBooked ? "#FF5733" : selectedSeats.find((obj) => { return obj.seatNumber === seat.seat_number }) ? "orange" : "#DAF7A6",
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
                            : selectedSeats.find((obj) => { return obj.seatNumber === seat.seat_number }) ? "orange" : "#DAF7A6";
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSeatClick(seat.seat_number);
                        }}
                      >
                        {seat.seat_number}
                      </Paper>
                    </Typography>
                  </Grid>
                </Tooltip>
                {seat.seat_number === "C4" && (
                  <Grid item xs={12} key={"empty" + index}>
                    { }
                  </Grid>
                )}
                {index % 4 === 1 && (
                  <Grid item xs={2} key={"empty" + index}>
                    { }
                  </Grid>
                )}
              </>
            );
          })}
        </Grid>
      </Box>
      <Box sx={{
        width: "100%", height: "100%", border: "1px solid #C4C4C4",
        borderRadius: "1rem", minHeight: "150px", mt: 2, pt: "0px !important", pl: "0px !important"
      }}>
        <Typography variant="h5" sx={{ p: 2, borderBottom: "1px solid #C4C4C4" }}>
          {`Choose a seat flight for `}
        </Typography>

        {adults ? Array.from({ length: adults }, (_, index) => (
          <Paper key={`adult-${index}`}
            sx={{ p: 2, 
              ml: 2, 
              mr: 2, 
              mt: 2,
              transition: "0.5s linear",
              cursor: "pointer",
              backgroundColor: currentSelection.seatName === `adult-${index}` ? "#D4D4D4" : "white"
            }}
            elevation={currentSelection.seatName === `adult-${index}` ? 3 : 1}
            onClick={(e) => {
              e.preventDefault();
              e.backgroundColor = "#D4D4D4";
              e.border = "2px solid #1976d2";
              let selected;
              {selectedSeats.find((obj) => { return obj.seatName === `adult-${index}` }) ? selected = selectedSeats.find((obj) => { return obj.seatName === `adult-${index}` }).seatNumber :  ""}
              setCurrentSelection({
                seatName: `adult-${index}`,
                seatNumber: selected ? selected : ''
              })
            }}
          >
            <Typography variant="h6">Adult {index + 1}</Typography>
            <Typography sx={{ mt: 2 }}>
              Selected Seat: {selectedSeats.find((obj) => { return obj.seatName === `adult-${index}` }) ? selectedSeats.find((obj) => { return obj.seatName === `adult-${index}` }).seatNumber :  "none"}
            </Typography>
          </Paper>
        )) : null}

        {children ? Array.from({ length: children }, (_, index) => (
          <Paper key={`children-${index}`}
            sx={{ p: 2,
              ml: 2, 
              mr: 2, 
              mt: 2,
              transition: "0.5s linear",
              cursor: "pointer",
              backgroundColor: currentSelection.seatName === `children-${index}` ? "#D4D4D4" : "white"
            }}
            elevation={currentSelection.seatName === `children-${index}` ? 3 : 1}
            onClick={(e) => {
              e.preventDefault();
              e.backgroundColor = "#D4D4D4";
              e.border = "2px solid #1976d2";
              let selected;
              {selectedSeats.find((obj) => { return obj.seatName === `children-${index}` }) ? selected = selectedSeats.find((obj) => { return obj.seatName === `children-${index}` }).seatNumber :  ""}
              setCurrentSelection({
                seatName: `children-${index}`,
                seatNumber: selected ? selected : ''
              })
            }}
          >
            <Typography variant="h6">Children {index + 1}</Typography>
            <Typography sx={{ mt: 2 }}>
              Selected Seat: {selectedSeats.find((obj) => { return obj.seatName === `children-${index}` }) ? selectedSeats.find((obj) => { return obj.seatName === `children-${index}` }).seatNumber :  "none"}
            </Typography>
          </Paper>
        )) : null}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 8, md: 12 }}
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
              sx={{ mt: 3, mr: 1  }}
              fullWidth
              //TODO is not working
              disabled = {!selectedSeats.length === (parseInt(adults)+parseInt(children))}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SeatPicker;