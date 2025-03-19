
import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300,
  });

  useEffect(() => {
    setShowButton(trigger);
  }, [trigger]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <Zoom in={showButton}>
      <Fab 
        color="success" 
        size="small" 
        aria-label="scroll back to top" 
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 40,
          left: 16,
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default BackToTop;