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
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment
} from "@mui/material";
import Cart from "../Cart";

const LuggageUserInfo = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [arrayPassengerInfos, setArrayPassengerInfos] = useState([]);
  const [currentPassenger, setCurrentPassenger] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    //Riempio l'array per poi aggiornarlo con le informazioni
    const tempArray = Array.from({ length: state.flightState.selectedSeatsDeparture.length }, (_, i) => ({
      [`name-${i}`]: "",
      [`surname-${i}`]: "",
      [`email-${i}`]: "",
      [`phone-${i}`]: "",
      [`airplane-luggage-${i}`]: "",
      [`hold-luggage-${i}`]: "",
      [`seat-number-${i}`]: state.flightState.selectedSeatsDeparture[i].seatNumber,
      [`seat-price-${i}`]: state.flightState.selectedSeatsDeparture[i].seatPrice,
    }));
    setArrayPassengerInfos(tempArray);
    setLoading(false);
    console.log(state);
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArrayPassengerInfos((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[currentPassenger] = {
        ...updatedArray[currentPassenger],
        [name]: value,
      };
      return updatedArray;
    });

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleConfirm = () => {
    // Check for empty fields
    const newErrors = {};
    arrayPassengerInfos.forEach((passenger, index) => {
      if (!passenger[`name-${index}`]) {
        newErrors[`name-${index}`] = true;
      }
      if (!passenger[`surname-${index}`]) {
        newErrors[`surname-${index}`] = true;
      }
      if (!passenger[`email-${index}`]) {
        newErrors[`email-${index}`] = true;
      }
      if (!passenger[`phone-${index}`]) {
        newErrors[`phone-${index}`] = true;
      }
      if (passenger[`airplane-luggage-${index}`] === 0) {
        newErrors[`airplane-luggage-${index}`] = true;
      }
    });

    console.log(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Continue with confirmation logic
    console.log("Confirmed!");
  };



  const handleBack = (() => {
    console.log("clicked");
  });

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
    );
  }

  return (
    <Box>
      <Cart />
      <Container maxWidth="lg">
        <Box sx={{
          width: "100%", height: "100%", border: "1px solid #C4C4C4",
          borderRadius: "1rem", minHeight: "150px", mt: 2, pt: "0px !important", pl: "0px !important"
        }}>
          <Typography variant="h5" sx={{ p: 2, borderBottom: "1px solid #C4C4C4" }}>
            {`Write user info and choose luggage for each passenger`}
          </Typography>

          {state.flightState.selectedSeatsDeparture ? state.flightState.selectedSeatsDeparture.map((passenger, index) => (
            <Paper
              key={`passenger-${index}`}
              sx={{
                p: 2,
                ml: 2,
                mr: 2,
                mt: 2,
                transition: "0.5s linear",
                cursor: "pointer",
                backgroundColor: currentPassenger === index ? "#D4D4D4" : "white"
              }}
              elevation={currentPassenger === index ? 3 : 1}
              onClick={() => setCurrentPassenger(index)}
            >
              <Typography variant="h6" mb={2}>{passenger.seatName.substring(0, 5) === "adult" ? `Adult ${parseInt(passenger.seatName.substring(6, 7), 10) + 1}` : `Children ${parseInt(passenger.seatName.substring(9, 10), 10) + 1}`}</Typography>
              <Grid container spacing={1} columns={{ xs: 1, md: 2 }}>
                <Grid item xs={1}>
                  <Grid container spacing={2} columns={4}>
                    <Grid item xs={4}>
                      <TextField
                        label="Name"
                        type="text"
                        name={`name-${index}`}
                        fullWidth
                        onBlur={handleChange}
                        error={!!errors[`name-${index}`]}
                        helperText={errors[`name-${index}`] ? "Name is required" : null}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Surname"
                        type="text"
                        name={`surname-${index}`}
                        fullWidth
                        onBlur={handleChange}
                        error={!!errors[`surname-${index}`]}
                        helperText={errors[`surname-${index}`] ? "Surname is required" : ""}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Email"
                        type="text"
                        name={`email-${index}`}
                        fullWidth
                        onBlur={handleChange}
                        error={!!errors[`email-${index}`]}
                        helperText={errors[`email-${index}`] ? "Email is required" : ""}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Phone"
                        type="text"
                        name={`phone-${index}`}
                        fullWidth
                        onBlur={handleChange}
                        error={!!errors[`phone-${index}`]}
                        helperText={errors[`phone-${index}`] ? "Phone is required" : ""}
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
                        name={`airplane-luggage-${index}`}
                        fullWidth
                        InputProps={{
                          inputProps: {
                            max: 1,
                            min: 0,
                          },
                        }}
                        defaultValue={arrayPassengerInfos[index][`airplane-luggage-${index}`] || 0}
                        onChange={handleChange}
                        error={!!errors[`airplane-luggage-${index}`]}
                        helperText={errors[`airplane-luggage-${index}`]}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Hold luggage"
                        type="number"
                        name={`hold-luggage-${index}`}
                        fullWidth
                        InputProps={{
                          inputProps: {
                            max: 5,
                            min: 0,
                          },
                        }}
                        defaultValue={arrayPassengerInfos[index][`hold-luggage-${index}`] || 0}
                        onChange={handleChange}
                        error={!!errors[`hold-luggage-${index}`]}
                        helperText={errors[`hold-luggage-${index}`]}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Seat number"
                        type="text"
                        defaultValue={passenger.seatNumber}
                        name={`seat-number-${index}`}
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel
                          htmlFor="outlined-adornment-price"
                        >Seat price</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-price"
                          disabled
                          name={`seat-price-${index}`}
                          startAdornment={<InputAdornment position="start">€ {passenger.seatPrice}</InputAdornment>}
                          label="Seat price"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
        </Box>
      </Container>
    </Box>
  );
};

export default LuggageUserInfo;