import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack, Paper, alpha } from '@mui/material';
import { Package, User, Heart } from 'lucide-react';

export function QuickActions() {

  return (
    <Stack spacing={1.5}>
      
      <Button 
        component={Link}
        to="/profile"
        variant="contained" 
        fullWidth 
        startIcon={<User size={18} />}
        sx={{ 
          justifyContent: 'flex-start',
          py: 1.5,
          fontWeight: 500
        }}
      >
        Update Profile
      </Button>

      <Button 
        variant="outlined" 
        fullWidth 
        startIcon={<Heart size={18} />}
        sx={{ 
          justifyContent: 'flex-start',
          py: 1.5,
          fontWeight: 500
        }}
      >
        View Impact Report
      </Button>
    </Stack>
  );
}
