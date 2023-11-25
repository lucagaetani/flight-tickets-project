import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUserData } from "../../redux/actions";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Link,
  Box,
  CircularProgress
} from "@mui/material";

const LoginForm = () => {
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };
    (async () => {
      try {
        const response = await fetch("http://localhost:3000/auth", requestOptions);
        const res = await response.json();
          if (res.success === true) {
            navigateTo("/");
          }
      } catch(error) {
        alert(`Error: ${error}. Can't do fetch of auth. Page rendered`);
      }
    })();
    setLoading(false);
  }, []);

  const handleDispatch = (data) => {
    dispatch(addUserData(data));
  };

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
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const requestOptions = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };
      fetch("http://localhost:3000/users/login", requestOptions, {
        credentials: "same-origin",
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            {
              alert(`${res.message}. You will be redirect to the homepage`);
            }
            handleDispatch(res.data);
            navigateTo("/");
          } else {
            {
              alert(
                `Error received: ${res.message}. You will be redirect to the homepage`
              );
            }
          }
        })
        .catch((error) => {
          {
            alert(`Error: ${error}. Can't do fetch`);
          }
        });
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: "flex",
        height: "80vh"
      }}>
        <CircularProgress sx={{
          margin: "auto"
        }} />
      </Box>
    )
  }

  return (
    <Box height="80vh" display="flex">
      <form onSubmit={handleSubmit} style={{margin: "auto"}}>
        <Container maxWidth="xs" sx={{ mt: 6, mb: 3, border: "1px solid #C4C4C4", borderRadius: "1rem" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3" sx={{mt: 2}} textAlign={"center"} fontWeight={"bold"}>
                Login
              </Typography>
            </Grid>
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
            <Grid item xs={12} sx={{ display: "grid", justifyContent: "center" }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography variant="body2" textAlign="center">
                {"...or if you want, you can "}
                <Link
                  component="button"
                  variant="body2"
                  sx={{ verticalAlign: "top !important" }}
                  onClick={() => {
                    navigateTo("/register");
                  }}
                  align="inherit"
                >
                  register
                </Link>
                {" here"}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </form>
    </Box>
  );
};

export default LoginForm;
