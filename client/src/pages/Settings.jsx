import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,Typography,Divider,List,ListItem,ListItemIcon,ListItemText,Drawer,Toolbar,AppBar,Avatar,MenuItem,Menu,IconButton,Button,CssBaseline,useTheme,CircularProgress,
  Paper,Container,Grid,Card,CardContent,Dialog,DialogTitle,Tabs,Tab,CardHeader,TextField,DialogContent,DialogContentText,DialogActions,Alert, FormControlLabel,Switch} from "@mui/material";
import {
  BarChart as BarChartIcon,Home as HomeIcon,Inventory as InventoryIcon,Settings as SettingsIcon,People as PeopleIcon,Favorite as FavoriteIcon,Logout as LogoutIcon,Menu as MenuIcon,Person as PersonIcon,ChevronRight as ChevronRightIcon,Fastfood as FastfoodIcon,AssignmentTurnedIn as AssignmentTurnedInIcon,
  Person, Security, Notifications, Logout, Save,PhotoCamera,VerifiedUser,Delete} from "@mui/icons-material";
import axios from 'axios';
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { Mail, Lock, Eye, EyeOff, User, CheckCircle, Home, Phone, Upload } from "lucide-react";

const iconMap = {
  Home: HomeIcon,
  Users: PeopleIcon,
  Donations: InventoryIcon,
  Reports: BarChartIcon,
  Settings: SettingsIcon,
  "My Requests": AssignmentTurnedInIcon,
  "Available Donations": FastfoodIcon,
  "My Donations": FavoriteIcon,
  "Manage Donation Claims": AssignmentTurnedInIcon,
};

const drawerWidth = 240;

