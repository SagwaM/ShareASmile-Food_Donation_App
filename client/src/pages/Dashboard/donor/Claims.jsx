import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Paper,
  Stack,
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
  "Manage Donation Claims": AssignmentTurnedInIcon,
  "My Donations": FavoriteIcon,
};

const drawerWidth = 240;

const Claims = ({ title }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userType = user?.role || "Null";
  const [loading, setLoading] = useState(false);

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("Pending");
  const [claims, setClaims] = useState({ Pending: [], Approved: [], Rejected: [] });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const state = location.state || {};
  const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
      fetchClaims();
    }, [forceUpdate]);
    
    const fetchClaims = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/food/claims",{
              headers: { Authorization: `Bearer ${token}` } 
        });
        console.log("Claims Response:", response.data);
        // Ensure response.data.claims exists and is an array
        const claimsData = Array.isArray(response.data) ? response.data : [];
        const organizedClaims = { Pending: [], Approved: [], Rejected: [] };
  
        claimsData.forEach((claim) => {
          const statusKey = claim.approval_status.charAt(0).toUpperCase() + claim.approval_status.slice(1).toLowerCase();
          if (organizedClaims[statusKey]) {
            organizedClaims[statusKey].push(claim);
          } else {
            console.warn("Unexpected approval_status:", claim.approval_status);
          }
        });
        
        setClaims(response.data);
        setForceUpdate(prev => !prev); // Force re-render
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };
  
    const handleApprove = async (id, claimId) => {
      if (!id || !claimId) {
        console.log("Approving Claim - Donation ID:", id, "Claim ID:", claimId);
        console.error("Error: Donation ID is undefined!");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:5000/api/food/${id}/approve`, { action: "approve", claimId}, {
              headers: { Authorization: `Bearer ${token}` } 
        });
        setClaims(prev => ({
          ...prev,
          Pending: prev.Pending.filter(claim => claim._id !== claimId),
          Approved: [...prev.Approved, { ...prev.Pending.find(claim => claim._id === claimId), approval_status: "Approved" }]
        }));
      } catch (error) {
        console.error("Error approving claim:", error.response?.data?.error || error.message);
      }
    };
    
    const handleReject = async (id, claimId, rejection_reason) => {
      if (!id ||!claimId) {
        console.error("Error: Donation ID is undefined!");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:5000/api/food/${id}/approve`, { action: "reject", claimId, rejection_reason }, {
              headers: { Authorization: `Bearer ${token}` } 
        });
        setClaims(prev => ({
          ...prev,
          Pending: prev.Pending.filter(claim => claim._id !== claimId),
          Rejected: [...prev.Rejected, { ...prev.Pending.find(claim => claim._id === claimId), approval_status: "Rejected", rejected_reason: rejection_reason }]
        }));
      } catch (error) {
        console.error("Error rejecting claim:", error.response?.data?.error || error.message);
      }
    };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

const donorSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/donor" },
    { icon: "My Donations", label: "My Donations", href: "/dashboard/donor/my-donations" },
    { icon: "Manage Donation Claims", label: "Manage Donation Claim", href: "/dashboard/donor/claims" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
 

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
            Manage Donation Claims
          </Typography>
          <Box sx={{ p: 3 }}>
           {/* Tabs */}
         <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          {['Pending', 'Approved', 'Rejected'].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                mx: 1,
                fontWeight: "bold",
                borderBottom: activeTab === tab ? "3px solid green" : "none",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Claims
            </Button>
          ))}
        </Box>

        {/* Claims Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Claims
          </Typography>
          
            <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Food Item</TableCell>
                  <TableCell>Approval Status</TableCell>
                  <TableCell>Claimed By</TableCell>
                  <TableCell>Claimed Date</TableCell>
                  {activeTab === "Pending" && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
              {claims[activeTab]?.length > 0 ? (
                claims[activeTab].map((claim) =>
                  claim.claimed_by?.length > 0 ? (
                    claim.claimed_by.map((claimer, index) => (
                  <TableRow key={`${claim._id}-${claimer.claimId}-${index}`}>
                    <TableCell>{claim._id}</TableCell>
                    <TableCell>{claim.food_name}</TableCell>
                    <TableCell>{claim.approval_status}</TableCell>
                    <TableCell>{claimer.name || "N/A"}</TableCell>
                    <TableCell>{claim.claimed_date ? new Date(claim.claimed_date).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell>
                      {activeTab === "Pending" && (
                        <Stack direction="row" spacing={2} justifyContent="center">
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleApprove(claim._id, claimer.claimId)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleReject(claim._id, claimer.claimId, "No valid reason")}
                          >
                            Reject
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                 ))
                ) : (
                  <TableRow key={claim._id}>
                  <TableCell colSpan={activeTab === "Pending" ? 6 : 5} align="center">
                    No claimants found
                  </TableCell>
                </TableRow>
                )
              )
              ) : (
                  <TableRow>
                    <TableCell colSpan={activeTab === "Pending" ? 6 : 5} align="center">
                      No claims found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
        </Box>
        </Box>
        
      </Box>
    </Box>
    
  );
};

export default Claims;
