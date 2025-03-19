import { Button, Typography, Container, Box, Grid, Paper } from '@mui/material';
import { ArrowForward, Favorite, People, Restaurant } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: { xs: 8, sm: 12 },
          position: 'relative',
          backgroundImage: 'linear-gradient(to bottom, rgba(147,39,143,0.1) 5.9%, rgba(234,172,232,0.1) 64%, rgba(246,219,245,0.1) 89%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,1))',
            }
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1920&h=1080"
            alt="Food sharing background"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.2,
            }}
          />
        </Box>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ animation: 'float 3s ease-in-out infinite' }}>
              <Favorite sx={{ fontSize: 64, color: 'success.main', mx: 'auto' }} />
            </Box>
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Share Food, Share{' '}
              <Box component="span" color="success.main">Love</Box>
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 600, mx: 'auto', mb: 4, color: 'text.secondary' }}>
              Join our community in reducing food waste and helping those in need.
              Every donation makes a difference.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'center', 
              gap: 2 
            }}>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained" 
                size="large" 
                color="success"
                endIcon={<ArrowForward />}
                sx={{ px: 4, py: 1.5 }}
              >
                Start Donating
              </Button>
              <Button 
                component={Link} 
                to="/donations" 
                variant="outlined" 
                size="large"
                color="success"
                sx={{ px: 4, py: 1.5 }}
              >
                View Donations
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 4, height: '100%', textAlign: 'center', borderRadius: 2 }}>
                <Restaurant sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Donate Food</Typography>
                <Typography color="text.secondary">
                  Restaurants and individuals can easily donate excess food to those in need.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 4, height: '100%', textAlign: 'center', borderRadius: 2 }}>
                <People sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Connect Communities</Typography>
                <Typography color="text.secondary">
                  Bridge the gap between donors and recipients through our platform.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 4, height: '100%', textAlign: 'center', borderRadius: 2 }}>
                <Favorite sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Make an Impact</Typography>
                <Typography color="text.secondary">
                  Help reduce food waste while supporting those facing food insecurity.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: 'success.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Ready to Make a Difference?
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', mb: 4, opacity: 0.9 }}>
              Join our growing community of donors and recipients. Together, we can create a world where no food goes to waste.
            </Typography>
            <Button 
              component={Link} 
              to="/register" 
              variant="contained" 
              size="large"
              color="secondary"
              sx={{ px: 4, py: 1.5 }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
