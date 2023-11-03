import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

const BookingForm = () => {
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    airportFrom: "",
    airportTo: "",
    departingDate: "",
    returningDate: "",
    oneWay: false,
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [errors, setErrors] = useState({});
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchAirports = async () => {
      const airports = "http://localhost:3000/airports/getAirports";
      try {
        const response = await fetch(airports);
        const data = await response.json();
        if (data.error) {
          throw data.message;
        }
        setAirports(data.data);
      } catch (error) {
        {
          alert(`Error fetching data: ${error}`);
        }
      }
    };

    fetchAirports();
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
      newErrors.airportFrom = "Airport From is required";
    }
    if (!formData.airportTo) {
      newErrors.airportTo = "Airport To is required";
    }
    if (!formData.departingDate) {
      newErrors.departingDate = "Departing Date is required";
    }
    if (!formData.oneWay && !formData.returningDate) {
      newErrors.returningDate = "Returning Date is required";
    }
    if (formData.adults === "0") {
      newErrors.adults = "It has to be at least 1 adult passenger";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("Form data submitted:", formData);
      navigateTo("/booking", { state: { formData } });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="airportFromLabel">Airport From</InputLabel>
              <Select
                labelId="airportFromLabel"
                id="airportFrom"
                name="airportFrom"
                value={formData.airportFrom}
                onChange={handleChange}
                error={!!errors.airportFrom}
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
                {airports.map((airport) => (
                  <MenuItem key={airport.IATA_code} value={airport.IATA_code}>
                    {airport.name} ({airport.country})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={4} sx={{ display: "grid", justifyContent: "center" }}>
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
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="airportToLabel">Airport To</InputLabel>
              <Select
                labelId="airportToLabel"
                id="airportTo"
                name="airportTo"
                value={formData.airportTo}
                onChange={handleChange}
                error={!!errors.airportTo}
                label="Airport To"
              >
                {airports.map((airport) => (
                  <MenuItem key={airport.IATA_code} value={airport.IATA_code}>
                    {airport.name} ({airport.country})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <TextField
              label="Adults"
              type="number"
              name="adults"
              fullWidth
              InputProps={{
                inputProps: {
                  max: 9,
                  min: 0,
                },
              }}
              value={formData.adults}
              onChange={handleChange}
              error={!!errors.adults}
              helperText={errors.adults}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Children"
              type="number"
              name="children"
              fullWidth
              InputProps={{
                inputProps: {
                  max: 9,
                  min: 0,
                },
              }}
              value={formData.children}
              onChange={handleChange}
              error={!!errors.children}
              helperText={errors.children}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Infants"
              type="number"
              name="infants"
              fullWidth
              InputProps={{
                inputProps: {
                  max: 9,
                  min: 0,
                },
              }}
              value={formData.infants}
              onChange={handleChange}
              error={!!errors.infants}
              helperText={errors.infants}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "grid", justifyContent: "center" }}>
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

export default BookingForm;
