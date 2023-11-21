import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';


const NavbarWithoutLogin = () => {
  const navigateTo = useNavigate();

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
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavbarWithoutLogin;
