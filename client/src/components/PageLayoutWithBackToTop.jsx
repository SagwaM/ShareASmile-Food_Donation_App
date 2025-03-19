import { Box, Container } from "@mui/material";
import Navbar from "@/components/Navbar";

import ScrollToTop from "@/components/ScrollToTop";
import BackToTop from "@/components/BackToTop";

export function PageLayoutWithBackToTop({ children, className = "" }) {
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
          flexGrow: 1 
        }}
      >
        {children}
      </Container>
      
      <ScrollToTop />
      <BackToTop />
    </Box>
  );
}
