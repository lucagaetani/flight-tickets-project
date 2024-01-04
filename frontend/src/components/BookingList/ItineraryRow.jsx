import { Box, Button, Collapse, Grid, Paper, Skeleton, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import AirlineLogo from "./AirlineLogo";
import DefaultDialog from "../DefaultDialog";

const ItineraryRow = (props) => {
  const [expandedPaper, setExpandedPaper] = useState(false);
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      try {
        const url = `http://localhost:3000/bookings/getFlightRemainingSeats?state=${encodeURIComponent(
          JSON.stringify(props.row["itFlights"])
        )}`;
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        if (res.success === true) {
          console.log(res.data);
          props.row["itFlights"] = res.data;
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

      setLoading(false);
    })();
  },[props.row])

  ItineraryRow.propTypes = {
    row: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    onPaperClick: PropTypes.func.isRequired,
  };

  const handlePaperClick = () => {
    props.onPaperClick(props.index);
  };

  const handleExpandedPaper = () => {
    setExpandedPaper(!expandedPaper);
  }

  const handledDisabledPaper = (itFlights) => {
    for (const flight of itFlights) {
      if (flight.remainingSeats === 0) {
        return true;
      }
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "14vh",
          mt: 1,
          mb: 1
        }}
      >
        <Skeleton variant="rectangular" width="95%" height="100%" sx={{ margin: "auto" }}/>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 2,
        ml: 2,
        mr: 2,
        mt: 2,
        transition: "0.5s linear",
        cursor: "pointer",
        opacity: handledDisabledPaper(props.row.itFlights) ? 0.5 : 1,
        backgroundColor:
          props.selected ? "#E0E0E0" : "white",
        pointerEvents: handledDisabledPaper(props.row.itFlights) ? "none" : "auto"
      }}
      elevation={props.selected ? 3 : 1}
      onClick={handlePaperClick}

    >
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} />
      <Grid 
        container
        spacing={{ xs: 1, md: 2 }}
        columns={{ xs: 2, md: 5 }}
      >
        <Grid item xs={1} md={1}>
          <Typography>
            {new Date(props.row.departure).getHours() + ":" + (new Date(props.row.departure).getMinutes() < 10 ? '0' : '') + new Date(props.row.departure).getMinutes() + " → " + new Date(props.row.arrival).getHours() + ":" + (new Date(props.row.arrival).getMinutes() < 10 ? '0' : '') + new Date(props.row.arrival).getMinutes()}
          </Typography>
        </Grid>
        <Grid item xs={1} md={1}>
          <Typography>
            {Math.floor(((new Date(props.row.arrival).getTime() - new Date(props.row.departure).getTime())/1000)/3600) + "h " + Math.floor((((new Date(props.row.arrival).getTime() - new Date(props.row.departure).getTime())/1000)%3600)/60) + "m"}
          </Typography>
        </Grid>
        <Grid item xs={1} md={1}>
          <Typography fontWeight={"bold"}>
            € {props.row.price}
          </Typography>
        </Grid>
        <Grid item xs={1} md={1}>
          <Typography>
            {props.row.estimatedCO2} CO2
          </Typography>
        </Grid>
        <Grid item xs={1} md={1}>
          <Typography>
            {props.row["itFlights"].length === 1 ? "Direct" : props.row["itFlights"].length-1 === 1 ? "1 stop" : props.row["itFlights"].length-1 + " stop"}
          </Typography>
        </Grid>
        <Grid item xs={2} md={5}>
          <Button
            onClick={handleExpandedPaper}
            sx={{ mt: 3, mr: 1 }}
            fullWidth
            color="primary"
          >
            {expandedPaper ? "Hide" : "Expand"}
          </Button>
        </Grid>
          <Collapse direction="vertical" in={expandedPaper}>
            <>
                {props.row["itFlights"].map((itineraryFlight,index) => (
                  <React.Fragment key={"flight"+index}>
                  <Grid 
                  container
                  spacing={{ xs: 1, md: 2 }}
                  columns={{ xs: 2, md: 5 }}
                  sx={{
                    marginLeft: "0px !important",
                    pr: 2
                  }}
                >
                    <Grid item xs={1} md={1}>
                      <Typography fontWeight={"bold"}>
                        {index+1}{"."} {itineraryFlight.flight.flight_number}
                        <AirlineLogo airline={itineraryFlight.flight.airline.name} />
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        {Math.floor(((new Date(itineraryFlight.flight.arrival).getTime() - new Date(itineraryFlight.flight.departure).getTime())/1000)/3600) + "h " + Math.floor((((new Date(itineraryFlight.flight.arrival).getTime() - new Date(itineraryFlight.flight.departure).getTime())/1000)%3600)/60) + "m"}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Departure: {itineraryFlight.flight.departureAirport.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Arrival: {itineraryFlight.flight.arrivalAirport.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Departure date and time: {new Date(itineraryFlight.flight.departure).toLocaleString('en-GB')}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Arrival date and time: {new Date(itineraryFlight.flight.arrival).toLocaleString('en-GB')}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Price: € {itineraryFlight.flight.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Seats remaining: {itineraryFlight.remainingSeats}
                      </Typography>
                    </Grid>
                  </Grid>
                  {props.row["itFlights"][index+1] && (
                    <Grid 
                      container
                      spacing={{ xs: 1, md: 2 }}
                      columns={{ xs: 2, md: 5 }}
                      key={"stopover"+index}
                      sx={{
                        marginLeft: "0px !important",
                        justifyContent: "center",
                        m: "auto"
                      }}
                    >
                      <Grid item xs={1} md={5} sx={{
                        display: "flex",
                        justifyContent: "center",
                        pl: "0px !important",
                        mt: 2,
                        mb: 2
                      }}>
                        <Typography fontWeight={"bold"}>
                          Waiting time for the stopover: {Math.floor(((new Date(props.row["itFlights"][index+1].flight.departure).getTime() - new Date(itineraryFlight.flight.arrival).getTime())/1000)/3600) + "h " + Math.floor((((new Date(props.row["itFlights"][index+1].flight.departure).getTime() - new Date(itineraryFlight.flight.arrival).getTime())/1000)%3600)/60) + "m"}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  </React.Fragment>
                ))}
              </>
            </Collapse>
        </Grid>
    </Paper>
  );
}

export default ItineraryRow;
