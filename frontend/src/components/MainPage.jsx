import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';

const MainPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{mt: 5, mb: 5}}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField id="outlined-basic" label="Airport From" variant="outlined" size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField id="date" label="Departing date" size="small"/>
          </Grid>
          <Grid item xs={6}>
            <TextField id="outlined-basic" label="Airport From" variant="outlined" size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField id="outlined-basic" label="Airport From" variant="outlined" size="small" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MainPage;
