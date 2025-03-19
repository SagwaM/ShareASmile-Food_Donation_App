import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  Chip,
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
  CircularProgress,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
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
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Fastfood as FastfoodIcon,
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
  "Available Donations": FastfoodIcon,
  "My Requests": AssignmentTurnedInIcon,
};

const drawerWidth = 240;

const MyRequests = ({ title }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userType = user?.role || "Null";

  const [requests, setRequests] = useState([]);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/food/requests",
          { headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Requests:", response.data);
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  const handleCancelRequest = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/food/cancel/${id}`, {}, 
        {headers: { Authorization: `Bearer ${token}` },
      });
  
      iziToast.success({
        title: "Success",
        message: "Request cancelled successfully!",
        position: "topRight",
      });
  
      // Update state to remove the cancelled request
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== id));
  
    } catch (error) {
      console.error("Error cancelling request:",error.response?.data || error.message);
  
      iziToast.error({
        title: "Error",
        message: error.response?.data?.message || "Failed to cancel request. Try again!",
        position: "topRight",
      });
    }
  };
  
  const ngoSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/ngo" },
    { icon: "Available Donations", label: "Available Donations", href: "/dashboard/ngo/available" },
    { icon: "My Requests", label: "My Requests", href: "/dashboard/ngo/requests" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
  
 

  const sidebarItemsMap = { ngo: ngoSidebarItems };
  const sidebarItems = sidebarItemsMap[userType] || [];

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
 

  const isActive = (href) => location.pathname === href;
  

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
            My Requests
          </Typography>
          <Box sx={{ p: 3 }}>
      {/* Summary Section */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", borderRadius: 2, flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>Total Requests</Typography>
          <Typography variant="h4">{requests.length}</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: "success.main", color: "white", borderRadius: 2, flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>Approved</Typography>
          <Typography variant="h4">
            {requests.filter(req => req.approval_status === "Approved").length}
          </Typography>
        </Box>
      </Box>
      
      {/* Loading Indicator */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {requests.map((request, index) => (
            <Card key={index} sx={{ mb: 2, p: 2, boxShadow: 3, borderRadius: 2 }}>
              <ListItem disablePadding>
                <ListItemText
                  primary={request.food_name}
                  secondary={`Claimed At: ${new Date(request.claimed_date).toLocaleDateString()}, ${request.approval_status}`}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: 16 }}
                  secondaryTypographyProps={{ fontSize: 13, color: "text.secondary" }}
                />
                 {request.status !== "Cancelled" && (
                   <>
                    <button
                        onClick={() => handleCancelRequest(request._id)}
                        style={{
                        backgroundColor: "#d9534f",
                        color: "#fff",
                        padding: "5px 10px",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                        marginTop: "10px",
                        }}
                    >
                        Cancel Request
                    </button>
                <Chip
                  label={request.status}
                  color={
                    request.approval_status === "Approved" ? "success" :
                    request.approval_status === "Pending" ? "warning" : "error"
                  }
                  sx={{ ml: 2, fontWeight: 500 }}
                />
                </>
                )}
              </ListItem>
                
            </Card>
            
          ))}
        </List>
      )}

    </Box>
        
      </Box>
    </Box>
    
  );
};

export default MyRequests;
