import React from 'react'
import {
    Box
} from "@mui/material";

const RegisterPageImage = () => {
    return (
        <Box
            component="img"
            sx={{
                mt: 5,
                mb: 3,
                height: "5%",
                width: "5%",
                display: "flex",
                ml: "auto",
                mr: "auto"
            }}
            alt="Register"
            src="./src/assets/register.png"
        />
    );
};

export default RegisterPageImage;