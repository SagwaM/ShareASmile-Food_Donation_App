import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  MenuItem,
  Pagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InfoIcon from '@mui/icons-material/Info';
import PageLayout from '../components/PageLayout';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/uploads';  // Ensure this is correct
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150';

const CATEGORIES = [
  'All Categories',
  'Vegetarian',
  'Non-Vegetarian',
  'Dairy',
  'Grains',
  'Canned Goods',
  'Fresh Produce',
  'Others'
];

const DISTANCES = [
  'Any Distance',
  'Within 1 mile',
  'Within 5 miles',
  'Within 10 miles',
  'Within 25 miles'
];

const DonationsPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [distance, setDistance] = useState('Any Distance');
  const [page, setPage] = useState(1);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food/');
        console.log("Fetched Data:", response.data); 
        setDonations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setError('Failed to fetch donations');
        setLoading(false);
      }
    };
  
    fetchDonations();
  }, []);
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter donations based on search term and filters
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.food_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donor.name && donation.donor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === 'All Categories' || donation.category.toLowerCase() === category.toLowerCase();
    
    // Simple distance filtering
    let matchesDistance = true;
    if (distance === 'Within 1 mile') {
      matchesDistance = parseFloat(donation.distance || "0") <= 1;
    } else if (distance === 'Within 5 miles') {
      matchesDistance = parseFloat(donation.distance || "0") <= 5;
    } else if (distance === 'Within 10 miles') {
      matchesDistance = parseFloat(donation.distance || "0") <= 10;
    } else if (distance === 'Within 25 miles') {
      matchesDistance = parseFloat(donation.distance || "0") <= 25;
    }
    
    return matchesSearch && matchesCategory && matchesDistance;
  });

  // Pagination
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const displayedDonations = filteredDonations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <PageLayout>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Available Donations
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          {error ? "Error loading donations" : "Browse through available food donations in your area."}
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mb: 6, borderRadius: 2 }}>
        {loading && <Typography>Loading donations...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search donations..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Distance</InputLabel>
                <Select
                  value={distance}
                  onChange={handleDistanceChange}
                  label="Distance"
                >
                  {DISTANCES.map((dist) => (
                    <MenuItem key={dist} value={dist}>
                      {dist}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button 
                variant="contained" 
                color="success" 
                fullWidth
                sx={{ height: '56px' }}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" component="p">
            Showing {filteredDonations.length} {filteredDonations.length === 1 ? 'result' : 'results'}
          </Typography>
          <Button 
            variant="outlined"
            color="success"
            component={Link}
            to="/login"
          >
            Log in to Request Donations
          </Button>
        </Box>

        {/* Donations Grid */}
        {filteredDonations.length > 0 ? (
          <Grid container spacing={4}>
            { displayedDonations.map((donation) => (
              <Grid item xs={12} sm={6} md={6} key={donation._id}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ 
                      
                      height: { xs: '200px', sm: 'auto' }
                    }}
                    image={donation.image ? `${BASE_URL}/${donation.image}` : PLACEHOLDER_IMAGE}
                    alt={donation.food_name}
                    
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '60%' } }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {donation.food_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {donation.description}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RestaurantIcon color="primary" fontSize="small" />
                            <Typography variant="body2">
                              {donation.quantity}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon color="error" fontSize="small" />
                            <Typography variant="body2">
                              Expires in: {donation.expiry_date ? new Date(donation.expiry_date).toLocaleString() : "No timestamp"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationOnIcon color="info" fontSize="small" />
                        <Typography variant="body2">
                          {donation.pickup_location} ({donation.distance})
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={donation.category} 
                        color="primary" 
                        variant="outlined" 
                        size="small" 
                      />
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Donor: {donation.donor.name}
                      </Typography>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        component={Link}
                        to="/login">
                        Login to Request
                      </Button>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper 
            elevation={0} 
            sx={{ 
              py: 8, 
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 2
            }}
          >
            <InfoIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" component="p" paragraph>
              No donations found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search criteria or check back later.
            </Typography>
          </Paper>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="success"
              size="large"
            />
          </Box>
        )}
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: 'success.main', 
          color: 'white', 
          py: 6, 
          mt: 10, 
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Want to Make a Donation?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            Join our platform to donate surplus food and help reduce food waste while helping those in need.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            component={Link} 
            to="/register"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Register as a Donor
          </Button>
        </Container>
      </Box>
    </PageLayout>
  );
};

export default DonationsPage;
