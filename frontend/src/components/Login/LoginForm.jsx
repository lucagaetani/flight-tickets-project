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
import DefaultDialog from "../DefaultDialog";

const LoginForm = () => {
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (contentDialog) {
      setOpenDialog(true);
    }
  }, [contentDialog]);

  useEffect(() => {
    if (localStorage.getItem("reduxState")) {
      navigateTo("/");
    }
    setLoading(false);
  }, [navigateTo]);

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
      (async () => {
        try {
          const requestOptions = {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          };
          const response = await fetch("http://localhost:3000/users/login", requestOptions, {
            credentials: "same-origin",
          });
          const res = await response.json()
          if (res.success) {
            handleDispatch(res.data);
            navigateTo("/");
          } else {
            setTitleDialog("Error");
            setContentDialog(`Error: ${res.message}}`);
          }
        } catch(error) {
          setTitleDialog("Error");
          setContentDialog(`Error fetching data: ${error}`);
        }
      })();
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
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} />
      <form onSubmit={handleSubmit} style={{margin: "auto", p: 20}}>
        <Container maxWidth={'xs'} sx={{ mt: 6, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{mt: 2, mb: 1}} textAlign={"center"} fontWeight={"bold"}>
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
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{height: "50px"}}>
                Submit
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography variant="body2" textAlign="center">
                {"Don't have an account? "}
                <Link
                  component="button"
                  variant="body2"
                  sx={{ verticalAlign: "top !important", textDecoration: "none !important" }}
                  onClick={() => {
                    navigateTo("/register");
                  }}
                  align="inherit"
                >
                  Sign up
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </form>
    </Box>
  );
};

export default LoginForm;
