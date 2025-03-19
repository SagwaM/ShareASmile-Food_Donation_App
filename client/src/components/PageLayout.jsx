import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import BackToTop from './BackToTop';

const PageLayout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Navbar />
      <Container 
        component="main" 
        sx={{ 
          pt: 12, 
          pb: 8, 
          flexGrow: 1 
        }}
      >
        {children}
      </Container>
      <BackToTop />
    </Box>
  );
};

export default PageLayout;
