import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button
} from '@mui/material';
import { Favorite, People, EmojiEvents } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Box>
      {/* Hero Section with gradient and image */}
      <Box sx={{
        py: 10,
        position: 'relative',
        backgroundImage: 'linear-gradient(135deg, rgba(147,39,143,0.1) 5.9%, rgba(234,172,232,0.1) 64%, rgba(246,219,245,0.1) 89%)',
      }}>
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
            src="/images/Food_Sharing_Community.png"
            alt="Community food sharing"
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
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Our Mission to Fight Food Waste
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto', color: 'text.secondary' }}>
              We're building a community that connects food donors with those in need,
              making sure no food goes to waste while helping people in our community.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <People sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold">1,000+</Typography>
                <Typography color="text.secondary">Active Donors</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Favorite sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold">5,000+</Typography>
                <Typography color="text.secondary">Meals Shared</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <EmojiEvents sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold">50+</Typography>
                <Typography color="text.secondary">Partner Organizations</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission Section with image */}
      <Box sx={{ 
        py: 10, 
        backgroundImage: 'linear-gradient(90deg, rgba(254,100,121,0.1) 0%, rgba(251,221,186,0.1) 100%)'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Why We Do What We Do
                </Typography>
                <Typography paragraph color="text.secondary">
                  Every day, tons of perfectly good food goes to waste while many
                  people struggle to put meals on their tables. We believed there
                  had to be a better way.
                </Typography>
                <Typography paragraph color="text.secondary">
                  ShareASmile was born from a simple idea: connect those with excess
                  food to those who need it most. Our platform makes it easy to donate
                  food that would otherwise go to waste, ensuring it reaches people
                  in our community who can use it.
                </Typography>
                <Button 
                  component={Link}
                  to="/register"
                  variant="contained" 
                  color="success"
                  sx={{ mt: 2 }}
                >
                  Join Our Mission
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 5,
                  aspectRatio: '1/1',
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
              >
                <img
                  src="/images/Food_Sharing_Community.png"
                  alt="Food sharing community"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
