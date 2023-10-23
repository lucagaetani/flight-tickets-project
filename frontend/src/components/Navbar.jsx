import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

const Navbar = () => {
  return (
    <AppBar>
      <Toolbar>
        <img src="/logo.png" alt="Logo" />
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
