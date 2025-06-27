import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';

export default function MySelectField(props) {
  const { id, label, name, control, width, autoComplete, options, onChangeExtra } = props;

  return (
    <FormControl variant="standard" sx={{ width }}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Select
              labelId={`${id}-label`}
              id={id}
              name={name}
              value={value || ''}
              onChange={(e) => {
                onChange(e);
                if (onChangeExtra) onChangeExtra(e);
              }}
              autoComplete={autoComplete}
              error={!!error}
            >
              <MenuItem value="">
                <em>Ninguno</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: '#d32f2f' }}>
              {error?.message}
            </FormHelperText>
          </>
        )}
      />
    </FormControl>
  );
}
