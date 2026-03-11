import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

const IconTextBlock = ({ title, subtitle, icon, circleColor = '#0CA30A', size = 65 }) => {
  return (
    <>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: size,
          height: size,
          backgroundColor: circleColor,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img src={icon} alt="Icon" style={{ maxWidth: '70%', maxHeight: '70%' }} />
      </Box>
        
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            color: '#1C1C1C',
            fontSize: { xs: "24px", sm: "26px", md: "32px" },
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: '#1C1C1C',
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            fontWeight: 400,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
    <Box 
                sx={{ 
                  width: '100%', 
                  height: '1px', 
                  backgroundColor: '#E4E4E4', 
                  mt: "15px",
                }} 
              />
              </>
  );
};

export default IconTextBlock;