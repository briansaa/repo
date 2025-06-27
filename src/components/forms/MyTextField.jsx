import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function MyTextField(props) {
  const { id, label, width, placeholder, autoComplete, name, control, type } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          id={id}
          name={name}
          sx={{ width }}
          onChange={onChange}
          value={value}
          label={label}
          variant="standard"
          placeholder={placeholder}
          autoComplete={autoComplete}
          type={type}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
