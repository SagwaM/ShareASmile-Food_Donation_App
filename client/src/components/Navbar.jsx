import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Button, 
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  useScrollTrigger,
  Slide,
  Divider,
  useTheme,
  ListItemButton,
} from '@mui/material';
import ThemeToggle from "./ThemeToggle";
import { Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


// Hide AppBar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/donations', label: 'Available Donations' },
  ];

  const isActive = (path) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <ThemeToggle />
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.default',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: 'text.primary',
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <Heart 
                  size={32} 
                  className="animate-pulse" 
                  color={theme.palette.success.main} 
                  style={{ marginRight: '8px' }} 
                />
                <Typography 
                  variant="h5" 
                  component="div" 
                  fontWeight="bold"
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    fontFamily: 'Playfair Display, serif',
                    background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  ShareASmile
                </Typography>
              </Link>

              <Box sx={{ flexGrow: 1 }} />

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color={isActive(item.path) ? "success" : "inherit"}
                    sx={{ 
                      mx: 1,
                      fontWeight: isActive(item.path) ? 600 : 400,
                      position: 'relative',
                      '&::after': isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        width: '30%',
                        height: '3px',
                        bottom: '6px',
                        left: '35%',
                        backgroundColor: 'success.main',
                        borderRadius: '2px'
                      } : {}
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="success"
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>
              </Box>

              {/* Mobile menu button */}
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setIsOpen(!isOpen)}
                sx={{ display: { md: 'none' } }}
              >
                <Menu />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Add toolbar spacing */}
      <Toolbar />

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: '300px',
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Heart size={24} color={theme.palette.success.main} />
            <Typography variant="h6" component="div" fontWeight="bold">
              FoodShare
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </IconButton>
        </Box>
        
        <Divider />
        
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                py: 1.5,
                color: isActive(item.path) ? 'success.main' : 'text.success',
                bgcolor: isActive(item.path) ? 'action.selected' : 'transparent',
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? 600 : 400 
                }} 
              />
            </ListItemButton>
          ))}
        </List>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button 
            component={Link} 
            to="/login" 
            fullWidth 
            variant="outlined" 
            color="success"
          >
            Login
          </Button>
          <Button 
            component={Link} 
            to="/register" 
            fullWidth 
            variant="contained" 
            color="success"
          >
            Register
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