const settings = ({ title }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userType = user?.role || "Null";

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Fetched User Data:", response.data);
        setUserData(response.data); // Ensure userData is set
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleSaveProfile = () => {
    // In a real app, you would save the user data to your backend
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);
    // In a real app, you would delete the user account
  };

  const adminSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/admin" },
    { icon: "Users", label: "Users", href: "/dashboard/admin/manage-users" },
    { icon: "Reports", label: "Reports", href: "/dashboard/admin/reports" },
    { icon: "Donations", label: "Donations", href: "/dashboard/admin/donations" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
  const donorSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/donor" },
    { icon: "My Donations", label: "My Donations", href: "/dashboard/donor/my-donations" },
    { icon: "Manage Donation Claims", label: "Manage Donation Claim", href: "/dashboard/donor/claims" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
  
  const recipientSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/recipient" },
    { icon: "Available Donations", label: "Available Donations", href: "/dashboard/recipient/available-food" },
    { icon: "My Requests", label: "My Requests", href: "/dashboard/recipient/my-requests" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
  
  const ngoSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/ngo" },
    { icon: "Available Donations", label: "Available Donations", href: "/dashboard/ngo/available" },
    { icon: "My Requests", label: "My Requests", href: "/dashboard/ngo/requests" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
  
    const sidebarItemsMap = {
      admin: adminSidebarItems,
      donor: donorSidebarItems,
      recipient: recipientSidebarItems,
      ngo: ngoSidebarItems,
    };
  
    const sidebarItems = sidebarItemsMap[userType];
    const userRoleLabel = userType
      ? userType.charAt(0).toUpperCase() + userType.slice(1)
      : "User";
      console.log("userType:", userType);
      console.log("userRoleLabel:", userRoleLabel);
  

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
            Account Settings
          </Typography>
          <Box sx={{ p: 3 }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Manage your account settings and preferences
                    </Typography>
            
                    <Grid container spacing={3}>
                      {/* Left side - Navigation */}
                      <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                          <CardContent sx={{ px: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ position: 'relative', mb: 2 }}>
                                <Avatar 
                                  src={user.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${user.profile_picture}`: "https://randomuser.me/api/portraits/women/44.jpg" }
                                  alt={user.name}
                                  sx={{ width: 100, height: 100 }}
                                />
                                <IconButton 
                                  sx={{ 
                                    position: 'absolute', 
                                    bottom: 0, 
                                    right: 0, 
                                    bgcolor: 'background.paper',
                                    '&:hover': { bgcolor: 'background.paper' } 
                                  }}
                                  size="small"
                                >
                                  <PhotoCamera fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography variant="h6">{user.name}</Typography>
                              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <VerifiedUser fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                                <Typography variant="body2" color="primary">Verified {user.role}</Typography>
                              </Box>
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Tabs
                              orientation="vertical"
                              variant="scrollable"
                              value={activeTab}
                              onChange={handleTabChange}
                              sx={{ borderRight: 1, borderColor: 'divider' }}
                            >
                              <Tab icon={<Person />} label="Profile" sx={{ alignItems: 'flex-start', pl: 0 }} />
                              <Tab icon={<Security />} label="Security" sx={{ alignItems: 'flex-start', pl: 0 }} />
                              <Tab icon={<Notifications />} label="Notifications" sx={{ alignItems: 'flex-start', pl: 0 }} />
                            </Tabs>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <List component="nav" dense>
                              <ListItem button component= {Link} to = "/login" sx={{ borderRadius: 1 }}>
                                <ListItemIcon>
                                  <Logout fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                              </ListItem>
                              <ListItem 
                                button 
                                sx={{ borderRadius: 1, color: 'error.main' }}
                                onClick={() => setDeleteDialogOpen(true)}
                              >
                                <ListItemIcon>
                                  <Delete fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Delete Account" 
                                  primaryTypographyProps={{ color: 'error' }}
                                />
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      {/* Right side - Content */}
                      <Grid item xs={12} md={9}>
                        {saveSuccess && (
                          <Alert severity="success" sx={{ mb: 2 }}>
                            Your profile has been updated successfully!
                          </Alert>
                        )}
                        
                        {/* Profile Tab */}
                        {activeTab === 0 && (
                          <Card elevation={3}>
                            <CardHeader title="Profile Information" />
                            <Divider />
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} >
                                  <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={user.name}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    type="email"
                                    label="Email Address"
                                    name="email"
                                    value={user.email}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12} >
                                  <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={userData?.phone}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: Boolean(userData?.phone) }}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={userData?.location}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: Boolean(userData?.location) }}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Bio"
                                    defaultValue="I'm passionate about reducing food waste and helping my community."
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Button 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<Save />}
                                    onClick={handleSaveProfile}
                                  >
                                    Save Changes
                                  </Button>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        )}
                        
                        {/* Security Tab */}
                        {activeTab === 1 && (
                          <Card elevation={3}>
                            <CardHeader title="Security Settings" />
                            <Divider />
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Change Password
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Current Password"
                                    type="password"
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="New Password"
                                    type="password"
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type="password"
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Button 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<Save />}
                                  >
                                    Update Password
                                  </Button>
                                </Grid>
                              </Grid>
                              
                              <Box sx={{ mt: 4, mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                  Two-Factor Authentication
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  Add an extra layer of security to your account
                                </Typography>
                                <FormControlLabel 
                                  control={<Switch color="primary" />} 
                                  label="Enable two-factor authentication" 
                                />
                              </Box>
                              
                              <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                  Login Sessions
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  Manage your active sessions
                                </Typography>
                                <List>
                                  <ListItem sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                    <ListItemText 
                                      primary="San Francisco, United States" 
                                      secondary="Current session - Chrome on Windows" 
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      Active now
                                    </Typography>
                                  </ListItem>
                                  <ListItem sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                    <ListItemText 
                                      primary="San Francisco, United States" 
                                      secondary="iPhone 13 - Safari" 
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      2 days ago
                                    </Typography>
                                  </ListItem>
                                </List>
                                <Button 
                                  variant="outlined" 
                                  color="error" 
                                  sx={{ mt: 2 }}
                                >
                                  Logout of All Sessions
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                        
                        {/* Notifications Tab */}
                        {activeTab === 2 && (
                          <Card elevation={3}>
                            <CardHeader title="Notification Preferences" />
                            <Divider />
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Email Notifications
                              </Typography>
                              <List>
                                <ListItem>
                                  <ListItemText 
                                    primary="New donation request" 
                                    secondary="Get notified when someone requests your donation"
                                  />
                                  <Switch defaultChecked />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                  <ListItemText 
                                    primary="Donation accepted" 
                                    secondary="Get notified when your request is accepted"
                                  />
                                  <Switch defaultChecked />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                  <ListItemText 
                                    primary="New messages" 
                                    secondary="Get notified when you receive a new message"
                                  />
                                  <Switch defaultChecked />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                  <ListItemText 
                                    primary="System updates" 
                                    secondary="Get important updates about the platform"
                                  />
                                  <Switch />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                  <ListItemText 
                                    primary="Marketing emails" 
                                    secondary="Get updates about new features and events"
                                  />
                                  <Switch />
                                </ListItem>
                              </List>
                              
                              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                                Push Notifications
                              </Typography>
                              <FormControlLabel 
                                control={<Switch defaultChecked color="primary" />} 
                                label="Enable push notifications on this device" 
                              />
                              
                              <Box sx={{ mt: 3 }}>
                                <Button 
                                  variant="contained" 
                                  color="primary" 
                                  startIcon={<Save />}
                                >
                                  Save Preferences
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                    </Grid>
                  </Container>
                  
                  {/* Delete Account Dialog */}
                  <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                  >
                    <DialogTitle>Delete Account?</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        This action is permanent and cannot be undone. All your data will be permanently removed.
                        Are you sure you want to delete your account?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleDeleteAccount} color="error">
                        Delete Account
                      </Button>
                    </DialogActions>
                  </Dialog>
          
    </Box>
        
      </Box>
    </Box>
    
  );
};

export default settings;
