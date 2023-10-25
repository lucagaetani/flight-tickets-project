import {useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Grid
} from '@mui/material';
import validator from 'validator';

const BookingForm = () => {
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {

  }, []);

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
        body: JSON.stringify(formData)
      };
      fetch("http://localhost:3000/users/registerUser", requestOptions)
      .then(response => response.json())
      .then(res => {
        if (res.success === true) {
          {alert(`${res.message}. You will be redirect to the homepage in 2 seconds...`)};
          navigateTo('/');
        }
        else {
          {alert(`Error received: ${res.message}. You will be redirect to the homepage in 2 seconds...`)};
          navigateTo('/');
        }
      })
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container maxWidth="xs" sx={{mt: 3, mb: 3}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="text"
              variant="outlined"
              name="email"
              fullWidth
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
              value={formData.surname}
              onChange={handleChange}
              error={!!errors.surname}
              helperText={errors.surname}
            />
          </Grid>
          <Grid item xs={12} sx={{display: "grid", justifyContent: "center"}}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

export default BookingForm;