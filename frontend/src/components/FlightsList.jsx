import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Button
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {
        field: 'flight_number',
        headerName: 'Flights Number',
        width: 150
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
  console.log(state);

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
                console.log(data);
                if (data.success === true){
                    let arrayToInsert = [];
                    data.data.forEach((row) => {
                        let newRow = {
                            flight_number: row.flight_number,
                            fk_IATA_from: row.departureAirport.name,
                            fk_IATA_to: row.arrivalAirport.name,
                            departure: new Date(row.departure).getDate() + "/" + new Date(row.departure).getMonth() + "/" + new Date(row.departure).getFullYear(),
                            arrival: new Date(row.arrival).getDate() + "/" + new Date(row.arrival).getMonth() + "/" + new Date(row.arrival).getFullYear(),
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
        })()
    }
  }, []);

  const getRowId = (row) => row.flight_number;

  const handleSelectionChange = (newSelection) => {
    setSelectedRowIds(newSelection.selectionModel);
  };

  const handleClick = () => {
    navigateTo("/");
  }
  
  return (
    <Box minHeight={300} sx={{mt: 3}}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            getRowId={getRowId}
            autoHeight
            checkboxSelection
            disableSelectionOnClick
            selectionModel={selectedRowIds}
            onSelectionModelChange={handleSelectionChange}
        />
        <Button onClick={handleClick} sx={{mt: 2}} variant="contained" color="primary">
            Back
        </Button>
    </Box>
  );
};

export default FlightsList;