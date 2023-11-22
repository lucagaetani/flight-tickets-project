import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";

const LuggageUserInfo = () => {
  const { state } = useLocation();

  useEffect(() => {
  }, [])

  return (
    <Container maxWidth="lg">
      <Box sx={{
        width: "100%", height: "100%", border: "1px solid #C4C4C4",
        borderRadius: "1rem", minHeight: "150px", mt: 2, pt: "0px !important", pl: "0px !important"
      }}>
        <Typography variant="h5" sx={{ p: 2, borderBottom: "1px solid #C4C4C4" }}>
          {`Write user info and choose luggage for each passenger`}
        </Typography>


      </Box>
    </Container>
  );
};

export default LuggageUserInfo;