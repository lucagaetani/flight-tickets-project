import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Button, Grid, Typography, Box, CircularProgress, Tooltip } from "@mui/material";
import DefaultDialog from "../DefaultDialog";
import ItineraryRow from "./ItineraryRow";

const FlightsList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(-1);
  const userData = useSelector((state) => state.userData);
  const [buttonConfirmDisabled, setButtonConfirmDisabled] = useState(true);
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const { state } = useLocation();
  const navigateTo = useNavigate();

  useEffect(() => {
    console.log(selectedRow);
    if (selectedRow !== -1) {
      setButtonConfirmDisabled(false);
    }
  }, [selectedRow]);

  useEffect(() => {
    console.log(state);
    const dataToSend = {
      airportFrom: state.flightState ? state.formData.airportTo : state.formData.airportFrom,
      airportTo: state.flightState ? state.formData.airportFrom : state.formData.airportTo,
      date: state.flightState ? state.formData.returningDate : state.formData.departingDate,
    };
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      try {
        const url = `http://localhost:3000/itineraries/getItinerariesForBooking?state=${encodeURIComponent(
          JSON.stringify(dataToSend)
        )}`;
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        if (res.success === true) {
          console.log(res.data);
          setRows(res.data);
        } else {
          {
            setTitleDialog("Error");
            setContentDialog(`Error: ${res.message}`);
            setOpenDialog(true);
          }
        }
      } catch (error) {
        {
          setTitleDialog("Error");
          setContentDialog(`Error fetching data: ${error}`);
          setOpenDialog(true);
        }
      }

      if (userData) {
        setIsLogged(true);
      }

      setLoading(false);
    })();
  }, [navigateTo, state, userData]);

  const handleBack = () => {
    navigateTo("/");
  }

  const handleConfirm = () => {
    selectedRow.fk_flight_numbers = selectedRow.itFlights.map((flight) => {return flight.flight});
    if (state.formData.oneWay) {
      const selectedDepartureItinerary = {
        id: selectedRow.id,
        departure: selectedRow.departure,
        arrival: selectedRow.arrival,
        price: selectedRow.price,
      };
    
      const flightState = {
        formData: state.formData,
        selectedDepartureItinerary: selectedDepartureItinerary,
        selectedDepartureFlight: selectedRow.fk_flight_numbers,
        priceDeparture: selectedRow.price
      };

      navigateTo("/seats", { state: { flightState } });
    } else if (!state.flightState) {
      const selectedDepartureItinerary = {
        id: selectedRow.id,
        departure: selectedRow.departure,
        arrival: selectedRow.arrival,
        price: selectedRow.price,
      };
    
      const flightState = {
        formData: state.formData,
        selectedDepartureItinerary: selectedDepartureItinerary,
        selectedDepartureFlight: selectedRow.fk_flight_numbers,
        priceDeparture: selectedRow.price
      };

      navigateTo("/booking", { state: { 
        formData: state.formData,
        flightState: flightState,
       } });
    } else {
      const flightState = state.flightState;
      flightState.selectedReturningItinerary = {
        id: selectedRow.id,
        departure: selectedRow.departure,
        arrival: selectedRow.arrival,
        price: selectedRow.price,
      };
      flightState.selectedReturningFlight = selectedRow.fk_flight_numbers;
      flightState.priceReturning = selectedRow.price;
  
      navigateTo("/seats", { state: { flightState } });
    }
  }

  const handlePaperClick = (row) => {
    setSelectedRow(row);
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
    <Container minwidth="lg" sx={{ mt: 3, width: "100%" }}>
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} />
      <Typography sx={{ mt: 3, mb: 1 }} variant="h5" fontWeight={"bold"}>
        {state.formData.oneWay
          ? `1. Choose flight for ${state.formData.airportFrom} - ${state.formData.airportTo}` 
          : !state.flightState ? `1. Choose departure flight for ${state.formData.airportFrom} - ${state.formData.airportTo}` : `1. Choose returning flight for ${state.formData.airportTo} - ${state.formData.airportFrom}`}
      </Typography>

      <Typography>
        Information inserted:
        <br />
        {state.formData.oneWay ? (
          <>
            • {state.formData.airportFrom} - {state.formData.airportTo} for the date {new Date(state.formData.departingDate).toLocaleString('en-GB').substring(0, 10)}
          </>
        ) : (
          <>
            • {state.formData.airportFrom} - {state.formData.airportTo} for the date {new Date(state.formData.departingDate).toLocaleString('en-GB').substring(0, 10)} <br />
            • {state.formData.airportTo} - {state.formData.airportFrom} for the date {new Date(state.formData.returningDate).toLocaleString('en-GB').substring(0, 10)}
          </>
        )}
      </Typography>

      {rows.length === 0 ? (
        <Box
        sx={{
          display: "flex",
          height: "65vh",
        }}
      >
        <Typography sx={{ margin: "auto" }}>
          No rows for this option
        </Typography>
      </Box>
      ) : (
        rows.map((row, index) => (
          <ItineraryRow 
            key={`itinerary-${row.id}`}
            row={row}
            index={index}
            selected={selectedRow.id === row.id}
            onPaperClick={() => handlePaperClick(row)}
          />
          
        ))
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
          {isLogged ? (
            <Grid item xs={2}>
              <Button
                onClick={handleConfirm}
                disabled={buttonConfirmDisabled}
                sx={{ mt: 3, mr: 1 }}
                fullWidth
                variant="contained"
                color="primary"
              >
                Confirm
              </Button>
            </Grid>
          ) : (
            <Tooltip title={"You have to be logged to continue"}>
              <Grid item xs={2}>
                <Button
                  disabled={true}
                  sx={{ mt: 3, mr: 1 }}
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Confirm
                </Button>
              </Grid>
            </Tooltip>
          )}
      </Grid>
    </Container>
  );
};

export default FlightsList;
