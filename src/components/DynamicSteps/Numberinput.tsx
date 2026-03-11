import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { FieldHeader } from '../Fieldheader';

export interface NumberInputProps {
  readonly label: string;
  readonly required?: boolean;
  readonly hint?: string;
  readonly placeholder?: string;
  readonly value?: number | '';
  readonly min?: number;
  readonly max?: number;
  readonly onChange?: (value: number | '') => void;
}

export function NumberInput({ label, required, hint, placeholder, value, min, max, onChange }: NumberInputProps) {
  const [internal, setInternal] = useState<number | ''>(value ?? '');
  const current = value ?? internal;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['e', 'E', '+', '-', '.'].includes(e.key)) {
    e.preventDefault();
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value;

  if (!/^\d*$/.test(raw)) {
    return;
  }

  const parsed = raw === '' ? '' : Number(raw);
  setInternal(parsed);
  onChange?.(parsed);
};
  return (
    <Box sx={{ mt: "36px" }}>
      <FieldHeader label={label} required={required} hint={hint} />
      <TextField
        type="number"
        value={current}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        slotProps={{
            htmlInput: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
                min,
                max,
            },
        }}
        sx={{
          ml: "23px",
          width: '248px',
          maxWidth: '100%',
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFF',
            fontSize: '16px',
            '& fieldset': { border: '1px solid #8B959A' },
            '&:hover fieldset': { border: '1px solid #8B959A' },
            '&.Mui-focused fieldset': { border: '1px solid #8B959A' },
          },
          '& input': { padding: '12px 14px' },
        }}
      />
    </Box>
  );
}