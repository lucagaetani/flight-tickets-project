import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import NumberPicker from "./NumberPicker";

const MainPage = () => {
  return (
    <Container maxWidth="md" alignItems="center">
      <Box sx={
        {
          mt: 5, 
          mb: 5
        }
        }>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>From</FormLabel>
              <TextField id="outlined-basic" label="e.g. Venice Marco Polo" size="small" />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>Departing</FormLabel>
              <TextField type="date" id="date-pickers" size="small"/>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>Additional informations</FormLabel>
              <FormControlLabel control={<Checkbox defaultChecked />} label="One way" />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>To</FormLabel>
              <TextField id="outlined-basic" label="e.g. London Gatwick" size="small" />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>Returning</FormLabel>
              <TextField type="date" id="date-pickers" size="small"/>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>Number of Adults (+16)</FormLabel>
              <NumberPicker />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>Number of Children (2-5)</FormLabel>
              <NumberPicker />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>Number of Infants (0-1-2)</FormLabel>
              <NumberPicker />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
          </Grid>
          <Grid item xs={4} textAlign={"center"}>
            <Button>Submit</Button>
          </Grid>
          <Grid item xs={4}>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MainPage;
