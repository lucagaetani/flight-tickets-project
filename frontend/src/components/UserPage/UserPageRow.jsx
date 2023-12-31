import { Button, Collapse, Grid, Paper, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import AirlineLogo from "../BookingList/AirlineLogo";

const UserPageRow = (props) => {
  const [expandedPaper, setExpandedPaper] = useState(false);
  const [priceRow, setPriceRow] = useState(0);

  useEffect(() => {
    console.log(props.row);
  }, [])

  useEffect(() => {
    let price = 0;
    price += props.row.itDep.price;
    if (props.row.itRet) {
      price += props.row.itRet.price
    }
    props.row.tickets.forEach((ticket) => {
      price += ticket.seat_price
      price += ticket.hold_luggage ? (parseInt(ticket.hold_luggage)*65) : 0
    })
    setPriceRow(price);
  }, [priceRow, props])

  UserPageRow.propTypes = {
    row: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
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
      }}
      elevation={3}
    >
      {props.row.itDep && (
        <Grid container columns={{ xs: 2, md: 4 }} spacing={1}>
          <Grid item xs={2} md={4}>
            <Typography fontWeight={"bold"}>
              Total booking costs: € {priceRow}
            </Typography>
          </Grid>
          <Grid item xs={2} md={4}>
            <Typography fontWeight={"bold"}>
              Departure main informations {!props.row.itRet && " (direct flight)"}
            </Typography>
          </Grid>
          <Grid item xs={1} md={1}>
            <Typography>
            {new Date(props.row.itDep.departure).getHours() + ":" + (new Date(props.row.itDep.departure).getMinutes() < 10 ? '0' : '') + new Date(props.row.itDep.departure).getMinutes() + " → " + new Date(props.row.itDep.arrival).getHours() + ":" + (new Date(props.row.itDep.arrival).getMinutes() < 10 ? '0' : '') + new Date(props.row.itDep.arrival).getMinutes()}
            </Typography>
          </Grid>
          <Grid item xs={1} md={1}>
            <Typography>
              {Math.floor(((new Date(props.row.itDep.arrival).getTime() - new Date(props.row.itDep.departure).getTime())/1000)/3600) + "h " + Math.floor((((new Date(props.row.itDep.arrival).getTime() - new Date(props.row.itDep.departure).getTime())/1000)%3600)/60) + "m"}
            </Typography>
          </Grid>
          <Grid item xs={1} md={1}>
            <Typography>
              {props.row.itDep.itFlights[0].flight.departureAirport.name + " → " + props.row.itDep.itFlights[props.row.itDep.itFlights.length-1].flight.arrivalAirport.name}
            </Typography>
          </Grid>
          <Grid item xs={1} md={1}>
            <Typography>
              € {props.row.itDep.price}
            </Typography>
          </Grid>
          {props.row.itRet && (
            <>
              <Grid item xs={2} md={4}>
                <Typography fontWeight={"bold"}>
                  Returning main informations
                </Typography>
              </Grid>
              <Grid item xs={1} md={1}>
                <Typography>
                  {new Date(props.row.itRet.departure).getHours() + ":" + (new Date(props.row.itRet.departure).getMinutes() < 10 ? '0' : '') + new Date(props.row.itRet.departure).getMinutes() + " → " + new Date(props.row.itRet.arrival).getHours() + ":" + (new Date(props.row.itRet.arrival).getMinutes() < 10 ? '0' : '') + new Date(props.row.itRet.arrival).getMinutes()}
                </Typography>
              </Grid>
              <Grid item xs={1} md={1}>
                <Typography>
                  {Math.floor(((new Date(props.row.itRet.arrival).getTime() - new Date(props.row.itRet.departure).getTime())/1000)/3600) + "h " + Math.floor((((new Date(props.row.itRet.arrival).getTime() - new Date(props.row.itRet.departure).getTime())/1000)%3600)/60) + "m"}
                </Typography>
              </Grid>
              <Grid item xs={1} md={1}>
                <Typography>
                  {props.row.itRet.itFlights[0].flight.departureAirport.name + " → " + props.row.itRet.itFlights[props.row.itRet.itFlights.length-1].flight.arrivalAirport.name}
                </Typography>
              </Grid>
              <Grid item xs={1} md={1}>
                <Typography>
                  € {props.row.itRet.price}
                </Typography>
              </Grid>
            </>
          )}
          <Grid item xs={2} md={4}>
            <Typography fontWeight={"bold"}>
              Tickets main informations
            </Typography>
          </Grid>
          <Grid item xs={2} md={4}>
            <Typography>
              {props.row.tickets.length} {props.row.tickets.length > 1 ? "Tickets" : "Ticket"} booked
            </Typography>
          </Grid>
          <Grid item xs={2} md={4}>
            <Button
              onClick={handleExpandedPaper}
              sx={{ mt: 2, mr: 1 }}
              fullWidth
              color="primary"
            >
              {expandedPaper ? "Hide" : "Expand"}
            </Button>
          </Grid>
          <Collapse direction="vertical" in={expandedPaper}>
            <>
              <Typography variant="h5" fontWeight={"bold"} sx={{ ml: "0px !important", pl: 1, pt: 1, pb: 1, pr: 1  }}>
                Flights informations
              </Typography>
              <Typography fontWeight={"bold"} sx={{ ml: "0px !important", pl: 1, pb: 1, pr: 1, mt: 1, mb: 1 }}>
                Departure
              </Typography>
              {props.row.itDep.itFlights.map((itineraryFlight,index) => (
                <>
                  <Grid 
                    container
                    spacing={{ xs: 1, md: 2 }}
                    columns={{ xs: 2, md: 5 }}
                    key={"departure"+index}
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
                  </Grid>
                  {props.row.itDep.itFlights[index+1] && (
                    <Grid 
                      container
                      spacing={{ xs: 1, md: 2 }}
                      columns={{ xs: 2, md: 5 }}
                      key={"stopDep"+index}
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
                          Waiting time for the stopover: {Math.floor(((new Date(props.row.itDep.itFlights[index+1].flight.departure).getTime() - new Date(itineraryFlight.flight.arrival).getTime())/1000)/3600) + "h " + Math.floor((((new Date(props.row.itDep.itFlights[index+1].flight.departure).getTime() - new Date(itineraryFlight.flight.arrival).getTime())/1000)%3600)/60) + "m"}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </>
              ))}
              {props.row.itRet && (
                <Typography fontWeight={"bold"} sx={{ ml: "0px !important", pl: 1, pb: 1, pr: 1, mt: 1, mb: 1 }}>
                  Returning
                </Typography>
              )}
              {props.row.itRet && props.row.itRet.itFlights.map((itineraryFlight,index) => (
                <>
                  <Grid 
                    container
                    spacing={{ xs: 1, md: 2 }}
                    columns={{ xs: 2, md: 5 }}
                    key={"returning"+index}
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
                  </Grid>
                  {props.row.itRet.itFlights[index+1] && (
                    <Grid 
                      container
                      spacing={{ xs: 1, md: 2 }}
                      columns={{ xs: 2, md: 5 }}
                      key={"stopRet"+index}
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
                          Waiting time for the stopover: {Math.floor(((new Date(props.row.itDep.itFlights[index+1].flight.departure).getTime() - new Date(itineraryFlight.flight.arrival).getTime())/1000)/3600) + "h " + Math.floor((((new Date(props.row.itDep.itFlights[index+1].flight.departure).getTime() - new Date(itineraryFlight.flight.arrival).getTime())/1000)%3600)/60) + "m"}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </>
              ))}
              <Typography variant="h5" fontWeight={"bold"} sx={{ ml: "0px !important", pl: 1, pt: 1, pb: 1, pr: 1  }}>
                Tickets informations
              </Typography>
              {props.row.tickets.map((ticket, index) => (
                <>
                  <Grid 
                    container
                    spacing={{ xs: 1, md: 2 }}
                    columns={{ xs: 2, md: 3 }}
                    key={"ticketsReturning"+index}
                    sx={{
                      marginLeft: "0px !important",
                      pr: 2,
                      mb: 1
                    }}
                  >
                    <Grid item xs={2} md={3}>
                      <Typography fontWeight={"bold"}>
                        {index+1}{"° ticket"}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Name: {ticket.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Surname: {ticket.surname}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} md={1}>
                      <Typography>
                        Email: {ticket.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Phone: {ticket.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Airport luggages: {ticket.airport_luggages ? ticket.airport_luggages : "0"}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Hold luggages: {ticket.hold_luggages ? ticket.hold_luggages : "0"}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Flight number ticket: {ticket.fk_flight_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Seat number ticket: {ticket.fk_seat_number ? ticket.fk_seat_number : "none"}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        Seat price: € {ticket.seat_price ? ticket.seat_price : "0"}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              ))}
            </>
          </Collapse>
        </Grid>
      )}
    </Paper>
  );
}

export default UserPageRow;
