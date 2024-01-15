import { useTimer } from 'react-timer-hook';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const Timer = (props) => {
  const expiryTimestamp = props.expiredTimestamp;
  const {
    seconds,
    minutes,
  } = useTimer({ expiryTimestamp, onExpire: async () => { 
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      };
      const url = `http://localhost:3000/bookings/deleteBookingCookie`;
      const response = await fetch(url, requestOptions);
      const res = await response.json();
      if (!res.success) {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }});

  Timer.propTypes = {
    expiredTimestamp: PropTypes.number,
  };

  const formatTime = (time) => {
    return String(time).padStart(2, '0')
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Typography sx={{ mr: 0.7 }}>
        {"Time left to book:"}
      </Typography>
      <Typography sx={{ color: "red", mr: 0.5 }}>
        {formatTime(minutes)}:{formatTime(seconds)}
      </Typography>
    </Box>
  );
};

export default Timer;