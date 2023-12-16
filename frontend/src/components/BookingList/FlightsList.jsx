import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Grid, Typography, Paper, Box, CircularProgress, Tooltip } from "@mui/material";
import ButtonDisabled from "./ButtonDisabled";
import AirlineLogo from "./AirlineLogo";
import DefaultDialog from "../DefaultDialog";

const FlightsList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState([]);
  const [price, setPrice] = useState(0);
  const [buttonConfirmDisabled, setButtonConfirmDisabled] = useState(true);
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const { state } = useLocation();
  const navigateTo = useNavigate();

  useEffect(() => {
  }, [selectedRow]);

  useEffect(() => {
    console.log(contentDialog);
    console.log(titleDialog);
    setOpenDialog(true);
  }, [contentDialog])

  useEffect(() => {
    const dataToSend = {
      airportFrom: state.selectedDepartureFlight ? state.formData.airportTo : state.formData.airportFrom,
      airportTo: state.selectedDepartureFlight ? state.formData.airportFrom : state.formData.airportTo,
      date: state.selectedDepartureFlight ? state.formData.returningDate : state.formData.departingDate,
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
          console.log(res);
          setRows(res.data);
        } else {
          {
            setTitleDialog("Error");
            setContentDialog(`Error: ${res.message}${res.error ? ". " + res.error : ""}`);
          }
        }
      } catch (error) {
        {
          setTitleDialog("Error");
          setContentDialog(`Error fetching data: ${error}`);
        }
      }

      try {
        const requestOptions = {
          method: "GET",
          credentials: "include",
        };
        const response = await fetch(
          "http://localhost:3000/auth",
          requestOptions
        );
        const res = await response.json();
      } catch (error) {
        {
          setTitleDialog("Error");
          setContentDialog(`Error: ${error}. Can't do fetch of auth.`);
          setIsLogged(true);
        }
      }
    })();
    setLoading(false);
  }, [navigateTo, state]);

  const handleBack = () => {

  }

  const handleConfirm = () => {

  }
  
  const handleExpandedPaper = () => {

  }

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
      <DefaultDialog toOpen={false} title={titleDialog} contentText={contentDialog} />
      <Typography sx={{ mt: 3, mb: 1 }} variant="h5" fontWeight={"bold"}>
        {state.formData.oneWay
          ? `1. Choose flight`
          : `1. Choose departure and returning flights`}
      </Typography>

      {rows.length === 0 ? (
        <Box
        sx={{
          display: "flex",
          height: "80vh",
        }}
      >
        <Typography sx={{ margin: "auto" }}>
          No rows for this option
        </Typography>
      </Box>
      ) : (
        rows.map((row, index) => (
          <Paper key={`itinerary-`+index}>
            <Grid 
              container
              columns={{ xs: 2, md: 3 }}
            >
              <Grid item xs={1} md={1}>
                <Typography>
                  {new Date(row.departure).getHours() + ":" + new Date(row.departure).getMinutes() + " -> " + new Date(row.arrival).getHours() + ":" + new Date(row.arrival).getMinutes()}
                </Typography>
              </Grid>
              <Grid item xs={1} md={1}>
                <Typography>
                  row.price
                </Typography>
              </Grid>
              <Grid item xs={1} md={1}>
                <Typography>
                  {!state.formData.oneWay ? "Direct" : state.selectedDepartureFlight ? "Departure" : "Arrival"}
                </Typography>
              </Grid>
              <Grid item xs={2} md={1}>
                <Button
                  onClick={handleExpandedPaper}
                  sx={{ mt: 3, mr: 1 }}
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Expand
                </Button>
              </Grid>
            </Grid>
          </Paper>
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
              disabled={disabled}
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
            </Tooltip>
          )}
      </Grid>
    </Container>
  );
};

export default FlightsList;
