import * as React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import './navbar-styles.scss';

export const DatePickerValue = ({
  date,
  setDate,
}: {
  date: Dayjs | null;
  setDate: (val: Dayjs | null) => void;
}) => {
  // need more customization
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{
          backgroundColor: 'white',
        }}
        label="Pick date"
        value={date}
        onChange={(newValue) => setDate(newValue)}
      />
    </LocalizationProvider>
  );
};
