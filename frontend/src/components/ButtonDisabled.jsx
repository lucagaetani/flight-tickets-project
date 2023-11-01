import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Grid,
    Tooltip
} from "@mui/material";

const ButtonDisabled = () => {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const navigateTo = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    credentials: 'include',
                }
                const response = await fetch("http://localhost:3000/auth", requestOptions);
                const res = await response.json();
                if (res.success) {
                    setButtonDisabled(false);
                }
            } catch(error) {
                {alert(`Error: ${error}. Can't do fetch of auth.`);}
            }
        })();
    },[])

    const handleClick = () => {
        navigateTo("/")
    };

    if (buttonDisabled) {
        return (
            <Tooltip title="You have to be logged to continue">
                <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button disabled sx={{mt: 2}} variant="contained" color="primary">
                        Continue
                    </Button>
                </Grid>
            </Tooltip>
        )
    } else {
        return (
            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handleClick} sx={{mt: 2}} variant="contained" color="primary">
                    Continue
                </Button>
            </Grid>
        )
    }
}

export default ButtonDisabled;