import { AppBar, Box, Toolbar, Typography, Button, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from "react";
import DefaultDialog from "./DefaultDialog";

const Navbar = () => {
  const navigateTo = useNavigate();
  const [showUser, setShowUser] = useState(false);
  let userData = JSON.parse(localStorage.getItem("reduxState")) ? JSON.parse(localStorage.getItem("reduxState")).userData : null;
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const containerRef = useRef(null);

  const handleShowUser = () => {
    setShowUser((prev) => (!prev));
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

    (async () => {
      try {
        const response = await fetch("http://localhost:3000/users/logout", requestOptions, {
          credentials: "same-origin",
        });
        const res = await response.json();
        if (res.success) {
          localStorage.removeItem("reduxState");
          {
            window.location.reload(false);
          }
        }
      } catch(error) {
        setTitleDialog("Error");
        setContentDialog(`Error received: ${error}`);
        setOpenDialog(true);
      }
    })();
  };

  const handleLogin = () => {
    navigateTo("/login");
  };

  const goToHome = () => {
    navigateTo("/");
  };

  return (
    <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} handleOkButton={() => navigateTo("/")} />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ cursor: "pointer" }} onClick={goToHome}>
            <FontAwesomeIcon icon={faPlaneDeparture} /> flyTo
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
          </Box>
          {userData ? (
            <>
              <Box sx={{ overflow: "hidden" }} container={containerRef}>
                <Slide direction="left" in={showUser} mountOnEnter unmountOnExit container={containerRef.current}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
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
              </Box>
              <Typography variant="body1" component="div" sx={{ cursor: "pointer", ":hover": { opacity: "0.8" } }} onClick={handleShowUser}>
                Hey, {userData.name + " " + userData.surname}!
              </Typography>
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