import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Logo from '../assets/ewipro-logo1.svg'; 

const CalculatorIntro = () => {
  return (
    <Box 
      sx={{ 
        textAlign: 'center',
        py: "34px",
      }}
    >
      <Container>
        <Box 
          component="img"
          src={Logo}
          alt="EWIPRO Logo"
          sx={{ 
            height: "auto", 
            p: 0,
            width: { xs: '180px', sm: '220px'},
            display: 'block',
            mx: 'auto',
            mb: "24px",
          }}
        />

        <Typography 
          sx={{ 
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 700, 
            color: '#000',
            fontSize: { xs: "24px", sm: "32px" },
            lineHeight: 1.2,
            mb: 1
          }}
        >
          Insulation System Advisor
        </Typography>

      </Container>
    </Box>
  );
};

export default CalculatorIntro;