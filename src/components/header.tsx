import React from 'react';
import { Toolbar, Typography, Box } from '@mui/material';
import Logo from '../assets/ewipro-logo.svg'; 

const Header = () => {
  return (
    <Box 
      sx={{ 
        width: '100%',
        backgroundColor: '#0CA30A', 
        color: '#FFFFFF',
        boxShadow: 'none',
        pt: "24px",
        pb: "24px",
        px: { xs: "24px", sm: "50px", md: "80px" },
      }}
    >
        <Toolbar 
          disableGutters
          sx={{
            justifyContent: 'space-between',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: 'center',
            gap: { xs: "24px", sm: 0 }
          }}
        >
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'Barlow, sans-serif',
              fontWeight: 700, 
              letterSpacing: '-1px',
              lineHeight: 1.2,
              fontSize: { xs: "24px", sm: "26px", md: "32px" },
              whiteSpace: 'nowrap'
            }}
          >
            Insulation System Advisor
          </Typography>

          <Box 
            component="img"
            src={Logo}
            alt="EWIPRO Building Solutions"
            sx={{ 
              height: { xs: '32px', sm: "36px", md: "40px" },
              display: 'block',
              objectFit: 'contain'
            }}
          />

        </Toolbar>
    </Box>
  );
};

export default Header;