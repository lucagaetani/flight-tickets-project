import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField
} from "@mui/material";

const LuggageUserInfo = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [arrayPassengerInfos, setArrayPassengerInfos] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    airplaneLuggage: 0,
    holdLuggage: 0
  });
  const [currentPassenger, setCurrentPassenger] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setArrayPassengerInfos((prevArray) => {
      if (prevArray) {
        prevArray[currentPassenger] = passengerInfo;
      }
    });
  }, [passengerInfo, currentPassenger]);

  useEffect(() => {
    console.log(currentPassenger)
  }, [currentPassenger]);

  useEffect(() => {
    console.log(arrayPassengerInfos)
  }, [arrayPassengerInfos]);

  useEffect(() => {
    console.log(passengerInfo)
  }, [passengerInfo]);

  useEffect(() => {
    console.log(state);
    setLoading(false);
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArrayPassengerInfos((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  }

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
      <Box sx={{
        width: "100%", height: "100%", border: "1px solid #C4C4C4",
        borderRadius: "1rem", minHeight: "150px", mt: 2, pt: "0px !important", pl: "0px !important"
      }}>
        <Typography variant="h5" sx={{ p: 2, borderBottom: "1px solid #C4C4C4" }}>
          {`Write user info and choose luggage for each passenger`}
        </Typography>

        {state.flightState.selectedSeatsDeparture ? state.flightState.selectedSeatsDeparture.map((passenger, index) => {
          return (
            <>
              <Paper
                key={`passenger-${index}`}
                sx={{ p: 2, 
                  ml: 2, 
                  mr: 2, 
                  mt: 2,
                  transition: "0.5s linear",
                  cursor: "pointer",
                  backgroundColor: currentPassenger === index ? "#D4D4D4" : "white"
                }}
                elevation={currentPassenger === index ? 3 : 1}
                onClick={(e) => {
                  e.preventDefault();
                  e.backgroundColor = "#D4D4D4";
                  e.border = "2px solid #1976d2";
                  setCurrentPassenger(index)
                }}
              >
                <Typography variant="h6" mb={2}>{ passenger.seatName.substring(0,5) === "adult" ? "Adult " + (parseInt(passenger.seatName.substring(6,7), 10)+1) : "Children " + (parseInt(passenger.seatName.substring(9,10), 10)+1) }</Typography>
                <Grid container spacing={1} columns={{ xs: 1, md: 2 }}>
                  <Grid item xs={1}>
                    <Grid container spacing={2} columns={4}>
                      <Grid item xs={4}>
                        <TextField
                          label="Name"
                          type="text"
                          name="name"
                          fullWidth
                          onMouseLeave={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Surname"
                          type="text"
                          name="surname"
                          fullWidth
                          onMouseLeave={handleChange}
                          error={!!errors.surname}
                          helperText={errors.surname}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Email"
                          type="text"
                          name="email"
                          fullWidth
                          onMouseLeave={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Phone"
                          type="text"
                          name="phone"
                          fullWidth
                          onMouseLeave={handleChange}
                          error={!!errors.phone}
                          helperText={errors.phone}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={1}>
                    <Grid container spacing={2} columns={4}>
                      <Grid item xs={4}>
                        <TextField
                          label="Airplane luggage"
                          type="number"
                          name="airplane luggage"
                          fullWidth
                          InputProps={{
                            inputProps: {
                              max: 1,
                              min: 0,
                            },
                          }}
                          value={passengerInfo.airplaneLuggage}
                          onChange={handleChange}
                          error={!!errors.airplaneLuggage}
                          helperText={errors.airplaneLuggage}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Hold luggage"
                          type="number"
                          name="hold luggage"
                          fullWidth
                          InputProps={{
                            inputProps: {
                              max: 5,
                              min: 0,
                            },
                          }}
                          value={passengerInfo.holdLuggage}
                          onChange={handleChange}
                          error={!!errors.holdLuggage}
                          helperText={errors.holdLuggage}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Seat number"
                          type="text"
                          defaultValue={passenger.seatNumber}
                          name="seat number"
                          disabled={true}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )
        }) : ""}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 8, md: 12 }}
          sx={{ mt: 3, mb: 3 }}
          display={"flex"}
          justifyContent={"center"}
        >
          <Grid item xs={2}>
            <Button
              onClick={""}
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
              onClick={""}
              sx={{ mt: 3, mr: 1  }}
              fullWidth
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

export default LuggageUserInfo;