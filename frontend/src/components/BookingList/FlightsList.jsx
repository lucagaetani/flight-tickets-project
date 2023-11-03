import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ButtonDisabled from "./ButtonDisabled";

const columns = [
  {
    field: "flight_number",
    headerName: "Flights Number",
    width: 150,
  },
  {
    field: "airline",
    headerName: "Airline",
    width: 150,
  },
  {
    field: "fk_IATA_from",
    headerName: "Airport From",
    width: 300,
  },
  {
    field: "fk_IATA_to",
    headerName: "Airport To",
    width: 300,
  },
  {
    field: "departure",
    headerName: "Departure",
    width: 200,
  },
  {
    field: "arrival",
    headerName: "Arrival",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 200,
  },
];

const FlightsList = () => {
  const [selectedRowIdsDeparture, setSelectedRowIdsDeparture] = useState([]);
  const [selectedRowIdsReturning, setSelectedRowIdsReturning] = useState([]);
  const [rowsDeparture, setRowsDeparture] = useState([]);
  const [rowsReturning, setRowsReturning] = useState([]);
  const { state } = useLocation();
  const navigateTo = useNavigate();

  useEffect(() => {
    if (state === null) {
      navigateTo("/");
    } else {
      (async () => {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        try {
          const url = `http://localhost:3000/flights/getFlights?state=${encodeURIComponent(
            JSON.stringify(state)
          )}`;
          const response = await fetch(url, requestOptions);
          const data = await response.json();
          if (data.success === true) {
            let arrayToInsert = [];
            console.log(data);
            data.data[0].forEach((row) => {
              let newRow = {
                flight_number: row.flight_number,
                airline: row.airline.name,
                fk_IATA_from: row.departureAirport.name,
                fk_IATA_to: row.arrivalAirport.name,
                departure: new Date(row.departure).toLocaleString(),
                arrival: new Date(row.arrival).toLocaleString(),
                price: row.price + " €",
              };
              arrayToInsert.push(newRow);
            });
            setRowsDeparture(arrayToInsert);
            if (data.data[1]) {
              arrayToInsert = [];
              data.data[1].forEach((row) => {
                let newRow = {
                  flight_number: row.flight_number,
                  airline: row.airline.name,
                  fk_IATA_from: row.departureAirport.name,
                  fk_IATA_to: row.arrivalAirport.name,
                  departure: new Date(row.departure).toLocaleString(),
                  arrival: new Date(row.arrival).toLocaleString(),
                  price: row.price + " €",
                };
                arrayToInsert.push(newRow);
              });
              setRowsReturning(arrayToInsert);
            }
          } else {
            {
              alert(
                `Error: ${data.message}${data.error ? ". " + data.error : ""}`
              );
            }
          }
        } catch (error) {
          {
            alert(`Error fetching data: ${error}`);
          }
        }
      })();
    }
  }, [navigateTo, state]);

  const getRowId = (row) => row.flight_number;

  const handleSelectionChangeDeparture = (newSelection) => {
    setSelectedRowIdsDeparture(newSelection);
  };

  const handleSelectionChangeReturning = (newSelection) => {
    setSelectedRowIdsReturning(newSelection);
  };

  const handleClick = () => {
    navigateTo("/");
  };

  return (
    <Box minHeight={300} sx={{ mt: 3, width: "100%" }}>
      <Typography sx={{ mt: 3 }} variant="h5">
        Choose a departure flight
      </Typography>

      <DataGrid
        rows={rowsDeparture}
        initialState={{
          ...rowsDeparture.initialState,
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10]}
        columns={columns}
        getRowId={getRowId}
        autoHeight
        selectionModel={selectedRowIdsDeparture}
        onRowSelectionModelChange={handleSelectionChangeDeparture}
      />

      {!state.oneWay && (
        <Typography sx={{ mt: 3 }} variant="h5">
          Choose a returning flight
        </Typography>
      )}

      {!state.oneWay && (
        <DataGrid
          rows={rowsReturning}
          columns={columns}
          pageSize={5}
          getRowId={getRowId}
          autoHeight
          selectionModel={selectedRowIdsReturning}
          onRowSelectionModelChange={handleSelectionChangeReturning}
        />
      )}

      <Grid
        container
        spacing={3}
        sx={{ mt: 3 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <Grid item xs={2}>
          <Button
            fullWidth
            onClick={handleClick}
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
          >
            Back
          </Button>
        </Grid>
        <ButtonDisabled isDisabled={selectedRowIdsDeparture.length === 0} />
      </Grid>
    </Box>
  );
};

export default FlightsList;
