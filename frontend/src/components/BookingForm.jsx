import React, {useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import NumberPicker from "./NumberPicker";
import Autocomplete from '@mui/material/Autocomplete';

const BookingForm = () => {
  const [airportFrom, setAirportFrom] = useState("");
  const [airportTo, setAirportTo] = useState("");
  const [dateDeparting, setDateDeparting] = useState("");
  const [dateReturning, setDateReturning] = useState("");
  const [oneWayFlag, setOneWayFlag] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [airportFromError, setAirportFromError] = useState(false);
  const [airportToError, setAirportToError] = useState(false);
  const [dateDepartingError, setDateDepartingError] = useState(false);
  const [dateReturningError, setDateReturningError] = useState(false);
  const [adultsError, setAdultsError] = useState(false);
  const [disableDateReturning, setDisableDateReturning] = useState(false);

  const getAllAirports = async () => {
    const response = await fetch("http://127.0.0.1:3000/airports/getAirports");
    let airports = await response.json();
    airports = JSON.parse(airports.data);
    let arrayAirports = [];
    for (let a in airports) {
      arrayAirports.push(a);
    }
    return arrayAirports
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    setAirportFromError(false)
    setAirportToError(false)
    setDateDepartingError(false)
    setDateReturningError(false)
    setAdultsError(false)

    if (airportFrom == '') {
        setAirportFromError(true)
    }
    if (airportTo == '') {
        setAirportToError(true)
    }
    if (dateDeparting == ('gg/mm/aaaa' || "")) {
        setDateDepartingError(true)
    }

    if (!oneWayFlag) {
      if (dateReturning == ('gg/mm/aaaa' || "")) {
        setDateReturningError(true)
      }
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={
        {
          mt: 5, 
          mb: 5
        }
        }>
        <form autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <FormControl>
              <FormLabel sx={{mb: 1}}>From</FormLabel>
              <Autocomplete
                disablePortal
                options={getAllAirports()}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField 
                {...params} 
                label="e.g. Venice Marco Polo" 
                size="small" 
                onChange={e => setAirportFrom(e.target.value)}
                variant="outlined"
                fullWidth
                value={airportFrom}
                error={airportFromError} />}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <FormControl>
              <FormLabel sx={{mb: 1}}>Departing</FormLabel>
              <TextField type="date"
                    size="small" 
                    onChange={e => setDateDeparting(e.target.value)}
                    fullWidth
                    value={dateDeparting}
                    error={dateDepartingError} />
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <FormControl>
              <FormLabel sx={{mb: 1}}>Additional informations</FormLabel>
              <FormControlLabel control={<Checkbox 
                    />} label="One way" onChange={(e) => setOneWayFlag(e.target.value)} />
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <FormControl>
              <FormLabel sx={{mb: 1}}>To</FormLabel>
              <TextField
                    label="e.g. London Gatwick"
                    size="small" 
                    onChange={e => setAirportTo(e.target.value)}
                    variant="outlined"
                    fullWidth
                    value={airportTo}
                    error={airportToError} />
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <FormControl>
              <FormLabel sx={{mb: 1}}>Returning</FormLabel>
              <TextField 
                    type="date"
                    size="small"
                    onChange={e => setDateReturning(e.target.value)}
                    disabled={false}
                    fullWidth
                    value={dateReturning}
                    error={dateReturningError} />
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <FormControl>
              <FormLabel sx={{mb: 1}}>Adults (+16)</FormLabel>
              <NumberPicker id="adults"/>
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <FormControl>
              <FormLabel sx={{mb: 1}}>Children (2-5)</FormLabel>
              <NumberPicker id="children"/>
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <FormControl>
              <FormLabel sx={{mb: 1}}>{"Infants (<2)"}</FormLabel>
              <NumberPicker id="infants"/>
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
            <Button type="submit">Submit</Button>
          </Grid>
          <Grid item xs={4} sx={{display: "grid", justifyContent: "center"}}>
          </Grid>
        </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default BookingForm;
