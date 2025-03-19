import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { message} from 'antd';
import { Modal, Button, Form, Table } from "react-bootstrap";
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
  MenuItem,
  Menu,
  IconButton,
  CssBaseline,
  useTheme,
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
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context

const iconMap = {
  Home: HomeIcon,
  Users: PeopleIcon,
  Donations: InventoryIcon,
  Reports: BarChartIcon,
  Settings: SettingsIcon,
  "My Donations": FavoriteIcon,
  "Create Donation": AddIcon,
};

const drawerWidth = 240;

const donorSidebarItems = [
  { icon: "Home", label: "Overview", href: "/dashboard/donor" },
  { icon: "My Donations", label: "My Donations", href: "/dashboard/donor/my-donations" },
  { icon: "Manage Donation Claims", label: "Manage Donation Claim", href: "/dashboard/donor/claims" },
  { icon: "Settings", label: "Settings", href: "/settings" },
];

const MyDonations = ({title}) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
    const { user } = useAuth();
    const userType = user?.role || "donor";
  
    const [showModal, setShowModal] = useState(false);
    const [newDonation, setNewDonation] = useState({ food_name: "", quantity: "" });
  
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food/my-donations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDonations(response.data);
      } catch (error) {
        message.error('Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);
  
  const sidebarItemsMap = { donor: donorSidebarItems };
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
  
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewDonation({ ...newDonation, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setDonations([...donations, { ...newDonation, id: donations.length + 1 }]);
      setNewDonation({ food_name: "", quantity: "" });
      handleClose();
    };
  
    const isActive = (href) => {
      return window.location.pathname === href;
    };
  
    const drawer = (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FavoriteIcon sx={{ fontSize: "2rem", color: "primary.main", mb: 1 }} />
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
                    <Button variant="success" onClick={handleShow} className="mb-3">
                      <AddIcon /> Create Donation
                    </Button>
            
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Food Name</th>
                          <th>Quantity</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>

                        </tr>
                      </thead>
                      <tbody>
                        {donations.length > 0 ? (
                          donations.map((donation, index) => (
                            <tr key={donation._id}>
                              <td>{index + 1}</td>
                              <td>{donation.food_name}</td>
                              <td>{donation.quantity}</td>
                              <td>{donation.status}</td>
                              <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                            
                              
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">No donations available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Box>
            
                  <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Donation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Food Name</Form.Label>
                          <Form.Control type="text" name="foodName" value={newDonation.foodName} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control type="number" name="quantity" value={newDonation.quantity} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="success" type="submit">Submit</Button>
                      </Form>
                    </Modal.Body>
                  </Modal>
                </Box>
                
              );
            };

export default MyDonations;
