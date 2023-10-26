import {useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUserData } from '../redux/actions';
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Link
} from '@mui/material';

const LoginForm = () => {
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  
  useEffect(() => {
    fetch("http://localhost:3000/auth", {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(res => {
      if (res.success === true) {
        navigateTo('/')
      }
    })
    .catch(error => {
      {alert(`Error: ${error}. Can't do fetch of auth. Page rendered`)};
    })
  }, []);

  const handleDispatch = (data) => {
    dispatch(addUserData(data));
  }

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
      const requestOptions = {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      };
      fetch("http://localhost:3000/users/login", requestOptions, {credentials: "same-origin"})
      .then(response => response.json())
      .then(res => {
        if (res.success === true) {
          {alert(`${res.message}. You will be redirect to the homepage`)};
          handleDispatch(res.data);
          navigateTo('/');
        }
        else {
          {alert(`Error received: ${res.message}. You will be redirect to the homepage`)};
        }
      })
      .catch(error => {
        {alert(`Error: ${error}. Can't do fetch`)};
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
          <Grid item xs={12} sx={{display: "grid", justifyContent: "center"}}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" textAlign="center" >
            {"...or if you want, you can "}
              <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    navigateTo("/register");
                  }}
                  align="inherit"
                >
                register
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

export default LoginForm;
