import { ToggleButton, ToggleButtonGroup } from '@mui/material';

type Unit = 'metric' | 'imperial';

interface UnitToggleProps {
  readonly value: Unit;
  readonly onChange: (v: Unit) => void;
}

export default function UnitToggle({ value, onChange }: UnitToggleProps) {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: Unit | null
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
  value={value}
  exclusive
  size="small"
  onChange={handleChange}
  sx={{
    width: { xs: "120px", sm: "120px", md: "155px" },
    fontSize: { xs: "12px", sm: "14px", md: "16px" },
    height: 49,
    backgroundColor: '#D7D7D7',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: '4px',

    '& .MuiToggleButtonGroup-grouped': {
      border: 0,
      margin: 0,
      borderRadius: '8px !important',
    },

    '& .MuiToggleButton-root': {
        color: '#fff',
    },

    '& .MuiToggleButton-root.Mui-selected': {
      backgroundColor: '#437A8E',
      color: '#fff',
      borderRadius: '8px',
    },

    '& .MuiToggleButton-root.Mui-selected:hover': {
      backgroundColor: '#437A8E',
    },
  }}
>
      <ToggleButton
        value="metric"
        disableRipple
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '8px',
          fontSize: "16px",
          height: 41,
          width: 72,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        m²
      </ToggleButton>

      <ToggleButton
        value="imperial"
        disableRipple
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '8px',
          fontSize: "16px",
          height: 41,
          width: 72,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        sq ft
      </ToggleButton>
    </ToggleButtonGroup>
  );
}