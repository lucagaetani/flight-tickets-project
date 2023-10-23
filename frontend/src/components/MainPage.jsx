import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MainPage = () => {
  return (
    <Box sx={
        {
            mt: 5,
            textAlign: "center",
            width: "100%",
            height: "100%",
            backgroundColor: grey
        }
    }>
      <Typography variant="body2">
        Made by Luca Gaetani
      </Typography>
    </Box>
  );
};

export default MainPage;
