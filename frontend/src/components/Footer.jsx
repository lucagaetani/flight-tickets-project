import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box sx={{
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#EAEDF2",
      position: "absolute",
      bottom: 0,
      WebkitFlexDirection: "column",
      width: "100%",
      boxSizing: "border-box",
      left: 0,
    }}>
      <Typography variant="body2">
        Made by Luca Gaetani
      </Typography>
    </Box>
  );
};

export default Footer;
