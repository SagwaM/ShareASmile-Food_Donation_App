import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  AppBar,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  MenuItem,
  Menu,
  IconButton,
  Button,
  CssBaseline,
  useTheme,
  CircularProgress,
  Paper
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  Home as HomeIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  ChevronRight as ChevronRightIcon,
  Fastfood as FastfoodIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon
} from "@mui/icons-material";
import axios from 'axios';
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const iconMap = {
  Home: HomeIcon,
  Users: PeopleIcon,
  Donations: InventoryIcon,
  Reports: BarChartIcon,
  Settings: SettingsIcon,
  "My Requests": AssignmentTurnedInIcon,
  "Available Donations": FastfoodIcon,
};

const drawerWidth = 240;

const AvailableDonations = ({ title }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userType = user?.role || "Null";

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/food/available`);
        console.log("Donations Response:", response.data);
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
}, []);

const handleRequest = async (id) => {
    console.log("Claiming food with ID:", id); // Debugging
    if (!id) {
        console.error("Food ID is undefined! Fix the issue before making the request.");
        iziToast.error({ title: "Error", message: "Food ID is missing!", position: "topRight" });
        return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/food/claim/${id}`, {},
        { headers: { Authorization: `Bearer ${token}` } 
      });
      iziToast.success({
        title: "Success",
        message: "Request sent successfully!",
        position: "topRight",
      });
    } catch (error) {
      console.error("Error sending request:", error);
      iziToast.error({
        title: "Error",
        message: "Failed to send request.",
        position: "topRight",
      });
    }
  };
  if (loading) return <CircularProgress animation="border" />;

const recipientSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/recipient" },
    { icon: "Available Donations", label: "Available Donations", href: "/dashboard/recipient/available-food" },
    { icon: "My Requests", label: "My Requests", href: "/dashboard/recipient/my-requests" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
 

  const sidebarItemsMap = { recipient: recipientSidebarItems };
  const sidebarItems = sidebarItemsMap[userType];

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
 

  const isActive = (href) => {
    return window.location.pathname === href;
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FavoriteIcon sx={{ fontSize: "2rem", color: "success.main", mb: 1 }} />
        <Typography 
            variant="h5" 
            component="div"
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(45deg, #558B2F 30%, #7CB342 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            ShareASmile
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              backgroundColor: 'primary.main', 
              color: 'primary.contrastText',
              py: 0.75,
              px: 1.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 500,
              mt: 1,
            }}
          >
            Welcome, {user?.name || "User"}
          </Box>
      </Box>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'text.secondary',
            ml: 1,
          }}
        >
            Main Menu
        </Typography>
        </Box>

      <List sx={{ px: 1, flexGrow: 1 }}>
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon] || HomeIcon;
          return (
            <ListItem 
              key={item.href}
              disablePadding
              component={Link}
              to={item.href}
              sx={{ 
                display: 'block', 
                mb: 0.5,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  backgroundColor: isActive(item.href) 
                    ? 'primary.main' 
                    : 'transparent',
                  color: isActive(item.href) 
                    ? 'primary.contrastText'
                    : 'text.primary',
                  '&:hover': {
                  backgroundColor: isActive(item.href) 
                    ? 'primary.dark'
                    : theme.palette.action.hover,
                          },
                  transition: 'background-color 0.2s ease',
                }}
              >
                    <ListItemIcon 
                      sx={{ 
                        color: isActive(item.href) 
                            ? 'primary.contrastText'
                            : 'inherit',
                            minWidth: 36
                      }}
                    >
                    <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{ 
                          fontSize: 14,
                        fontWeight: isActive(item.href) ? 600 : 400
                        }}
                    />
                    {isActive(item.href) && (
                        <ChevronRightIcon fontSize="small" />
                    )}
                </Box>
                </ListItem>
            );
            })}
            </List>
      
            <Divider sx={{ mt: 'auto' }} />
      
            <Box sx={{ p: 2 }}>
                <ListItem 
                  component={Link}
                  to="/"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      bgcolor: theme.palette.action.selected,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Back to Site" 
                    primaryTypographyProps={{ 
                      fontSize: 14 
                    }} 
                  />
            </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.default',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              color: 'Green',
              py: 0.75,
              px: 1.5,
              borderRadius: 1,
              fontSize: '1.2rem',
              fontWeight: 700,
              mt: 1,
              textTransform: 'capitalize', // Capitalizes 
            }}
          >
            {user?.role || "User"} Dashboard
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          
          <Box sx={{ ml: 2 }}>
            <IconButton 
              onClick={handleProfileClick}
              sx={{ 
                p: 0.5, 
                border: `2px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                }
              }}
            >
              <Avatar 
                alt="User Profile"
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main'
                }}
              >
                <PersonIcon fontSize="small" />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileClose} component= {Link} to="/profile">Profile</MenuItem>
              <MenuItem onClick={handleProfileClose} component= {Link} to="/settings"> Account Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileClose} component={Link} to="/login">
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              boxShadow: 3,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: 'none',
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Typography 
            variant="h3" 
            component="div"
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(45deg, #558B2F 30%, #7CB342 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            Available Food
          </Typography>
          <Box sx={{ p: 3 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: theme.palette.background.default }}>
            <Table>
                <TableHead>
                <TableRow sx={{ backgroundColor: "#1976D2", color: "white" }}>
                    <TableCell sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}>Food Name</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}>Donor</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {donations.map((donation) => (
                    <TableRow key={donation._id} sx={{ "&:nth-of-type(odd)": { backgroundColor: theme.palette.background.paper } }}>
                    <TableCell sx={{ color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}` }}>{donation.food_name}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}` }}>{donation.donor.name}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}` }}>{donation.donor.email}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Button 
                        onClick={() => handleRequest(donation._id)} 
                        sx={{ backgroundColor: "#4CAF50", color: "white", "&:hover": { backgroundColor: "#388E3C" } }}
                        >
                        Request Food
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </TableContainer>

    </Box>
        
      </Box>
    </Box>
    
  );
};

export default AvailableDonations;