import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography
} from "@mui/material";

const End = () => {
  const { state } = useLocation();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log(state);
    if (state.res.success) {
      setSuccess(true);
    }
  }, [state])

  if (success) {
    return (
      <Box sx={{
        display: "flex",
        height: "70vh",
        pl: 3,
        pr: 3
      }}>
        <Container maxWidth={"lg"} sx={{ margin: "auto" }}>
          <Typography variant="h2" fontWeight={"bold"}>
            Congratulations!
          </Typography>
          <Typography variant="h5">
            {"Booking accepted with id: " + state.res.booking.id }
          </Typography>
          <Typography variant="h5">
            {"Go to your profile to check your bookings."}
          </Typography>
        </Container>
      </Box>
    )
  } else {
    return (
      <Box sx={{
        display: "flex",
        height: "70vh",
        pl: 3,
        pr: 3
      }}>
        <Container maxWidth={"lg"} sx={{ margin: "auto" }}>
          <Typography variant="h2" fontWeight={"bold"}>
            An error occurred!
          </Typography>
          <Typography variant="h5">
            {"Booking not accepted. Reason: " + state.res.message }
          </Typography>
          <Typography variant="h5">
            {"Please try again."}
          </Typography>
        </Container>
      </Box>
    )
  }
}

export default End;