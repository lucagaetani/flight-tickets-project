import React from "react";
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

  useEffect(() => {
    fetch('https://example.com/api/data')
    .then((response) => response.json())
    .then((data) => setRows(data))
    .catch((error) => console.error('Error fetching data:', error));
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