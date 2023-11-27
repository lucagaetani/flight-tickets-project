//TODO: gestione ritorno e prezzo volo
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography
} from "@mui/material";
import PropTypes from 'prop-types';

const Cart = (props) => {
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(props);
    }, [props]);

    useEffect(() => {
        let totalPrice = 0;
        props.selectedSeatsDeparture.forEach((seat) => {
            totalPrice += seat.seatPrice;
        });
        setTotalCartPrice(totalPrice);
        setLoading(false);
    }, [props.selectedSeatsDeparture]);

    const handleClick = (() => {
        setExpanded(!expanded);
    });

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                height: "20vh"
            }}>
                <CircularProgress sx={{
                    margin: "auto"
                }} />
            </Box>
        );
    }

    Cart.propTypes = {
        //Gestire ritorno
        formData: PropTypes.object,
        selectedDepartureFlight: PropTypes.array,
        selectedSeatsDeparture: PropTypes.array
    };

    return (
        <Box
            sx={{
                backgroundColor: "#000",
                color: "white",
                width: "100%",
                mt: 2,
                position: "sticky",
                top: 0,
                zIndex: 999
            }}
        >
            <Grid container sx={{ p: 1 }}>
                <Grid item xs={7} md={10}>
                    <Typography variant="h3" fontWeight={"bold"}>
                        Cart: € {totalCartPrice}
                    </Typography>
                </Grid>
                <Grid item xs={5} md={2} sx={{margin:"auto"}}>
                    <Button
                        onClick={handleClick}
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        {expanded ? "Hide" : "Show more"}
                    </Button>
                </Grid>
            </Grid>
            {expanded && (
                <Grid container justifyContent={"space-between"} spacing={1} columns={{ xs: 1, md: 13 }} sx={{ pl: 2, pr: 1, pt: 1, pb: 1 }}>
                    <Grid item xs={1} md={4}
                        sx={{
                            border: "1px solid white",
                            borderRadius: "1rem",
                            p: 1,
                        }}
                    >
                        <Typography textAlign={"center"} fontWeight={"bold"}>
                            Flight info
                        </Typography>
                        <Grid container justifyContent={"space-between"} columns={{ xs: 2}}>
                            <Grid item xs={1}>
                                <Typography>
                                    From: {props.formData.airportFrom}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography>
                                    To: {props.formData.airportTo}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography>
                                    Flight: {props.selectedDepartureFlight[0]}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography>
                                    Price:
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    {props.selectedDepartureFlight && (
                        <Grid item xs={1} md={4}
                            sx={{
                                border: "1px solid white",
                                borderRadius: "1rem",
                                p: 1
                            }}
                        >
                            <Typography textAlign={"center"} fontWeight={"bold"}>
                                Passenger info
                            </Typography>
                            <Typography>
                                • {props.formData.adults} x {props.formData.adults > 1 ? "adults" : "adult"}
                            </Typography>
                            {(props.formData.children || props.formData.children > 0) && (<Typography>
                                • {props.formData.children} x {props.formData.children > 1 ? "children" : "child"}
                            </Typography>)}
                        </Grid>
                    )}
                    {props.selectedSeatsDeparture && (
                        <Grid item xs={1} md={4}
                            sx={{
                                border: "1px solid white",
                                borderRadius: "1rem",
                                p: 1
                            }}
                        >
                            <Typography textAlign={"center"} fontWeight={"bold"}>
                                Seats info
                            </Typography>
                            {props.selectedSeatsDeparture.map((seat, index) => (
                                <Typography key={`seat-${index}`}>
                                    • € {seat.seatPrice} - Seat {seat.seatNumber}
                                </Typography>
                            ))}
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
};

export default Cart;