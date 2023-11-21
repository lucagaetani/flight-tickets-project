import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigateTo = useNavigate();
  let userData =
    useSelector((state) => state.userData) !== null
      ? useSelector((state) => state.userData)
      : JSON.parse(localStorage.getItem("reduxState"))
      ? JSON.parse(localStorage.getItem("reduxState")).userData
      : null;
  console.log(userData);

  const handleLogout = () => {
    localStorage.removeItem("reduxState");
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("http://localhost:3000/users/logout", requestOptions, {
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(JSON.stringify(res));
        if (res.success === true) {
          {
            alert(
              "You correctly logout from the site and will be redirected to the homepage"
            );
          }
          {
            window.location.reload(false);
          }
          navigateTo("/");
        } else {
          {
            alert(
              `Error received: ${res.message}. You will be redirect to the homepage`
            );
          }
          navigateTo("/");
        }
      });
  };

  const handleLogin = () => {
    navigateTo("/login");
  };

  const goToHome = () => {
    navigateTo("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ cursor: "pointer" }} onClick={goToHome}>
            <FontAwesomeIcon icon={faPlaneDeparture} /> flyTo
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
          </Box>
          {console.log(userData)}
          {userData ? (
            <>
              <Typography variant="body1" component="div">
                Hey, {userData.name + " " + userData.surname}!
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;