import { AppBar, Box, Toolbar, Typography, Button, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from "react";

const Navbar = () => {
  const navigateTo = useNavigate();
  const [showUser, setShowUser] = useState(false);
  let userData = JSON.parse(localStorage.getItem("reduxState")) ? JSON.parse(localStorage.getItem("reduxState")).userData : null;
  const containerRef = useRef(null);

  const handleShowUser = () => {
    setShowUser(!showUser);
  }

  const handleOpenProfile = () => {
    navigateTo("/user");
  }

  const handleLogout = () => {
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
          localStorage.removeItem("reduxState");
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
              <Typography variant="body1" component="div" sx={{ cursor: "pointer" }} onClick={handleShowUser} ref={containerRef}>
                  Hey, {userData.name + " " + userData.surname}!
              </Typography>
              {showUser && (
                <Slide direction="left" in={showUser} mountOnEnter unmountOnExit>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    ref={containerRef}
                  >
                    <Button
                      color="inherit"
                      onClick={handleOpenProfile}
                      sx={{ marginLeft: 2 }}
                    >
                      Open profile
                    </Button>
                    <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 2 }}>
                      Logout
                    </Button>
                  </Box>
                </Slide>
              )}
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