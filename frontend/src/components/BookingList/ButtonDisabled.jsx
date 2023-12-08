import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Tooltip } from "@mui/material";
import PropTypes from 'prop-types';

const ButtonDisabled = (props) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const navigateTo = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const requestOptions = {
          method: "GET",
          credentials: "include",
        };
        const response = await fetch(
          "http://localhost:3000/auth",
          requestOptions
        );
        const res = await response.json();
        setButtonDisabled(!res.success);
      } catch (error) {
        {
          alert(`Error: ${error}. Can't do fetch of auth.`);
        }
      }
    })();
  }, []);

  const handleClick = () => {
    const flightState = {
      selectedDepartureFlight: props.selectedDepartureFlight,
      formData: props.formData
    }

    if (props.selectedReturningFlight) {
      flightState.selectedReturningFlight = props.selectedReturningFlight
    }

    navigateTo("/seats", { state: { flightState } });
  };

  ButtonDisabled.propTypes = {
    selectedDepartureFlight: PropTypes.array,
    selectedReturningFlight: PropTypes.array,
    isDisabled: PropTypes.bool.isRequired,
    isDisabledReturning: PropTypes.bool,
    formData: PropTypes.object.isRequired
  };

  return (
    <Tooltip
      title={
        buttonDisabled
          ? "You have to be logged to continue"
          : props.isDisabled
          ? "You have to select one departure row to continue"
          : props.isDisabledReturning
          ? "You have to select one arrival row to continue"
          : null
      }
    >
      <Grid item xs={2}>
        <Button
          fullWidth
          disabled={props.isDisabled || buttonDisabled || props.isDisabledReturning}
          sx={{ mt: 3, mr: 1 }}
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Continue
        </Button>
      </Grid>
    </Tooltip>
  );
};

export default ButtonDisabled;
