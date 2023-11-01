import {
    Box
} from "@mui/material";

const MainPageImage = () => {
    return (
        <Box
            component="img"
            sx={{
                mt: 5,
                mb: 3,
                height: "20%",
                width: "20%",
                display: "flex",
                ml: "auto",
                mr: "auto"
            }}
            alt="Departing"
            src="./src/assets/departing.png"
        />
    );
};

export default MainPageImage;