import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,Typography,Divider,List,ListItem,ListItemIcon,ListItemText,Drawer,Toolbar,AppBar,Avatar,MenuItem,Menu,IconButton,Button,
  CssBaseline,useTheme,CircularProgress,Container,Grid,Card,CardHeader,Chip,CardContent,CardActions} from "@mui/material";
import {
  BarChart as BarChartIcon,Home as HomeIcon,Inventory as InventoryIcon,Settings as SettingsIcon,People as PeopleIcon,Favorite as FavoriteIcon,Logout as LogoutIcon,Menu as MenuIcon, Person as PersonIcon,ChevronRight as ChevronRightIcon,Fastfood as FastfoodIcon,AssignmentTurnedIn as AssignmentTurnedInIcon, Person, Email, 
  Phone, LocationOn, Edit, FavoriteBorder,VerifiedUser,AccessTime,CalendarToday} from "@mui/icons-material";
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
  "Manage Donation Claims": AssignmentTurnedInIcon,
  "My Donations": FavoriteIcon,
};

const drawerWidth = 240;

const Profile = ({ title }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userType = user?.role || "Null";
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ totalDonations: 0, donationImpact: 0, badges: [] });
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
              color: 'black',
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
            Profile
          </Typography>
          <Box sx={{ p: 3 }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Left Column - User Info Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar 
                    src={userData?.profile_picture} 
                    alt={userData?.name}
                    sx={{ width: 80, height: 80, mx: 'auto' }}
                  />
                }
                title={
                  <Typography variant="h5" align="center" sx={{ mt: 2 }}>
                    {user.name}
                  </Typography>
                }
                subheader={
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" />
                      {userData?.location || "Not Available"}
                    </Typography>
                    <Chip 
                      label={user.role} 
                      color="success" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                }
                sx={{ flexDirection: 'column', alignItems: 'center' }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{userData?.phone || "Not Available"}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{userData?.location || "Not Available"}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2">Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}</Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Edit />}
                  component="a"
                  href="/settings"
                >
                  Edit Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Right Column - Stats, Achievements, Recent Activity */}
          <Grid item xs={12} md={8} container spacing={3}>
            {/* Stats Card */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardHeader 
                  title="Donation Impact" 
                  subheader="Your contribution to the community"
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2, opacity: 0.8 }}>
                        <FavoriteBorder sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold">{stats.totalDonations}</Typography>
                        <Typography variant="body2" color="text.secondary">Total Donations</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 2, opacity: 0.8 }}>
                        <VerifiedUser sx={{ fontSize: 40, mb: 1, color: 'secondary.main' }} />
                        <Typography variant="h4" fontWeight="bold">{stats.donationImpact}</Typography>
                        <Typography variant="body2" color="text.secondary">Meals Provided</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                        <Person sx={{ fontSize: 40, mb: 1, color: 'text.secondary' }} />
                        <Typography variant="h4" fontWeight="bold">{stats.badges.length}</Typography>
                        <Typography variant="body2" color="text.secondary">Badges Earned</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardHeader 
                  title="Recent Activity" 
                  subheader="Your latest actions and donations"
                />
                <Divider />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[1, 2, 3].map((_, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: 2, 
                          p: 1.5, 
                          border: 1, 
                          borderColor: 'divider', 
                          borderRadius: 1 
                        }}
                      >
                        <Box sx={{ bgcolor: 'primary.light', p: 1, borderRadius: '50%' }}>
                          <FavoriteBorder sx={{ color: 'primary.main' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            Donated Fresh Produce
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {index === 0 ? '2 days ago' : index === 1 ? '1 week ago' : '3 weeks ago'}
                          </Typography>
                        </Box>
                        <Button variant="text" size="small">View</Button>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    component="a" 
                    href="/donations/my"
                  >
                    View All Activity
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box> 
      </Box>
    </Box>
    
  );
};

export default Profile;
