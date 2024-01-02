import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Container,
  Grid,
  Box,
  FormHelperText,
  Skeleton,
  Typography
} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultDialog from "../DefaultDialog";
import { faRepeat } from '@fortawesome/free-solid-svg-icons';

const BookingForm = () => {
  const navigateTo = useNavigate();
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const [formData, setFormData] = useState(state ? state.formData : {
    airportFrom: "",
    airportTo: "",
    departingDate: "",
    returningDate: "",
    oneWay: false,
    adults: 1,
    children: 0,
    infants: 0
  });

  const [errors, setErrors] = useState({});
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    (async () => {
      const airports = "http://localhost:3000/airports/getAirports";
      try {
        const response = await fetch(airports);
        const res = await response.json();
        if (res.success) {
          setAirports(res.data);
        } else {
          setTitleDialog("Error");
          setContentDialog(`Error: ${res.message}`);
          setOpenDialog(true);
        }
      } catch (error) {
        setTitleDialog("Error");
        setContentDialog(`Error fetching data: ${error}`);
        setOpenDialog(true);
      }

      setLoading(false);
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.airportFrom) {
      newErrors.airportFrom = "Departure airport is required";
    }
    if (!formData.airportTo) {
      newErrors.airportTo = "Arrival airport is required";
    }
    if (!formData.departingDate) {
      newErrors.departingDate = "Departing date is required";
    }
    if (!formData.oneWay && !formData.returningDate) {
      newErrors.returningDate = "Returning date is required";
    }
    if (formData.adults === "0") {
      newErrors.adults = "It has to be at least 1 adult passenger";
    }
    if (new Date(formData.departingDate).getTime() >= new Date(formData.returningDate).getTime()) {
      newErrors.returningDate = "Returning Date must be after departing date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("Form data submitted:", formData);
      navigateTo("/booking", { state: { formData } });
    }
  };

  return (
    <Box>
      <DefaultDialog toOpen={openDialog} title={titleDialog} contentText={contentDialog} setOpenDialogFalse={() => setOpenDialog(!openDialog)} />
      <Container>
        <Typography variant="h2" sx={{ mt: 4, textAlign: "center" }} fontWeight={"bold"}>
          Book your flight ticket here!
        </Typography>
      </Container>
      <form onSubmit={handleSubmit}>
        <Container maxWidth="lg" sx={{ mt: 3, mb: 8, border: "1px solid #C4C4C4", borderRadius: "1rem", padding: "20px" }}>
          <Grid container spacing={3} columns={{ xs: 1, md: 3 }}>
            <Grid item xs={1} md={1} sx={{ display: "flex" }}>
              <FormControl sx={{width:"80%"}} error={!!errors.airportFrom}>
                <InputLabel id="airportFromLabel">Airport From</InputLabel>
                <Select
                  labelId="airportFromLabel"
                  id="airportFrom"
                  name="airportFrom"
                  value={formData.airportFrom}
                  onChange={handleChange}
                  label="Airport From"
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "center",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "center",
                    },
                  }}
                >
                  {loading ? (
                    <>
                      <Box sx={{
                        display: "flex",
                        height: "5vh",
                        mb: 1
                      }}>
                        <Skeleton variant="rectangular" width="95%" height="100%" sx={{ margin: "auto" }} />
                      </Box>
                      <Box sx={{
                        display: "flex",
                        height: "5vh"
                      }}>
                        <Skeleton variant="rectangular" width="95%" height="100%" sx={{ margin: "auto" }} />
                      </Box>
                    </>
                  ) : airports.length > 0 ? (airports.map((airport) => (
                    <MenuItem key={airport.IATA_code} value={airport.IATA_code}>
                      {airport.name} ({airport.country})
                    </MenuItem>
                  ))) : (
                    <MenuItem value="no" sx={{ pointerEvents: "none" }}>No airports retrieved</MenuItem>
                  )}
                 
                </Select>
                <FormHelperText>{errors.airportFrom}</FormHelperText>
              </FormControl>
              <Box sx={{ mt:2.5, ml:3.5 , cursor: "pointer" }}>
                <Box title="Switch airports" sx={{ ":hover": { opacity: 0.7 } }}>
                  <FontAwesomeIcon icon={faRepeat} onClick={() => setFormData({ ...formData, airportFrom: formData.airportTo, airportTo: formData.airportFrom })}/>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={1} md={1}>
              <TextField
                label="Departing Date"
                type="date"
                name="departingDate"
                fullWidth
                value={formData.departingDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.departingDate}
                helperText={errors.departingDate}
              />
            </Grid>
            <Grid item xs={1} md={1} sx={{ display: "grid", justifyContent: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.oneWay}
                    onChange={handleChange}
                    name="oneWay"
                  />
                }
                label="One Way"
              />
            </Grid>
            <Grid item xs={1} md={1}>
              <FormControl fullWidth error={!!errors.airportTo}>
                <InputLabel id="airportToLabel">Airport To</InputLabel>
                <Select
                  labelId="airportToLabel"
                  id="airportTo"
                  name="airportTo"
                  value={formData.airportTo}
                  onChange={handleChange}
                  label="Airport To"
                >
                  {loading ? (
                    <>
                      <Box sx={{
                        display: "flex",
                        height: "5vh",
                        mb: 1
                      }}>
                        <Skeleton variant="rectangular" width="95%" height="100%" sx={{ margin: "auto" }} />
                      </Box>
                      <Box sx={{
                        display: "flex",
                        height: "5vh"
                      }}>
                        <Skeleton variant="rectangular" width="95%" height="100%" sx={{ margin: "auto" }} />
                      </Box>
                    </>
                  ) : airports.length > 0 ? (airports.map((airport) => (
                    <MenuItem key={airport.IATA_code} value={airport.IATA_code}>
                      {airport.name} ({airport.country})
                    </MenuItem>
                  ))) : (
                    <MenuItem value="no" sx={{ pointerEvents: "none" }}>No airports retrieved</MenuItem>
                  )}
                </Select>
                <FormHelperText>{errors.airportTo}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={1} md={1}>
              {!formData.oneWay && (
                <TextField
                  label="Returning Date"
                  type="date"
                  name="returningDate"
                  fullWidth
                  value={formData.returningDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.returningDate}
                  helperText={errors.returningDate}
                />
              )}
            </Grid>
            <Grid item xs={1} md={1}>
            </Grid>
            <Grid item xs={1} md={1}>
              <TextField
                label="Adults"
                type="number"
                name="adults"
                fullWidth
                InputProps={{
                  inputProps: {
                    max: 5,
                    min: 0,
                  },
                }}
                value={formData.adults}
                onChange={handleChange}
                error={!!errors.adults}
                helperText={errors.adults}
              />
            </Grid>
            <Grid item xs={1} md={1}>
              <TextField
                label="Children"
                type="number"
                name="children"
                fullWidth
                InputProps={{
                  inputProps: {
                    max: 5,
                    min: 0,
                  },
                }}
                value={formData.children}
                onChange={handleChange}
                error={!!errors.children}
                helperText={errors.children}
              />
            </Grid>
            <Grid item xs={1} md={1}>
              <TextField
                label="Infants"
                type="number"
                name="infants"
                fullWidth
                InputProps={{
                  inputProps: {
                    max: 1,
                    min: 0,
                  },
                }}
                value={formData.infants}
                onChange={handleChange}
                error={!!errors.infants}
                helperText={errors.infants}
              />
            </Grid>
            <Grid item xs={1} md={3} sx={{ display: "grid", justifyContent: "center" }}>
              <Button type="submit" variant="contained" color="primary">
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
      </form>
    </Box>
  );
};

export default BookingForm;
