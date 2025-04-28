import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
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
import axios from 'axios';
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context

const iconMap = {
  Home: HomeIcon,
  Users: PeopleIcon,
  Donations: InventoryIcon,
  Reports: BarChartIcon,
  Settings: SettingsIcon,
};

const drawerWidth = 240;

const ManageUsers = ({ title }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userType = user?.role || "Null";

  const [users, setUsers] = useState([]);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem("token");

  const StatusBadge = ({ role }) => {
      let backgroundColor, textColor;
    
      switch (role) {
        case 'admin':
          backgroundColor = 'rgba(9, 103, 31, 0.1)'; // Light green
          textColor = '#28a745'; // Green text
          break;
        case 'donor':
          backgroundColor = 'rgba(0, 123, 255, 0.1)'; // Light blue
          textColor = '#007bff'; // Blue text
          break;
        case 'ngo':
          backgroundColor = 'rgba(173, 46, 156, 0.1)'; // Light red
          textColor = '#6c757d'; // Gray text
          break;
        case 'recipient':
          backgroundColor = 'rgba(20, 235, 217, 0.1)'; // Light yellow
          textColor = '#20c997'; // Yellow text
          break;  
        default:
          backgroundColor = 'rgba(0, 0, 0, 0.1)'; // Light black
          textColor = '#000'; // Default black text
      }
      return(
          <Box
          sx={{
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: 600,
            fontSize: '14px',
            textAlign: 'center',
            backgroundColor: backgroundColor,
            color: textColor,
          }}
        >
          {role}
        </Box>
      );
    };

  const adminSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/admin" },
    { icon: "Manage Users", label: "Users", href: "/dashboard/admin/manage-users" },
    { icon: "Reports", label: "Reports", href: "/dashboard/admin/reports" },
    { icon: "Donations", label: "Donations", href: "/dashboard/admin/donations" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
  useEffect(() => {
    // Fetch donations from the backend
    const fetchUsers = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/`,{
             headers: { Authorization: `Bearer ${token}` } 
          });
          console.log("Fetched Users:", response.data); // Debugging
          if (Array.isArray(response.data)) {
            setUsers(response.data);
        } else {
            console.error("API response is not an array:", response.data);
        }
        } catch (error) {
          console.log("Fetched Notifications:", data);
          console.error("Error fetching notifications:", error);
         
        }
      };
      fetchUsers();

  }, []);

  const sidebarItemsMap = { admin: adminSidebarItems };
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
            Manage Users
          </Typography>

        <Table striped bordered hover className="shadow-sm rounded">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="align-middle">
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{user.name}</td>
                  <td className="text-muted">{user.email}</td>
                  <td>
                    <StatusBadge role={user.role} />
                  </td>
                  <td className="text-">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-danger fw-bold">No Users Found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Box>
    </Box>
    
  );
};

export default ManageUsers;
