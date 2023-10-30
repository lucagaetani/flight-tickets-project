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
                        setRows(data.data);
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
    <Box minHeight={150}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            autoHeight
            getRowId={getRowId}
            checkboxSelection
            disableSelectionOnClick
            selectionModel={selectedRowIds}
            onSelectionModelChange={handleSelectionChange}
        />
        <Button onClick={handleClick} variant="contained" color="primary">
            Back
        </Button>
    </Box>
  );
};

export default FlightsList;