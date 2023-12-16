import { Button, Grid, Paper, Slide, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import { useState } from "react";
import AirlineLogo from "./AirlineLogo";

const ItineraryRow = (props) => {
  const [expandedPaper, setExpandedPaper] = useState(false);

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

  return (
    <Paper
      sx={{
        p: 2,
        ml: 2,
        mr: 2,
        mt: 2,
        transition: "0.5s linear",
        cursor: "pointer",
        backgroundColor:
          props.selected ? "#D4D4D4" : "white",
      }}
      elevation={props.selected ? 3 : 1}
      onClick={handlePaperClick}

    >
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
            {props.row.fk_flight_numbers.length === 1 ? "Direct" : props.row.fk_flight_numbers.length-1 === 1 ? "1 stop" : props.row.fk_flight_numbers.length-1 + " stop"}
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
        {expandedPaper && (
          <Slide direction="down">
            <>
                {props.row.fk_flight_numbers.map((flight,index) => (
                  <Grid 
                  container
                  spacing={{ xs: 1, md: 2 }}
                  columns={{ xs: 2, md: 5 }}
                  key={"flight"+index}
                  sx={{
                    marginLeft: "-3px !important"
                  }}
                >
                    <Grid item xs={1} md={1}>
                      <Typography fontWeight={"bold"}>
                        {index+1}{"."} {flight.flight_number}
                        <AirlineLogo airline={flight.airline.name} />
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        {Math.floor(((new Date(flight.arrival).getTime() - new Date(flight.departure).getTime())/1000)/3600) + "h " + Math.floor((((new Date(flight.arrival).getTime() - new Date(flight.departure).getTime())/1000)%3600)/60) + "m"}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Departure: {flight.departureAirport.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Arrival: {flight.arrivalAirport.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Departure date and time: {new Date(flight.departure).toLocaleString('en-GB')}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Arrival date and time: {new Date(flight.arrival).toLocaleString('en-GB')}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Price: € {flight.price}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
            </>
          </Slide>
        )}
      </Grid>
    </Paper>
  );
}

export default ItineraryRow;
