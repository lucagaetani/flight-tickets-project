import React, {useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Container,
  Grid
} from '@mui/material';

const BookingForm = () => {
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!formData.password) {
        newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log('Form data submitted:', formData);
      navigateTo('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container maxWidth="md" sx={{mt: 3, mb: 3}}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField
              label="Email"
              variant="outlined"
              name="departingDate"
              fullWidth
              value={formData.departingDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.departingDate}
              helperText={errors.departingDate}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              name="password"
              fullWidth
              value={formData.departingDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.departingDate}
              helperText={errors.departingDate}
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
