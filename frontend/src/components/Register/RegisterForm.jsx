import {useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Container,
  Grid,
  Typography
} from '@mui/material';
import validator from 'validator';
import DefaultDialog from "../DefaultDialog";
import { useSelector } from "react-redux";

const BookingForm = () => {
  const navigateTo = useNavigate();
  const [titleDialog, setTitleDialog] = useState("");
  const userData = useSelector((state) => state.userData);
  const [contentDialog, setContentDialog] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: ''
  });

  useEffect(() => {
    if (userData) {
      navigateTo("/");
    }
  }, [navigateTo, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.surname) {
      newErrors.surname = "Surname is required";
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!validator.isEmail(formData.email)){
      newErrors.email = 'Please insert a valid email';
    }
    if (!formData.password) {
        newErrors.password = 'Password is required';
    }
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        body: JSON.stringify(formData)
      };
      (async () => {
        try {
          const response = await fetch("http://localhost:3000/users/registerUser", requestOptions);
          const res = await response.json();
          if (res.success) {
            navigateTo('/');
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
  };

  return (
    <Box height="80vh" display="flex">
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} />
      <form onSubmit={handleSubmit} style={{margin: "auto", p: 20}}>
        <Container maxWidth="xs" sx={{mt: 3, mb: 3}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{mt: 2, mb: 1}} textAlign={"center"} fontWeight={"bold"}>
                Register
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="text"
                variant="outlined"
                name="email"
                fullWidth
                defaultValue={null}
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                name="password"
                fullWidth
                defaultValue={null}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Name"
                type="text"
                variant="outlined"
                name="name"
                fullWidth
                defaultValue={null}
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Surname"
                type="text"
                variant="outlined"
                name="surname"
                fullWidth
                defaultValue={null}
                value={formData.surname}
                onChange={handleChange}
                error={!!errors.surname}
                helperText={errors.surname}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{height: "50px"}}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Container>
      </form>
    </Box>
  );
};

export default BookingForm;