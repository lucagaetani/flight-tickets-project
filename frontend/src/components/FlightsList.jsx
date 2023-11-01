import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Button,
    Grid
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ButtonDisabled from "./ButtonDisabled";

const columns = [
    {
        field: 'flight_number',
        headerName: 'Flights Number',
        width: 150
    },
    {
        field: 'airline',
        headerName: 'Airline',
        width: 150
    },
    {
        field: 'fk_IATA_from',
        headerName: 'Airport From',
        width: 300,
    },
    {
        field: 'fk_IATA_to',
        headerName: 'Airport To',
        width: 300,
    },
    {
        field: 'departure',
        headerName: 'Departure',
        width: 200,
    },
    {
        field: 'arrival',
        headerName: 'Arrival',
        width: 200,
    },
    {
        field: 'price',
        headerName: 'Price',
        width: 200,
    }
];

const FlightsList = () => {
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [rows, setRows] = useState([]);
  const { state } = useLocation();
  const navigateTo = useNavigate();

  useEffect(() => {
    if (state === null) {
        navigateTo("/");
    } else {
        (async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            try{
                const url = `http://localhost:3000/flights/getFlights?state=${encodeURIComponent(JSON.stringify(state))}`;
                const response = await fetch(url, requestOptions);
                const data = await response.json();
                if (data.success === true){
                    let arrayToInsert = [];
                    data.data.forEach((row) => {
                        let newRow = {
                            flight_number: row.flight_number,
                            airline: row.airline.name,
                            fk_IATA_from: row.departureAirport.name,
                            fk_IATA_to: row.arrivalAirport.name,
                            departure: new Date(row.departure).toLocaleString(),
                            arrival: new Date(row.arrival).toLocaleString(),
                            price: row.price + " €"
                        };
                        arrayToInsert.push(newRow)
                    });
                    setRows(arrayToInsert);
                } else {
                    {alert(`Error: ${data.message}${data.error ? ". "+ data.error : ""}`);}
                }
            } catch(error){
                {alert(`Error fetching data: ${error}`);}
            }
        })();
    }
  }, [state]);

  const getRowId = (row) => row.flight_number;

  const handleSelectionChange = (newSelection) => {
    setSelectedRowIds(newSelection);
  };

  const handleClick = () => {
    navigateTo("/");
  }
  
  return (
    <Box minHeight={300} sx={{ mt: 3 }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            getRowId={getRowId}
            autoHeight
            selectionModel={selectedRowIds}
            onRowSelectionModelChange={handleSelectionChange}
        />
        <Grid container spacing={3} sx={{ mt: 3 }} display={"flex"} justifyContent={"center"}>
            <Grid item xs={2}>
                <Button fullWidth onClick={handleClick} sx={{mt: 2}} variant="contained" color="primary">
                    Back
                </Button>
            </Grid>
            <ButtonDisabled isDisabled={selectedRowIds.length === 0} />
        </Grid>
    </Box>
  );
};

export default FlightsList;