import { Box } from "@mui/material";

const LoginPageImage = () => {
  return (
    <Box
      component="img"
      sx={{
        mt: 5,
        mb: 3,
        left: "3px",
        height: "20%",
        width: "20%",
        display: "flex",
        ml: "auto",
        mr: "auto",
        position: "relative",
      }}
      alt="User"
      src="./src/assets/user.png"
    />
  );
};

export default LoginPageImage;
