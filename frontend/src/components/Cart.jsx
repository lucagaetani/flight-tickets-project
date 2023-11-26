import {
    Container,
    Box,
    Grid,
    Typography
} from "@mui/material";
import PropTypes from 'prop-types';
import { useEffect } from "react";

const Cart = (props) => {

    useEffect(() => {
        console.log(props)
    },[props])

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
                width: "100%"
            }}
        >
            <Typography variant="h3" fontWeight={"bold"} sx={{ml: 1}}>
                Cart
            </Typography>
            <Grid container justifyContent={"space-between"} spacing={1} columns={{xs:6, md: 13}} p={1}>
                <Grid item xs={2.5} md={4}
                    sx={{
                        border: "1px solid white",
                        borderRadius: "1rem",
                        p: 1,
                    }}
                >
                    <Typography textAlign={"center"} fontWeight={"bold"}>
                        Flight info
                    </Typography>
                    <Grid container justifyContent={"space-between"} columns={{xs:1, md: 4}}>
                        <Grid item xs={1} md={2}>
                            <Typography>
                                From: {props.formData.airportFrom}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={2}>
                            <Typography>
                                To: {props.formData.airportTo}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={2}>
                            <Typography>
                                Flight: {props.selectedDepartureFlight[0]}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={2}>
                            <Typography>
                                Price: {props.formData.price}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2.5} md={4}
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
                        {props.formData.adults} x {props.formData.adults > 1 ? "adults" : "adult"} 
                    </Typography>
                    {props.formData.children && props.formData.children > 0 && (<Typography>
                        {props.formData.children} x {props.formData.children > 1 ? "children" : "child"} 
                    </Typography>)}
                </Grid>
                <Grid item xs={2.5} md={4}
                    sx={{
                        border: "1px solid white",
                        borderRadius: "1rem",
                        p: 1
                    }}
                >
                    <Typography textAlign={"center"} fontWeight={"bold"}>
                        Seats info
                    </Typography>
                    <Typography>
                        {props.formData.adults} x {props.formData.adults > 1 ? "adults" : "adult"} 
                    </Typography>
                    {props.formData.children && props.formData.children > 0 && (<Typography>
                        {props.formData.children} x {props.formData.children > 1 ? "children" : "child"} 
                    </Typography>)}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Cart;