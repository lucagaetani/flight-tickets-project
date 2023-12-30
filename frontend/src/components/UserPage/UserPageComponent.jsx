import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Container,
  TextField,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useSelector } from "react-redux";
import DefaultDialog from "../DefaultDialog";
import validator from 'validator';
import UserPageRow from "./UserPageRow";

const UserPageComponent = () => {
  const [selectedBookings, setSelectedBookings] = useState(true);
  const [errors, setErrors] = useState({});
  const [oldPasswordError, setOldPasswordError] = useState({});
  const [bookingRows, setBookingRows] = useState([]);
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const userData = useSelector((state) => state.userData);
  const [oldPasswordChecked, setOldPasswordChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    surname: userData.surname,
    email: userData.email,
    password: "",
  });

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
          setLoading();
        } catch (error) {
          setTitleDialog("Error");
          setContentDialog(`Error fetching data: ${error}`);
          setOpenDialog(true);
          setLoading();
        }
      })();
    }
  }, [selectedBookings, userData]);

  useEffect(() => {
    console.log(formData);
  },[formData])

  const handleBookings = () => {
      setSelectedBookings(true);
  }

  const handleEdit = () => {
    setSelectedBookings(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };
  

  const handleClickOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handleClose = () => {
    setOpenPasswordDialog(false);
  };

  const handleCheckPassword = async (e) => {
    const { value } = e.target;
    const passwordToSend = {
      email: userData.email,
      password: value
    };
    console.log(passwordToSend);
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    const url = `http://localhost:3000/users/checkPassword?state=${encodeURIComponent(
      JSON.stringify(passwordToSend)
    )}`;
    const response = await fetch(url, requestOptions);
    const res = await response.json();
    if (res.success) {
      setOldPasswordChecked(true);
      setOldPasswordError({});
    } else {
      setOldPasswordError({
        currentPassword: "Password doesn't match"
      });
    }
  }

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.airportFrom = "Name is required";
    }
    if (!formData.surname) {
      newErrors.airportTo = "Surname is required";
    }
    if (!formData.email) {
      newErrors.departingDate = "Email is required";
    }
    if (!validator.isEmail(formData.email)) {
      newErrors.email = "Insert a valid email";
    }
    if (formData.password){
      if (
        !validator.isStrongPassword(
        formData.password, 
        { 
          minLength: 8, minLowercase: 1, 
          minUppercase: 1, minNumbers: 2, minSymbols: 2 
        })
      )
      {
        newErrors.password = 'Password requires at least 8 characters, 1 lowercase, 1 uppercase, 2 numbers and 2 symbols';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      if (formData.password) {
        handleClickOpen();
      }
    }

  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "80vh",
        }}
      >
        <CircularProgress
          sx={{
            margin: "auto",
          }}
        />
      </Box>
    );
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
        <Grid item xs={1} md={1} justifyContent={"center"} display={"flex"}>
          <Button
            onClick={handleBookings}
            sx={{ mt: 3, mr: 1 }}
            variant="contained"
            color="primary"
          >
            Bookings
          </Button>
        </Grid>
        <Grid item xs={1} md={1} justifyContent={"center"} display={"flex"}>
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
          <>
            <Grid item xs={2} md={2} sx={{ borderBottom: "1px solid #C4C4C4", mt: 2 }}>
              <Typography variant="h5">
                Flights booked
              </Typography>
            </Grid>
            {bookingRows.length === 0 ? (
              <Box
              sx={{
                display: "flex",
                height: "65vh",
                margin: "auto"
              }}
            >
              <Typography sx={{ margin: "auto" }}>
                No rows retrieved
              </Typography>
            </Box>
            ) : (
              bookingRows.map((row,index) => (
                <Grid item xs={2} md={2} sx={{ mt: 2 }} key={"booking"+index}>
                  <UserPageRow 
                    row={row}
                    index={index}
                  />
                </Grid>
              ))
            )}
          </>
        ) : (
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
                  name="name"
                  fullWidth
                  onBlur={handleChange}
                  defaultValue={formData.name}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={2} md={1}>
                <TextField
                  label="Surname"
                  type="text"
                  name="surname"
                  fullWidth
                  defaultValue={formData.surname}
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
                  defaultValue={formData.email}
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
                  onBlur={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={2} md={2} sx={{ display: "flex", justifyContent:"center" }}>
                  <Button
                    onClick={handleSubmit}
                    sx={{ mt: 3, mr: 1 }}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      <Dialog open={openPasswordDialog} onClose={handleClose}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              You want to change your password. Insert your current one.
            </Typography>
          </DialogContentText>
          <TextField
            sx={{ mt: 2 }}
            label="Current password"
            type="password"
            name="currentPassword"
            fullWidth
            onBlur={handleCheckPassword}
            error={!!oldPasswordError.currentPassword}
            helperText={oldPasswordError.currentPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Edit User</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserPageComponent;