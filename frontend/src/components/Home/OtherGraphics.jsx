import { Box, Container, Grid, Typography } from "@mui/material";

const OtherGraphics = () => {
  return (
    <Box>
        <Container 
            maxWidth="lg"
            sx={{
                fontFamily: "sans-serif",
                border: "1px solid #344955",
                borderRadius: "1rem",
                backgroundColor: "#344955",
                color: "#f9aa33",
                fontWeight: "bold",
                fontSize: "25px",
            }}
        >
        <Grid container>
          <Grid item xs={3} sx={{pt: 5, pb: 5}}>
            {"Easier Travel."}
            <br />
            {"Zero Problems."}
          </Grid>
          <Grid item xs={4} sx={{border: "1px solid #232f34", borderRadius: "1rem", margin:2, pt: 5, pb: 5}}>
            b
          </Grid>
          <Grid item xs={4} sx={{border: "1px solid #232f34", borderRadius: "1rem", margin:2, pt: 5, pb: 5}}>
            c
          </Grid>
        </Grid>
        </Container>

        <Typography variant="h5" fontWeight={"bold"}>
            Explore this beautiful cities!
        </Typography>
    </Box>
  );
};

export default OtherGraphics;