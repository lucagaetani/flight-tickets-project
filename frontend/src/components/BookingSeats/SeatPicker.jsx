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
} from "@mui/material";

const SeatPicker = () => {
  const [seats, setSeats] = useState([]);
  const { state } = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigateTo = useNavigate();

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
          console.log(data.data);
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleClick = () => {
    const formData = state.flightState.formData;
    console.log(formData);
    navigateTo("/booking", { state: { formData } });
  };

  //todo seats.map --> genera i posti
  return (
    <Container maxWidth="lg" sx={{ display: "flex" }}>
      <Box sx={{ width: "50%", height:"100%", border: "1px solid #C4C4C4",
          borderRadius: "1rem", minHeight: "150px", mt: 2 }}>
        <Typography variant="h5" sx={{p: 2, borderBottom: "1px solid #C4C4C4"}}>
          {`Choose a seat flight for `}
        </Typography>
        <Grid
          container
          spacing={2}
          display={"flex"}
          justifyContent={"center"}
        >
          {selectedSeats.map((seat, index) => {
            return (
              <Grid item xs={11} sx={{mt: 2}} key={"SeatSelected: " + index}>
                <Paper
                  elevation={2}
                  sx={{ display: "flex", p: 2 }}
                >
                  <Typography fontWeight={"bold"}>
                    Seat selected:
                  </Typography>
                  <Typography sx={{ml: 1}}>
                    {seat}
                  </Typography>
                </Paper>
              </Grid>
            )
          }
          )}
          <Grid item xs={2}>
            <Button
              fullWidth
              onClick={handleClick}
              sx={{ mt: 2, mb: 2 }}
              variant="contained"
              color="primary"
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "50%" }}>
        <Grid container sx={{ mt: 5, backgroundImage: "./src/assets/planeAirframe.png", backgroundRepeat: "no-repeat", height: '100%', width: "100%", p: 2}}>
          {seats.map((seat, index) => {
            return (
              <>
                <Tooltip title={seat.price + "€"}>
                  <Grid item xs={2.5}>
                    <Paper
                      elevation={3}
                      style={{
                        padding: 30,
                        backgroundColor: seat.isBooked ? "#FF5733" : selectedSeats.includes(seat.seat_number) ? "orange" : "#DAF7A6",
                        disabled: seat.isBooked ? "true" : "false",
                        textAlign: "center",
                        margin: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "lightblue";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = seat.isBooked
                          ? "#FF5733"
                          : selectedSeats.includes(seat.seat_number) ? "orange" : "#DAF7A6";
                      }}
                      onClick={(e) => {
                        e.target.style.backgroundColor = "orange";
                        setSelectedSeats(oldArray => [...oldArray, seat.seat_number]);
                      }}
                    >
                      {seat.seat_number}
                    </Paper>
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
      </Box>
    </Container>
  );
};

export default SeatPicker;
