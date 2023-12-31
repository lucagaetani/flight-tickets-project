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
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import DefaultDialog from "../DefaultDialog";
import validator from 'validator';
import UserPageRow from "./UserPageRow";
import { addUserData, deleteUserData } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name || "",
    surname: userData.surname || "",
    email: userData.email || "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

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
  
  /**
   * If called, it opens the dialog to ask for the current password
  */
  const handleClickOpen = () => {
    setOpenPasswordDialog(true);
  };

  /**
   * If called, it closes the dialog to ask for the current password
  */
  const handleClose = () => {
    setOpenPasswordDialog(false);
  };

  /**
   * Handles the check password form for the current password.
   * 
   * When you have inserted a string onto the "current password" field, it will call the REST API that checks if the password is correct or not.
   * If correct, it will set the oldPasswordChecked state to true (and then you can edit the user info), but if not, it will set oldPasswordChecked to false.
  */
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
      setOldPasswordChecked(false);
      setOldPasswordError({
        currentPassword: "Password doesn't match"
      });
    }
  }

  /**
   * Handles the form submission.
   * 
   * If any field is empty, it will show a helperText with the "error" clause.
   * If you're changing the password, it will trigger a Dialog message that will ask for the current password.
   * If you aren't changing the password, it will submit the form, calling the REST API that handles the modification of the user's info.
  */
  const handleSubmit = async () => {
    //It creates a new object, newErrors, that serves as an accumulator of "errors" to show in their respective fields.
    const newErrors = {};
    //If name is empty
    if (!formData.name) {
      newErrors.airportFrom = "Name is required";
    }
    //If surname is empty
    if (!formData.surname) {
      newErrors.airportTo = "Surname is required";
    }
    //If email is empty
    if (!formData.email) {
      newErrors.departingDate = "Email is required";
    }
    //It checks if the inserted string on email field is really an email
    if (!validator.isEmail(formData.email)) {
      newErrors.email = "Insert a valid email";
    }
    //It checks if the inserted password is strong enough to be changed
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

    //If there's an error, it will show up on their respective fields. Otherwise, it checks if password has to be changed.
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      //If password has to be changed, it launches the dialog to ask for the current one.
      //If oldPasswordChecked is set on true, it means that the user inserted the correct password and then it can be changed
      if (formData.password && !oldPasswordChecked) {
        handleClickOpen();
      } else {
        try {
          //It launches a POST request to the REST API "users/editUser"
          const userToEdit = {
            name: formData.name,
            surname: formData.surname,
            newEmail: formData.email,
            oldEmail: userData.email,
            password: formData.password
          }

          /**
           * requestOptions are the options inserted onto the request of the API.
           * method: "POST" is the method of the request
           * headers: { "Content-Type": "application/json" } is the header that will be sent onto the request.
           * credentials: "include" it means that the request is sent with cookies, so only a logged user can send it
           * body: JSON.stringify(formData) is the body of the request
           */
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(userToEdit)
          };
          const url = `http://localhost:3000/users/editUser`;
          const response = await fetch(url, requestOptions);
          const res = await response.json();
          if (res.success) {
            dispatch(addUserData(res.data));
            setShowAlert(true);
            //If you change email or password, you will be logged out
            if (formData.email !== userData.email || formData.password) {
              const response = await fetch("http://localhost:3000/users/logout", requestOptions, {
                credentials: "same-origin",
              });
              const res = await response.json();
              if (res.success) {
                dispatch(deleteUserData());
              }
              navigateTo("/login");
            }
          } else {
            setTitleDialog("Error");
            setContentDialog(res.message);
            setOpenDialog(true);
          }
        } catch (error) {
          setTitleDialog("Error");
          setContentDialog(`Error fetching data: ${error}`);
          setOpenDialog(true);
        }
      }
    }

  }

  //If the page hasn't finished with loading data from backend, it will show a loading circle
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
            <Typography>
              If you change email or password, you will be logged out. Bookings will have your new email.
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password" error={!!errors.password}>Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    onBlur={handleChange}
                    error={!!errors.password}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={() => setShowPassword(true)}
                          edge="end"
                        >
                          {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {!!errors.password && (
                    <FormHelperText error={!!errors.password}>{errors.password}</FormHelperText>
                  )}
                </FormControl>
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
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password" error={!!oldPasswordError.currentPassword}>Current Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              name="currentPassword"
              onBlur={handleCheckPassword}
              error={!!oldPasswordError.currentPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={() => setShowPassword(true)}
                    edge="end"
                  >
                    {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                  </IconButton>
                </InputAdornment>
              }
              label="Current password"
            />
            {!!oldPasswordError.currentPassword && (
              <FormHelperText error={!!oldPasswordError.currentPassword}>{oldPasswordError.currentPassword}</FormHelperText>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Edit User</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={showAlert} autoHideDuration={3000} onClose={() => {setShowAlert(false)}} sx={{ width: '95%' }}>
        <Alert severity="success" sx={{ width: '100%' }}>
          User successfully edited!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserPageComponent;