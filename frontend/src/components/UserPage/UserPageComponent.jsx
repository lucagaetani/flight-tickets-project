import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Slide,
  Container,
  TextField,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import DefaultDialog from "../DefaultDialog";

const UserPageComponent = () => {
  const [selectedBookings, setSelectedBookings] = useState(true);
  const [errors, setErrors] = useState({});
  const [bookingRows, setBookingRows] = useState([]);
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    if (selectedBookings) {
      (async () => {
        try {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          };
          const url = `http://localhost:3000/bookings/getBookingsForUser?state=${encodeURIComponent(
              JSON.stringify(userData.email)
          )}`;
          const response = await fetch(url, requestOptions);
          const res = await response.json();
          if (res.success) {
            setBookingRows(res.data);
          } else {
            setTitleDialog("Error");
            setContentDialog(`Error: ${res.message}`);
            setOpenDialog(true);
          }
        } catch (error) {
          setTitleDialog("Error");
          setContentDialog(`Error fetching data: ${error}`);
          setOpenDialog(true);
        }
      })();
    }
  }, [selectedBookings, userData])

  const handleBookings = () => {
      setSelectedBookings(true);
  }

  const handleEdit = () => {
    setSelectedBookings(false);
  }

  const handleChange = () => {

  }

  return (
    <Container sx={{mt: 2}}>
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} />
      <Grid container columns={{ xs: 2, md: 2}}>
        <Grid item xs={2} md={2} sx={{ borderBottom: "1px solid #C4C4C4"}}>
          <Typography variant="h2">
            Hello, {userData.name} {userData.surname}
          </Typography>
        </Grid>
        <Grid item xs={1} md={1}>
          <Button
            onClick={handleBookings}
            sx={{ mt: 3, mr: 1 }}
            variant="contained"
            color="primary"
          >
            Bookings
          </Button>
        </Grid>
        <Grid item xs={1} md={1}>
          <Button
            onClick={handleEdit}
            sx={{ mt: 3, mr: 1 }}
            variant="contained"
            color="primary"
          >
            Edit profile
          </Button>
        </Grid>
        {selectedBookings ? (
          <Slide direction="up">
            <>
            <Grid item xs={2} md={2} sx={{ borderBottom: "1px solid #C4C4C4", mt: 2 }}>
              <Typography variant="h5">
                Flights booked
              </Typography>
            </Grid>
            {bookingRows && bookingRows.map((row,index) => (
              <Grid item xs={2} md={2} sx={{ mt: 2 }} key={"booking"+index}>
                <Paper>
                  <Grid container columns={{ xs: 2, md: 4 }} sx={{ p: 2 }}>
                    <Grid item xs={1} md={1}>
                      <Typography>
                        {row.id}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
            </>
          </Slide>
        ) : (
          <Slide direction="up">
            <>
            <Grid item xs={2} md={2} sx={{ borderBottom: "1px solid #C4C4C4", mt: 2 }}>
              <Typography variant="h5">
                Edit profile
              </Typography>
            </Grid>
            <Grid item xs={2} md={2} sx={{ mt: 1, mb: 2 }}>
              <Typography>
                Here you can change profile name, surname, email or password.
              </Typography>
            </Grid>
            <Grid container columns={{ xs: 1, md: 2 }} spacing={1}>
              <Grid item xs={2} md={1}>
                <TextField
                  label="Name"
                  type="text"
                  name={"name"}
                  fullWidth
                  defaultValue={userData.name}
                  onBlur={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={2} md={1}>
                <TextField
                  label="Surname"
                  type="text"
                  name={"name"}
                  fullWidth
                  defaultValue={userData.surname}
                  onBlur={handleChange}
                  error={!!errors.surname}
                  helperText={errors.surname}
                />
              </Grid>
              <Grid item xs={2} md={1}>
                <TextField
                  label="Email"
                  type="text"
                  name="email"
                  fullWidth
                  defaultValue={userData.email}
                  onBlur={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={2} md={1}>
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
            </Grid>
            </>
          </Slide>
        )}
      </Grid>
    </Container>
  );
};

export default UserPageComponent;