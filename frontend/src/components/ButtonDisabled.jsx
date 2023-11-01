import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Grid,
    Tooltip
} from "@mui/material";

const ButtonDisabled = (props) => {
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
                setButtonDisabled(!res.success);
            } catch(error) {
                {alert(`Error: ${error}. Can't do fetch of auth.`);}
            }
        })();
    },[])

    const handleClick = () => {
        navigateTo("/")
    };

    return (
        <Tooltip title={buttonDisabled ? "You have to be logged to continue" : props.isDisabled ? "You have to select one row to continue" : null}>
            <Grid item xs={2}>
                <Button
                    fullWidth
                    disabled={props.isDisabled || buttonDisabled}
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                >
                    Continue
                </Button>
            </Grid>
        </Tooltip>
    );
}

export default ButtonDisabled;