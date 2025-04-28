import React, { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  TextField, 
  Paper,
  Chip,
  IconButton,
  Stack,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput
} from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import { DashboardSection } from "@/components/DashboardStats";
import { Search, Heart, Clock, MapPin, Filter } from "lucide-react";

const AvailableDonations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const foodTypes = ["All", "Produce", "Dairy", "Baked Goods", "Prepared Food", "Non-perishable"];

  const filteredDonations = availableDonations.filter(donation => {
    const matchesSearch = donation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || donation.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout title="Available Donations" userType="donor">
      <Container maxWidth="xl">
        <DashboardSection title="All Available Donations">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 4, 
              borderRadius: 2, 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <TextField
              placeholder="Search donations..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                input={<OutlinedInput label="Type" />}
              >
                {foodTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              startIcon={<Filter size={16} />}
              size="medium"
            >
              More Filters
            </Button>
          </Paper>

          <Grid container spacing={3}>
            {filteredDonations.map((donation) => (
              <Grid item xs={12} md={6} lg={4} key={donation.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={donation.image}
                      alt={donation.title}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'primary.main',
                        bgcolor: 'white',
                        '&:hover': {
                          bgcolor: 'grey.100'
                        }
                      }}
                    >
                      <Heart size={18} />
                    </IconButton>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {donation.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {donation.description}
                    </Typography>
                    
                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <MapPin size={16} style={{ marginRight: 8 }} />
                        <Typography variant="body2">{donation.location} ({donation.distance})</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <Clock size={16} style={{ marginRight: 8 }} />
                        <Typography variant="body2">{donation.timeLeft} left to claim</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium">
                      {donation.quantity}
                    </Typography>
                    <Chip 
                      label={donation.type} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </CardActions>
                  
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      color="primary"
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DashboardSection>
      </Container>
    </DashboardLayout>
  );
};

export default AvailableDonations;
