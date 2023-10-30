import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    Container
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {
        field: 'flight_number',
        headerName: 'Flights Number',
        width: 50 
    },
    {
        field: 'fk_IATA_from',
        headerName: 'Airport From',
        width: 150,
    },
    {
        field: 'fk_IATA_to',
        headerName: 'Airport To',
        width: 150,
    },
    {
        field: 'date',
        headerName: 'Date',
        type: 'number',
        width: 60,
    },
    {
        field: 'departure',
        headerName: 'Departure',
        width: 50,
    },
    {
        field: 'arrival',
        headerName: 'Arrival',
        width: 50,
    },
    {
        field: 'price',
        headerName: 'Price',
        width: 50,
    }
];

const FlightsList = () => {
  const [rows, setRows] = useState([]);
  const { state } = useLocation();

  useEffect(() => {
    (async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        try{
            const url = `http://localhost:3000/flights/getFlights?state=${encodeURIComponent(state)}`;
            const response = await fetch(url, requestOptions);
            const data = await response.json();
            if (data.success === true){
                setRows(data);
            } else {
                {alert(`Error: ${data.message}${data.error ? ". "+ data.error : ""}`);}
            }
        } catch(error){
            {alert(`Error fetching data: ${error}`);}
        }
    })()
  }, []);
  
  return (
    <Container maxWidth="sm">
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
      />
    </Container>
  );
};

export default FlightsList;