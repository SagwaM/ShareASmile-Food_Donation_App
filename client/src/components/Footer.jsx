
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link as MuiLink, 
  List, 
  ListItem, 
  Stack, 
  Paper,
  Divider,
  Button,
  TextField,
  IconButton,
  useTheme
} from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import { Heart, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        borderTop: 1, 
        borderColor: 'divider',
        mt: 8
      }}
    >
      {/* Newsletter Section */}
      <Box 
        sx={{ 
          py: 6, 
          backgroundImage: `linear-gradient(to right, ${theme.palette.primary.light}15, ${theme.palette.primary.main}15)` 
        }}
      >
        <Container maxWidth="lg">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              backgroundImage: `linear-gradient(135deg, ${theme.palette.success.light}30, ${theme.palette.success.main}10)`,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom fontFamily="'Playfair Display', serif" fontWeight="bold">
                  Join Our Newsletter
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Stay updated with the latest food sharing opportunities and community events
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Your email address"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <Mail size={18} style={{ marginRight: 8, opacity: 0.7 }} />,
                    }}
                  />
                  <Button 
                    variant="contained" 
                    color="success" 
                    endIcon={<ArrowRight size={18} />}
                  >
                    Subscribe
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Heart size={24} color={theme.palette.success.main} />
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  fontFamily="'Playfair Display', serif"
                  sx={{
                    background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  ShareASmile
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                Connecting those who can give with those in need. Together, we can reduce food waste and help our community thrive.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" color="success" sx={{ border: 1, borderColor: 'divider' }}>
                  <Facebook fontSize="small" />
                </IconButton>
                <IconButton size="small" color="success" sx={{ border: 1, borderColor: 'divider' }}>
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton size="small" color="success" sx={{ border: 1, borderColor: 'divider' }}>
                  <Instagram fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <List disablePadding>
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About Us' },
                { path: '/donations', label: 'Find Food' },
                { path: '/contact', label: 'Contact Us' }
              ].map((item) => (
                <ListItem disableGutters key={item.path} sx={{ py: 0.5 }}>
                  <MuiLink 
                    component={Link} 
                    to={item.path} 
                    color="text.secondary" 
                    underline="hover" 
                    variant="body2"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      '&:hover': { color: 'success.main' },
                      transition: 'color 0.2s'
                    }}
                  >
                    <ArrowRight size={14} style={{ marginRight: 4 }} />
                    {item.label}
                  </MuiLink>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <List disablePadding>
              <ListItem disableGutters sx={{ py: 0.75 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Mail size={18} color={theme.palette.text.secondary} style={{ marginTop: 3 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Us:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      contact@foodshare.org
                    </Typography>
                  </Box>
                </Stack>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.75 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Phone size={18} color={theme.palette.text.secondary} style={{ marginTop: 3 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Call Us:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                </Stack>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.75 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <MapPin size={18} color={theme.palette.text.secondary} style={{ marginTop: 3 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Visit Us:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                    Ngong Road, Nairobi, Kenya
                    </Typography>
                  </Box>
                </Stack>
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Join Our Mission
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Sign up today to make a real difference in your community.
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="success"
              endIcon={<ArrowRight size={18} />}
              sx={{ mt: 1 }}
            >
              Get Started
            </Button>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Already have an account?
              </Typography>
              <MuiLink
                component={Link}
                to="/login"
                underline="hover"
                sx={{ fontSize: '0.875rem' }}
              >
                Login here
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} FoodShare. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <MuiLink component={Link} to="/privacy" color="text.secondary" underline="hover" variant="body2">
              Privacy Policy
            </MuiLink>
            <MuiLink component={Link} to="/terms" color="text.secondary" underline="hover" variant="body2">
              Terms of Service
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
