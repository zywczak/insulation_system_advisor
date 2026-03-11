import React, { useState } from 'react';
import { Box, Typography, Slider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip } from './tooltip';

export interface SliderInputProps {
  readonly label: string;
  readonly hint?: string;
  readonly tooltip?: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly value?: number;
  readonly minLabel?: string;
  readonly maxLabel?: string;
  readonly onChange?: (value: number) => void;
}

export function SliderInput({
  label,
  hint,
  tooltip,
  min = 1,
  max = 5,
  step = 1,
  value,
  minLabel = 'Not important',
  maxLabel = 'Critical',
  onChange,
}: SliderInputProps) {
  const [internal, setInternal] = useState(value ?? min);
  const current = value ?? internal;

  const handleChange = (_: Event, val: number | number[]) => {
    const num = val as number;
    setInternal(num);
    onChange?.(num);
  };

  return (
          <Box sx={{
            borderLeft: '7px solid #0CA30A',
            pl: '16px',
            width: '100%',
            maxWidth: '700px',
            mt: "36px",
          }}>
            <Box display="flex" alignItems="center" gap="8px" mb="2px">
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '16px', color: '#1D1D1D', letterSpacing: '0px' }}>
                {label}
              </Typography>
              {tooltip && (
                <Tooltip title={tooltip} arrow placement="right">
                  <InfoOutlinedIcon sx={{ fontSize: '18px', color: '#8B959A', cursor: 'help' }} />
                </Tooltip>
              )}
            </Box>
<Box
  display="flex"
  alignItems="center"
  gap="16px"
>
  {hint && (
    <Typography
      sx={{
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 400,
        color: '#1D1D1D'
      }}
    >
      {hint}
    </Typography>
  )}

  <Box
    sx={{
      flex: 1,
      height: '1px',
      backgroundColor: '#E4E4E4'
    }}
  />

  <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '16px', color: '#1D1D1D', letterSpacing: '0px'}}>
    {current}/{max}
  </Typography>
</Box>

<Slider
  value={current}
  min={min}
  max={max}
  step={step}
  onChange={handleChange}
  sx={{
    color: '#8B959A',
    height: '12px',
    padding: '10px 0',
    width: 'calc(100% - 44px)',
    marginX: '22px',
    '& .MuiSlider-track': { border: 'none' },
    '& .MuiSlider-rail': {
      width: 'calc(100% + 44px)',
      left: '-22px',
      opacity: 1,
      background: current === max
        ? '#8B959A' // cały rail ciemny, jeśli max
        : 'linear-gradient(to right, #8B959A 0%, #8B959A 28px, #DDDDDD 28px, #DDDDDD 100%)', // tylko pierwsze 22px ciemne
    },
    '& .MuiSlider-thumb': {
      width: '20px',
      height: '20px',
      border: '3px solid #8B959A',
      backgroundColor: '#FFFFFF',
      '&:hover, &.Mui-focusVisible, &.Mui-active': {
        boxShadow: 'none',
      },
    },
  }}
/>

      <Box display="flex" justifyContent="space-between" mt="-4px">
        <Typography sx={{ fontFamily: 'Barlow', fontWeight: 400, fontSize: '12px', color: '#1D1D1D' }}>{minLabel}</Typography>
        <Typography sx={{ fontFamily: 'Barlow', fontWeight: 400, fontSize: '12px', color: '#1D1D1D' }}>{maxLabel}</Typography>
      </Box>
    </Box>
  );
}