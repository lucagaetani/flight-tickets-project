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
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from "@mui/material";
import DefaultDialog from "../DefaultDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

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

  useEffect(() => {
    console.log(formData);
  }, [formData])

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
            setContentDialog(`${res.message}`);
            setOpenDialog(true);
          }
        } catch(error) {
          setTitleDialog("Error");
          setContentDialog(`Error fetching data: ${error}`);
          setOpenDialog(true);
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
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} />
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
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password" error={!!errors.password}>Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={handleChange}
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
