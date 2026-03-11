import React from 'react';
import { Box } from '@mui/material';

export interface FieldHeaderProps {
  readonly label: string;
  readonly required?: boolean;
  readonly hint?: string;
}

export function FieldHeader({ label, required, hint }: FieldHeaderProps) {
  return (
    <Box display="flex" alignItems="flex-start" gap="16px" mb="12px">
      <Box sx={{
        width: '7px',
        minHeight: '26px',
        backgroundColor: '#0CA30A',
        flexShrink: 0,
        mt: '1px',
      }} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', lineHeight: '26px', minWidth: 0 }}>
        <Box
  component="span"
  sx={{
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: '16px',
    color: '#1D1D1D',
    letterSpacing: '0px',
    wordBreak: 'break-word',
  }}
>
  {label}
  {required && (
    <Box
      component="span"
      sx={{
        fontSize: '16px',
        verticalAlign: 'super',
        lineHeight: 1,
        ml: '2px',
      }}
    >
      *
    </Box>
  )}
</Box>
        {hint && (
          <Box component="span" sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', color: '#1D1D1D', letterSpacing: '0px', wordBreak: 'break-word' }}>
            {hint}
          </Box>
        )}
      </Box>
    </Box>
  );
}