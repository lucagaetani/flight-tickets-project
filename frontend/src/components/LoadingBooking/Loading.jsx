import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CircularProgress,
  Box
} from "@mui/material";

const Loading = () => {
  const { state } = useLocation();

  useEffect(() => {
    console.log(state);
    (async () => {
      //Check if seats are empty to book it
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      };
      const response = await fetch();
    })();
  }, [state])

  return (
    <Box sx={{
      display: "flex",
      height: "80vh"
    }}>
      <CircularProgress sx={{
        margin: "auto"
      }} />
    </Box>
  );
}

export default Loading;