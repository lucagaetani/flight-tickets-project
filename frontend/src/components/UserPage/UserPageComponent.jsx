import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Slide,
  Container,
} from "@mui/material";

const UserPageComponent = () => {
  const [selectedBookings, setSelectedBookings] = useState(true);
  const [errors, setErrors] = useState({});
  let userData = JSON.parse(localStorage.getItem("reduxState")) ? JSON.parse(localStorage.getItem("reduxState")).userData : null;

  useEffect(() => {
    //chiama api bookings
  }, [])

  const handleBookings = (string) => {
    if (string !== "bookings") {
      setSelectedBookings(false);
    }
  }

  return (
    <Container>
      <Grid container columns={{ xs: 1, md: 2}}>
        <Grid item xs={1} md={2} sx={{ borderBottom: "1px solid #C4C4C4" }}>
          <Typography variant="B">
            Hello, {userData.name} {userData.surname}
          </Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Button
            onClick={handleBookings("bookings")}
            sx={{ mt: 3, mr: 1 }}
            fullWidth
            variant="contained"
            color="primary"
          >
            Bookings
          </Button>
          <Button
            onClick={handleBookings}
            sx={{ mt: 3, mr: 1 }}
            fullWidth
            variant="contained"
            color="primary"
          >
            Edit profile
          </Button>
        </Grid>
        {selectedBookings ? (
          <Slide>
            <Grid item xs={1} md={2} sx={{ borderBottom: "1px solid #C4C4C4" }}>
              <Typography variant="B">
                Flights booked:
              </Typography>
            </Grid>
              Aggiungi i bookings
          </Slide>
        ) : (
          <Slide>
            <Grid item xs={1} md={2}>
              <Typography variant="B">
                Edit profile
              </Typography>
            </Grid>
            <Grid item xs={1} md={1}>
              <TextField
                label="Name"
                type="text"
                name={"name"}
                fullWidth
                defaultValue={null}
                onBlur={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={1} md={1}>
              <TextField
                label="Surname"
                type="text"
                name={"name"}
                fullWidth
                defaultValue={null}
                onBlur={handleChange}
                error={!!errors.surname}
                helperText={errors.surname}
              />
            </Grid>
            <Grid item xs={1} md={1}>
              <TextField
                label="Email"
                type="text"
                name="email"
                fullWidth
                defaultValue={null}
                onBlur={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={1} md={1}>
              <TextField
                label="Password"
                type="password"
                name="password"
                fullWidth
                defaultValue={null}
                onBlur={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
          </Slide>
        )}
      </Grid>
    </Container>
  );
};

export default UserPageComponent;