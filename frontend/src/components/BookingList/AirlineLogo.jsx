import { Box } from "@mui/material";
import PropTypes from 'prop-types';

const AirlineLogo = (props) => {
  let logo = props.airline.toLowerCase();
  if (logo.includes(" ")) {
    logo = logo.replaceAll(" ", "_")
  }

  AirlineLogo.propTypes = {
    airline: PropTypes.string
  };

  return (
    <Box
        component="img"
        sx={{
          height: "100%",
          width: "100%"
        }}
        alt={logo}
        src={"./src/assets/" + logo + ".png"}
    />
  );
};

export default AirlineLogo;
