import { BottomNavigation, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation sx={{ alignItems: "center" }}>
        <Typography>
          Made by Luca Gaetani
        </Typography>
      </BottomNavigation>
    </Box>
  );
};

export default Footer;
