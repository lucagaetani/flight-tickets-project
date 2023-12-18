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
  InputAdornment,
} from "@mui/material";
import Cart from "../Cart";

const LuggageUserInfo = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [arrayPassengerInfos, setArrayPassengerInfos] = useState([]);
  const [currentSeats, setCurrentSeats] = useState([]);
  const [currentPassenger, setCurrentPassenger] = useState(0);
  const [errors, setErrors] = useState({});
  const [applyToAll, setApplyToAll] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    console.log(arrayPassengerInfos);
  }, [arrayPassengerInfos])

  useEffect(() => {
    if (state.flightState.selectedSeatsReturning) {
      /*
      if (state.flightState.arrayReturningPassengerInfo) {
        const tempArray = Array.from(
          { length: state.flightState.selectedSeatsReturning[state.flightState.arrayDeparturePassengerInfo.length].length },
          (_, i) => ({
            [`name-${i}`]: "",
            [`surname-${i}`]: "",
            [`email-${i}`]: "",
            [`phone-${i}`]: "",
            [`airplane-luggage-${i}`]: "",
            [`hold-luggage-${i}`]: "",
            [`seat-number-${i}`]:
              state.flightState.selectedSeatsReturning[state.flightState.arrayReturningPassengerInfo][i].seatNumber,
            [`seat-price-${i}`]:
              state.flightState.selectedSeatsReturning[state.flightState.arrayReturningPassengerInfo][i].seatPrice,
          })
        );
        setArrayPassengerInfos(tempArray);
      } else {
        state.flightState.arrayReturningPassengerInfo = [];
        setArrayPassengerInfos(state.flightState.arrayReturningPassengerInfo);
      }
      */
    } else {
      if (state.flightState.arrayDeparturePassengerInfo) {
        const currentSeatsToSet = state.flightState.selectedSeatsDeparture[state.flightState.arrayDeparturePassengerInfo.length];
        const tempArray = Array.from(
          { length: currentSeatsToSet.length },
          (_, i) => ({
            [`name-${i}`]: "",
            [`surname-${i}`]: "",
            [`email-${i}`]: "",
            [`phone-${i}`]: "",
            [`airplane-luggage-${i}`]: "",
            [`hold-luggage-${i}`]: "",
            [`seat-number-${i}`]:
              currentSeatsToSet[i].seatNumber,
            [`seat-price-${i}`]:
              currentSeatsToSet[i].seatPrice,
          })
        );
        setCurrentSeats(currentSeatsToSet);
        setArrayPassengerInfos(tempArray);
      } else {
        state.flightState.arrayDeparturePassengerInfo = [];
        const currentSeatsToSet = state.flightState.selectedSeatsDeparture[state.flightState.arrayDeparturePassengerInfo.length];
        const tempArray = Array.from(
          { length: currentSeatsToSet.length },
          (_, i) => ({
            [`name-${i}`]: "",
            [`surname-${i}`]: "",
            [`email-${i}`]: "",
            [`phone-${i}`]: "",
            [`airplane-luggage-${i}`]: "",
            [`hold-luggage-${i}`]: "",
            [`seat-number-${i}`]:
              currentSeatsToSet[i].seatNumber,
            [`seat-price-${i}`]:
              currentSeatsToSet[i].seatPrice,
          })
        );
        setCurrentSeats(currentSeatsToSet);
        setArrayPassengerInfos(tempArray);
      }
    }
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
    const newErrors = arrayPassengerInfos.reduce((errors, passenger, index) => {
      if (!passenger[`name-${index}`]) {
        errors[`name-${index}`] = true;
      }
      if (!passenger[`surname-${index}`]) {
        errors[`surname-${index}`] = true;
      }
      if (!passenger[`email-${index}`]) {
        errors[`email-${index}`] = true;
      }
      if (!passenger[`phone-${index}`]) {
        errors[`phone-${index}`] = true;
      }
      if (passenger[`airplane-luggage-${index}`] === 0) {
        errors[`airplane-luggage-${index}`] = true;
      }
      return errors;
    }, {});

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const flightState = state.flightState;
    if (state.flightState.selectedReturningFlight) {
      //todo
    } else {
      if (state.flightState.arrayDeparturePassengerInfo) {
        if ((state.flightState.arrayDeparturePassengerInfo.length+1) === state.flightState.selectedSeatsDeparture.length) {
          let objPassengerInfos = {};
          let keyFlightNumber = flightState.selectedDepartureFlight[state.flightState.arrayDeparturePassengerInfo.length].flight_number;
          objPassengerInfos[keyFlightNumber] = arrayPassengerInfos;
          flightState.arrayDeparturePassengerInfo.push(arrayPassengerInfos);
          navigateTo("/confirm", { state: { flightState } });
        } else {
          let objPassengerInfos = {};
          let keyFlightNumber = flightState.selectedDepartureFlight[state.flightState.arrayDeparturePassengerInfo.length].flight_number;
          objPassengerInfos[keyFlightNumber] = arrayPassengerInfos;
          flightState.arrayDeparturePassengerInfo.push(arrayPassengerInfos);
          navigateTo("/info", { state: { flightState } });
        }
      } else {
        state.flightState.arrayDeparturePassengerInfo = [];
        let objPassengerInfos = {};
        let keyFlightNumber = flightState.selectedDepartureFlight[state.flightState.arrayDeparturePassengerInfo.length].flight_number;
        objPassengerInfos[keyFlightNumber] = arrayPassengerInfos;
        flightState.arrayDeparturePassengerInfo.push(arrayPassengerInfos);
        navigateTo("/info", { state: { flightState } });
      }
    }
  };

  const handleBack = () => {
    const flightState = state.flightState;
    navigateTo("/seats", { state: { flightState } });
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
      {(state.flightState.selectedSeatsReturning) ? (
        <Cart
          formData={state.flightState.formData}
          selectedDepartureFlight={state.flightState.selectedDepartureFlight}
          selectedReturningFlight={state.flightState.selectedReturningFlight}
          selectedSeatsDeparture={state.flightState.selectedSeatsDeparture}
          selectedSeatsReturning={state.flightState.selectedSeatsReturning}
          priceDeparture={state.flightState.priceDeparture}
          priceReturning={state.flightState.priceReturning}
        />
      ) : (
        <Cart
          formData={state.flightState.formData}
          selectedDepartureFlight={state.flightState.selectedDepartureFlight}
          selectedSeatsDeparture={state.flightState.selectedSeatsDeparture}
          priceDeparture={state.flightState.priceDeparture}
        />
      )}

      <Container maxWidth="lg">
        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "150px",
            mt: 2
          }}
        >
          <Typography sx={{ mt: 3, mb: 1 }} variant="h5" fontWeight={"bold"}>
            {(state.flightState.formData.oneWay)
              ? `3. Write user infos and baggages for every flight of ${state.flightState.formData.airportFrom} - ${state.flightState.formData.airportTo}` 
              : (state.flightState.selectedDepartureFlight.length !== state.flightState.selectedSeatsDeparture.length) ? `2. Choose departure flight for ${state.flightState.formData.airportFrom} - ${state.flightState.formData.airportTo}` : `2. Choose returning flight for ${state.flightState.formData.airportTo} - ${state.flightState.formData.airportFrom}`}
          </Typography>

          <Typography>
            {"You're writing infos and baggages for flight: " + state.flightState.selectedDepartureFlight[state.flightState.arrayDeparturePassengerInfo.length].flight_number}
          </Typography>

          <Typography fontWeight={"bold"}>
            Remember:
          </Typography>

          {state.flightState.arrayDeparturePassengerInfo && state.flightState.selectedSeatsReturning
            ? state.flightState.selectedSeatsReturning.map(
                (selectedSeatPerFlight, selectedIndex) => (
                  selectedSeatPerFlight.map((passenger, index) => (
                    <Paper
                      key={`passenger-${index}`}
                      sx={{
                        p: 2,
                        ml: 2,
                        mr: 2,
                        mt: 2,
                        transition: "0.5s linear",
                        cursor: "pointer",
                        backgroundColor:
                          currentPassenger === index ? "#D4D4D4" : "white",
                      }}
                      elevation={currentPassenger === index ? 3 : 1}
                      onClick={() => setCurrentPassenger(index)}
                    >
                      <Typography variant="h6" mb={2}>
                        {passenger.seatName.substring(0, 5) === "adult"
                          ? `Adult ${
                              parseInt(passenger.seatName.substring(6, 7), 10) + 1
                            }`
                          : `Children ${
                              parseInt(passenger.seatName.substring(9, 10), 10) +
                              1
                            }`}
                      </Typography>
                      <Grid container spacing={1} columns={{ xs: 1, md: 2 }}>
                        <Grid item xs={1}>
                          <Grid container spacing={2} columns={4}>
                            <Grid item xs={4}>
                              <TextField
                                label="Name"
                                type="text"
                                name={`name-${index}`}
                                fullWidth
                                defaultValue={null}
                                onBlur={handleChange}
                                error={!!errors[`name-${index}`]}
                                helperText={
                                  errors[`name-${index}`]
                                    ? "Name is required"
                                    : null
                                }
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Surname"
                                type="text"
                                name={`surname-${index}`}
                                fullWidth
                                defaultValue={null}
                                onBlur={handleChange}
                                error={!!errors[`surname-${index}`]}
                                helperText={
                                  errors[`surname-${index}`]
                                    ? "Surname is required"
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Email"
                                type="text"
                                name={`email-${index}`}
                                fullWidth
                                defaultValue={null}
                                onBlur={handleChange}
                                error={!!errors[`email-${index}`]}
                                helperText={
                                  errors[`email-${index}`]
                                    ? "Email is required"
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Phone"
                                type="text"
                                name={`phone-${index}`}
                                fullWidth
                                defaultValue={null}
                                onBlur={handleChange}
                                error={!!errors[`phone-${index}`]}
                                helperText={
                                  errors[`phone-${index}`]
                                    ? "Phone is required"
                                    : ""
                                }
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
                                defaultValue={
                                  arrayPassengerInfos[index][
                                    `airplane-luggage-${index}`
                                  ] || 0
                                }
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
                                defaultValue={
                                  arrayPassengerInfos[index][
                                    `hold-luggage-${index}`
                                  ] || 0
                                }
                                onChange={handleChange}
                                error={!!errors[`hold-luggage-${index}`]}
                                helperText={errors[`hold-luggage-${index}`]}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Seat number"
                                type="text"
                                defaultValue={passenger.seatNumber ? passenger.seatNumber : "Seat not selected"}
                                name={`seat-number-${index}`}
                                disabled
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-price">
                                  Seat price
                                </InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-price"
                                  disabled
                                  name={`seat-price-${index}`}
                                  startAdornment={
                                    <InputAdornment position="start">
                                      € {passenger.seatPrice ? passenger.seatPrice : 0}
                                    </InputAdornment>
                                  }
                                  label="Seat price"
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                )
              )
            : currentSeats.map(
              (passenger, index) => (
                <Paper
                  key={`passenger-${index}`}
                  sx={{
                    p: 2,
                    ml: 2,
                    mr: 2,
                    mt: 2,
                    transition: "0.5s linear",
                    cursor: "pointer",
                    backgroundColor:
                      currentPassenger === index ? "#D4D4D4" : "white",
                  }}
                  elevation={currentPassenger === index ? 3 : 1}
                  onClick={() => setCurrentPassenger(index)}
                >
                  <Typography variant="h6" mb={2}>
                    {passenger.seatName.substring(0, 5) === "adult"
                      ? `Adult ${
                          parseInt(passenger.seatName.substring(6, 7), 10) + 1
                        }`
                      : `Children ${
                          parseInt(passenger.seatName.substring(9, 10), 10) +
                          1
                        }`}
                  </Typography>
                  <Grid container spacing={1} columns={{ xs: 1, md: 2 }}>
                    <Grid item xs={1}>
                      <Grid container spacing={2} columns={4}>
                        <Grid item xs={4}>
                          <TextField
                            label="Name"
                            type="text"
                            name={`name-${index}`}
                            fullWidth
                            defaultValue={null}
                            onBlur={handleChange}
                            error={!!errors[`name-${index}`]}
                            helperText={
                              errors[`name-${index}`]
                                ? "Name is required"
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label="Surname"
                            type="text"
                            name={`surname-${index}`}
                            fullWidth
                            defaultValue={null}
                            onBlur={handleChange}
                            error={!!errors[`surname-${index}`]}
                            helperText={
                              errors[`surname-${index}`]
                                ? "Surname is required"
                                : ""
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label="Email"
                            type="text"
                            name={`email-${index}`}
                            fullWidth
                            defaultValue={null}
                            onBlur={handleChange}
                            error={!!errors[`email-${index}`]}
                            helperText={
                              errors[`email-${index}`]
                                ? "Email is required"
                                : ""
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label="Phone"
                            type="text"
                            name={`phone-${index}`}
                            fullWidth
                            defaultValue={null}
                            onBlur={handleChange}
                            error={!!errors[`phone-${index}`]}
                            helperText={
                              errors[`phone-${index}`]
                                ? "Phone is required"
                                : ""
                            }
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
                            defaultValue={
                              arrayPassengerInfos[
                                `airplane-luggage-${index}`
                              ] || 0
                            }
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
                            defaultValue={
                              arrayPassengerInfos[
                                `hold-luggage-${index}`
                              ] || 0
                            }
                            onChange={handleChange}
                            error={!!errors[`hold-luggage-${index}`]}
                            helperText={errors[`hold-luggage-${index}`]}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label="Seat number"
                            type="text"
                            defaultValue={passenger.seatNumber ? passenger.seatNumber : "Seat not selected"}
                            name={`seat-number-${index}`}
                            disabled
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-price">
                              Seat price
                            </InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-price"
                              disabled
                              name={`seat-price-${index}`}
                              startAdornment={
                                <InputAdornment position="start">
                                  € {passenger.seatPrice ? passenger.seatPrice : 0}
                                </InputAdornment>
                              }
                              label="Seat price"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper> 
              )
          )}
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
        </Box>
      </Container>
    </Box>
  );
};

export default LuggageUserInfo;

