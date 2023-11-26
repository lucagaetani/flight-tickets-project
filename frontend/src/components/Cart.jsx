import {
    Container,
    Box,
    Grid
} from "@mui/material";
import Typography from "@mui/material/Typography";

const Cart = (props) => {
    return (
        <Box
            sx={{
                backgroundColor: "#000",
                color: "white",
                width: "100%"
            }}
        >
            <Typography variant="h3" fontWeight={"bold"}>
                Cart
            </Typography>
            <Grid container sx={{p: 2}}>
                <Grid item xs={4}
                    sx={{
                        border: "1px solid white",
                        borderRadius: "1rem",
                        p: 1
                    }}
                >
                    <Typography textAlign={"center"} fontWeight={"bold"}>
                        Flight info
                    </Typography>
                    <Typography>
                        From: {}
                    </Typography>
                    <Typography>
                        To:
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                
                </Grid>
            </Grid>
        </Box>
    );
};

export default Cart;