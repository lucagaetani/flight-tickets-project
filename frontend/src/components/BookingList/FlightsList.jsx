import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Button, Typography, Box, CircularProgress, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, BottomNavigation } from "@mui/material";
import DefaultDialog from "../DefaultDialog";
import ItineraryRow from "./ItineraryRow";

const FlightsList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogBack, setOpenDialogBack] = useState(false);
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
    if (selectedRow !== -1) {
      setOpenDialogBack(true);
    } else {
      const formData = state.formData;
      navigateTo("/", { state: { formData } });
    }
  }

  const goBack = () => {
    const formData = state.formData;
    navigateTo("/", { state: { formData } });
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
    <Container minwidth="lg" sx={{ mt: 3, width: "100%", }}>
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} />
      <Dialog open={openDialogBack} onClose={() => setOpenDialogBack(!openDialogBack)}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              Are you sure? You will go to the homepage and lose every selection done.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={goBack}>Yes</Button>
          <Button onClick={() => setOpenDialogBack(!openDialogBack)}>No</Button>
        </DialogActions>
      </Dialog>
      <Typography sx={{ mt: 3, mb: 1 }} variant="h5" fontWeight={"bold"}>
        {state.formData.oneWay
          ? `1. Choose flight for ${state.formData.airportFrom} - ${state.formData.airportTo}` 
          : !state.flightState ? `1. Choose departure flight for ${state.formData.airportFrom} - ${state.formData.airportTo}` : `1. Choose returning flight for ${state.formData.airportTo} - ${state.formData.airportFrom}`}
      </Typography>

      <Typography>
        Choose an itinerary.
      </Typography>

      <Typography sx={{ mb: 1 }}>
        Remember that the remaining seats field does not refer to the seats selected, but to the tickets booked for that particular flight.
      </Typography>
      <Typography>
        Not selectable itinerary means that one or many flights of that has 0 seats remained.
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
          height: "50vh",
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
      <Box sx={{ mt: 8 }}/>

      <Container minwidth="sm" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <BottomNavigation sx={{ alignItems: "center", justifyContent: "space-around" }}>
          <Button
            onClick={handleBack}
            sx={{ mr: 1, width: "150px" }}
            variant="contained"
            color="primary"
          >
            Back
          </Button>
          {isLogged ? (
              <Button
                onClick={handleConfirm}
                disabled={buttonConfirmDisabled}
                
                sx={{ ml: 1, width: "150px" }}
                variant="contained"
                color="primary"
              >
                Confirm
              </Button>
          ) : (
            <Tooltip title={"You have to be logged to continue"}>
                <Button
                  disabled={true}
                  
                  sx={{ ml: 1, width: "150px" }}
                  variant="contained"
                  color="primary"
                >
                  Confirm
                </Button>
            </Tooltip>
          )}
        </BottomNavigation>
      </Container>
    </Container>
  );
};

export default FlightsList;
