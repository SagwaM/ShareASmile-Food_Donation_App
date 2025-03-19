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

  // Mock data for available donations
  const availableDonations = [
    {
      id: 1,
      title: "Fresh Bakery Items",
      description: "Assorted breads, pastries, and cookies from today's baking",
      location: "Downtown Bakery, NY",
      timeLeft: "3 hours",
      quantity: "15-20 items",
      type: "Baked Goods",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800&h=600",
      distance: "0.8 miles"
    },
    {
      id: 2,
      title: "Restaurant Surplus Meals",
      description: "Prepared meals including pasta, salads, and soups",
      location: "Italian Restaurant, Brooklyn",
      timeLeft: "5 hours",
      quantity: "10 meals",
      type: "Prepared Food",
      image: "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&q=80&w=800&h=600",
      distance: "1.2 miles"
    },
    {
      id: 3,
      title: "Fresh Produce",
      description: "Various vegetables and fruits in good condition",
      location: "Local Grocery, Queens",
      timeLeft: "12 hours",
      quantity: "25 lbs",
      type: "Produce",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=800&h=600",
      distance: "0.5 miles"
    },
    {
      id: 4,
      title: "Dairy Products",
      description: "Milk, yogurt, and cheese approaching best-by date",
      location: "Corner Market, Manhattan",
      timeLeft: "24 hours",
      quantity: "12 items",
      type: "Dairy",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800&h=600",
      distance: "1.5 miles"
    },
    {
      id: 5,
      title: "Canned Goods",
      description: "Various non-perishable canned foods",
      location: "Community Pantry, Bronx",
      timeLeft: "3 days",
      quantity: "30+ cans",
      type: "Non-perishable",
      image: "https://images.unsplash.com/photo-1583922146273-68f11083858c?auto=format&fit=crop&q=80&w=800&h=600",
      distance: "2.3 miles"
    },
    {
      id: 6,
      title: "Restaurant Meals",
      description: "End-of-day prepared meals from local restaurant",
      location: "Healthy Bites, Manhattan",
      timeLeft: "2 hours",
      quantity: "8 meals",
      type: "Prepared Food",
      image: "https://images.unsplash.com/photo-1611171711791-b34a6e640ba2?auto=format&fit=crop&q=80&w=800&h=600",
      distance: "0.3 miles"
    },
  ];

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
