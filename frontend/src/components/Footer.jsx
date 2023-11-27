import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Container maxWidth="lg"
      sx={{
        padding: "20px",
        textAlign: "center",
        borderTop: "#000000",
        marginTop: "20px"
      }}
    >
      <Typography variant="body2">Made by Luca Gaetani</Typography>
    </Container>
  );
};

export default Footer;
