import { 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import KenyaMap from "@/components/KenyaMap";// Import the interactive map component

const Contact = () => {
  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Have questions about FoodShare? We're here to help.
              </Typography>
            </Box>

            <Box component="form">
              <TextField
                fullWidth
                id="name"
                label="Name"
                variant="outlined"
                margin="normal"
                placeholder="Your name"
              />
              
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                margin="normal"
                placeholder="you@example.com"
              />
              
              <TextField
                fullWidth
                id="message"
                label="Message"
                variant="outlined"
                multiline
                rows={6}
                margin="normal"
                placeholder="Your message"
              />

              <Button 
                variant="contained" 
                color="success" 
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Send Message
              </Button>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%', 
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              <Typography color="text.secondary" paragraph>
                Reach out to us through any of these channels. We're here to help!
              </Typography>

              <List sx={{ mt: 4 }}>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <Email color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary="contact@foodshare.org" 
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemIcon>
                    <Phone color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary="+1 (555) 123-4567" 
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemIcon>
                    <LocationOn color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Address" 
                    secondary="Ngong Road, Nairobi, Kenya" 
                  />
                </ListItem>
              </List>

              {/* Map Placeholder */}
              <Box 
                sx={{ 
                  mt: 4, 
                  bgcolor: 'grey.100', 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  aspectRatio: '16/9'
                }}
              >
                <KenyaMap /> {/* Replace with the actual map component */}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
