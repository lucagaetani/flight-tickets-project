import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendDown, faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import { Box, Container, Grid, Typography } from "@mui/material";

const OtherGraphics = () => {
  return (
    <Box>
        <Container 
            maxWidth="lg"
            sx={{
                fontFamily: "inherit",
                border: "1px solid #3066BE",
                borderRadius: "1rem",
                backgroundColor: "#3066BE",
                fontWeight: "bold",
                fontSize: "25px",
            }}
        >
        <Grid container>
          <Grid item xs={3} sx={{pt: 5, pb: 5, margin: "auto"}}>
            <Typography variant='h5' fontWeight={"bold"}>
              Easier travel.
            </Typography>
            <Typography variant='h5' fontWeight={"bold"}>
            Zero problems.
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{border: "1px solid #B4C5E4", borderRadius: "1rem", margin:2, pt: 5, pb: 5, display: "flex", backgroundColor: "#B4C5E4"}}>
            <Box sx={{width: "35%",  display: "inherit", justifyContent: "center", margin: "auto"}}>
              <FontAwesomeIcon icon={faArrowTrendDown} />
            </Box>
            <Box sx={{width: "65%"}}>
              <Typography variant='h5' fontWeight={"bold"}>
                lowest prices
              </Typography>
              <Typography>
                with our special algorithm
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{border: "1px solid #B4C5E4", borderRadius: "1rem", margin:2, pt: 5, pb: 5, display: "flex", backgroundColor: "#B4C5E4"}}>
            <Box sx={{width: "35%",  display: "inherit", justifyContent: "center", margin: "auto"}}>
              <FontAwesomeIcon icon={faMoneyBill} />
            </Box>
            <Box sx={{width: "65%"}}>
              <Typography variant='h5' fontWeight={"bold"}>
                save up to 15%
              </Typography>
              <Typography>
                with your fidelity points
              </Typography>
            </Box>
          </Grid>
        </Grid>
        </Container>

        <Container 
            maxWidth="lg"
            sx={{
                fontFamily: "sans-serif",
                fontWeight: "bold",
                fontSize: "25px",
                mt: 3,
                paddingLeft: "0px !important",
                paddingRight: "0px !important"
            }}
        >
        <Typography variant="h5" fontWeight={"bold"}>
            Explore this beautiful cities!
        </Typography>
        <Grid container sx={{ display: "flex", justifyContent: "center"}}>
          <Grid item xs={3.5} sx={{border: "1px solid #C4C4C4", borderRadius: "1rem", margin:2}}>
            <Box
              component="img"
              sx={{
                height: "70%",
                width: "100%",
                objectFit: "cover",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem"
              }}
              alt="Departing"
              src="./src/assets/venice.jpg"
            >

            </Box>
            <Box 
              sx={{
                height: "30%",
                pl: 2
              }}
            >
              <Typography variant='h6' fontWeight={"bold"}>
                Venice
              </Typography>
              <Typography>
                Italy
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3.5} sx={{border: "1px solid #C4C4C4", borderRadius: "1rem", margin:2}}>
            <Box
              component="img"
              sx={{
                height: "70%",
                width: "100%",
                objectFit: "cover",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem"
              }}
              alt="Departing"
              src="./src/assets/berlin.jpg"
            >

            </Box>
            <Box 
              sx={{
                height: "30%",
                pl: 2
              }}
            >
              <Typography variant='h6' fontWeight={"bold"}>
                Berlin
              </Typography>
              <Typography>
                Germany
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3.5} sx={{border: "1px solid #C4C4C4", borderRadius: "1rem", margin:2}}>
            <Box
              component="img"
              sx={{
                height: "70%",
                width: "100%",
                objectFit: "cover",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem"
              }}
              alt="Departing"
              src="./src/assets/barcelona.jpg"
            >

            </Box>
            <Box 
              sx={{
                height: "30%",
                pl: 2
              }}
            >
              <Typography variant='h6' fontWeight={"bold"}>
                Barcelona
              </Typography>
              <Typography>
                Spain
              </Typography>
            </Box>
          </Grid>
        </Grid>
        </Container>
        <Container 
            maxWidth="lg"
            sx={{
                fontFamily: "sans-serif",
                border: "1px solid #C4C4C4",
                borderRadius: "1rem",
                mt: 3,
                paddingLeft: "0px !important",
                paddingRight: "0px !important",
                display: "flex"
            }}
        >
          <Box
              component="img"
              sx={{
                width: "30%",
                objectFit: "cover",
                borderTopLeftRadius: "1rem",
                borderBottomLeftRadius: "1rem"
              }}
              alt="Departing"
              src="./src/assets/holiday.jpg"
          >

          </Box>
          <Box
            sx={{
              width: "70%",
              padding: 2
            }}
          >
            <Typography variant='h3' fontWeight={"bold"}>
              want more?
            </Typography>
            <Typography sx={{mt: 2}}>
            Download the official flyTo app and save on hundreds of flights, get discounts and double points on selected flights, and manage your bookings wherever and whenever you want!
            </Typography>
          </Box>
        </Container>
    </Box>
  );
};

export default OtherGraphics;