import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  alpha
} from '@mui/material';
import { 
  Camera, 
  ClipboardList, 
  UtensilsCrossed, 
  Clock, 
  CalendarRange
} from 'lucide-react';

export function DonationTips() {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        How to make the most impact
      </Typography>
      <List sx={{ pl: 1 }}>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Camera size={18} />
          </ListItemIcon>
          <ListItemText 
            primary="Take clear photos of the items you're donating"
            primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }} 
          />
        </ListItem>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <ClipboardList size={18} />
          </ListItemIcon>
          <ListItemText 
            primary="Be specific about quantity, quality, and expiry dates"
            primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }} 
          />
        </ListItem>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <UtensilsCrossed size={18} />
          </ListItemIcon>
          <ListItemText 
            primary="Include any dietary information (vegetarian, contains nuts, etc.)"
            primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }} 
          />
        </ListItem>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Clock size={18} />
          </ListItemIcon>
          <ListItemText 
            primary="Specify pickup times when you'll be available"
            primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }} 
          />
        </ListItem>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <CalendarRange size={18} />
          </ListItemIcon>
          <ListItemText 
            primary="Consider donating during high-demand times (weekends, holidays)"
            primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }} 
          />
        </ListItem>
      </List>
    </Paper>
  );
}
