import { useState } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';

const MyDateRangePicker = () => {
  const [dateRange, setDateRange] = useState([null, null]);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText="Start Date"
        endText="End Date"
        value={dateRange}
        onChange={handleDateChange}
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} variant="standard" margin="normal" helperText="" />
            <TextField {...endProps} variant="standard" margin="normal" helperText="" />
          </>
        )}
      />
    </LocalizationProvider>
  );
};

export default MyDateRangePicker;
