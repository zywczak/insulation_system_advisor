import React, { useState } from 'react';
import { Box, Typography, FormControl } from '@mui/material';
import { FieldHeader } from './Fieldheader';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioInputProps {
  readonly label: string;
  readonly required?: boolean;
  readonly multiSelect?: boolean;
  readonly options: RadioOption[];
  readonly value?: string | string[];
  readonly onChange?: (value: string | string[]) => void;
}

export function RadioInput({ label, required, multiSelect, options, value, onChange }: RadioInputProps) {
  const [internal, setInternal] = useState<string | string[]>(
    value ?? (multiSelect ? [] : '')
  );

  const selected = value ?? internal;

  const isSelected = (val: string): boolean => {
    if (multiSelect) return (selected as string[]).includes(val);
    return selected === val;
  };

  const handleChange = (val: string) => {
    if (multiSelect) {
      const current = selected as string[];
      const exclusiveValues = new Set(['none', 'dont_know']);

      let next: string[];

      if (exclusiveValues.has(val)) {
        // jeśli kliknięto none/dont_know — odznacz wszystko inne, zostaw tylko to
        next = current.includes(val) ? [] : [val];
      } else {
        // jeśli kliknięto normalną opcję — odznacz none/dont_know
        const withoutExclusive = current.filter((v) => !exclusiveValues.has(v));
        next = withoutExclusive.includes(val)
          ? withoutExclusive.filter((v) => v !== val)
          : [...withoutExclusive, val];
      }

      setInternal(next);
      onChange?.(next);
    } else {
      setInternal(val);
      onChange?.(val);
    }
  };

  return (
    <FormControl sx={{ width: '100%', mt: "36px" }}>
      <FieldHeader label={label} required={required} />
      <Box sx={{ ml: '23px' }}>
        {options.map((opt) => {
          const sel = isSelected(opt.value);
          return (
            <Box
              key={opt.value}
              onClick={() => handleChange(opt.value)}
              sx={{
                maxWidth: '300px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '1px solid #E5E5E5',
                py: '10px',
                cursor: 'pointer',
              }}
            >
              {multiSelect ? (
                <Box sx={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  backgroundColor: sel ? '#0CA30A' : '#E6E6E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {sel && (
                    <Box
                      component="svg"
                      viewBox="0 0 10 8"
                      sx={{ width: '8px', height: '8px' }}
                    >
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#E6E6E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {sel && (
                    <Box sx={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0CA30A',
                    }} />
                  )}
                </Box>
              )}

              <Typography sx={{
                fontSize: '14px',
                color: '#1D1D1D',
                fontWeight: 400,
                fontFamily: 'Inter',
              }}>
                {opt.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </FormControl>
  );
}