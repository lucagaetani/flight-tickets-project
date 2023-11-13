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
          borderRadius: "1rem", }}>
        <Typography variant="h5">
          {`Choose a seat flight for `}
        </Typography>
        <Grid
          container
          spacing={3}
          sx={{ mt: 3 }}
          display={"flex"}
          justifyContent={"center"}
        >
          <Grid item xs={2}>
            <Button
              fullWidth
              onClick={handleClick}
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "50%" }}>
        <Grid container sx={{ mt: 5 }}>
          {seats.map((seat, index) => {
            return (
              <>
                <Tooltip title={seat.price + "€"}>
                  <Grid item xs={2.5}>
                    <Paper
                      elevation={3}
                      style={{
                        padding: 30,
                        backgroundColor: seat.isBooked ? "#FF5733" : "#DAF7A6",
                        disabled: "false",
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
                          : "#DAF7A6";
                      }}
                      onMouseClick={(e) => {
                        e.target.style.backgroundColor = "orange";
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
