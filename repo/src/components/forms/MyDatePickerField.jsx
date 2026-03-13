import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';

export default function MyDatePickerField(props) {
  const { id, label, control, width, name, autoComplete } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePicker
            id={id}
            name={name}
            label={label}
            value={value ? dayjs(value) : null}
            onChange={(newValue) => onChange(newValue ? newValue.toISOString() : '')}
            slotProps={{
              textField: {
                sx: { width },
                autoComplete,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}
