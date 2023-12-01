import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography
} from "@mui/material";

const Loading = () => {
  const { state } = useLocation();
  const navigateTo = useNavigate();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log(state);
    if (state.res.success) {
      setSuccess(true);
    }
  }, [state])

  if (success) {
    return (
      <Container maxWidth={"lg"}>
        <Typography variant="h2" fontWeight={"bold"}>
          Congratulations!
          <br />
          {state.res.returningBooking ? 
          "Booking accepted for departure with id: and arrival with id: " : 
          "Booking accepted for only departure flight with id: "}
        </Typography>
      </Container>
    )
  } else {
    return (
      <Container maxWidth={"lg"}>
        <Typography variant="h2" fontWeight={"bold"}>
          Congratulations!
          <br />
          {state.res.returningBooking ? 
          "Booking accepted for departure with id: and arrival with id: " : 
          "Booking accepted for only departure flight with id: "}
        </Typography>
      </Container>
    )
  }
}

export default Loading;