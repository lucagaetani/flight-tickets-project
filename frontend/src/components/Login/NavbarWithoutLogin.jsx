import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";


const NavbarWithoutLogin = () => {
  const navigateTo = useNavigate();

  const goToHome = () => {
    navigateTo("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={goToHome}>
            Booking Flight Tickets
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavbarWithoutLogin;
