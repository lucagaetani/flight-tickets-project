import React from 'react'
import {
    Container
} from "@mui/material";

const MainPageWrite = () => {
    return (
        <Container sx={{
            fontSize: "40px", 
            fontWeight: "bold",
            fontFamily: "sans-serif",
            textAlign: "center"
        }}>
            Where are you going today?
        </Container>
    );
};

export default MainPageWrite;