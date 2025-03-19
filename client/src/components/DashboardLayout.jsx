import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Avatar, 
  Badge, 
  Divider, 
  useTheme, 
  Card, 
  Paper, 
  Container,
  useMediaQuery,
  Menu,
  MenuItem
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
  Add as AddIcon
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext"; // Import Auth Context

const iconMap = {
  Home: HomeIcon,
  Users: PeopleIcon,
  Donations: InventoryIcon,
  Reports: BarChartIcon,
  Settings: SettingsIcon,
  "My Donations": FavoriteIcon,
  "Create Donation": AddIcon,
  "Available Food": InventoryIcon,
  "My Requests": FavoriteIcon,
  Recipients: PeopleIcon,
  Impact: BarChartIcon,
};

const drawerWidth = 240;

export default function DashboardLayout({ children, title, userType }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const { user } = useAuth();

  const isActive = (href) => location.pathname === href;

  const adminSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/admin" },
    { icon: "Users", label: "Users", href: "/dashboard/admin/manage-users" },
    { icon: "Reports", label: "Reports", href: "/dashboard/admin/reports" },
    { icon: "Donations", label: "Donations", href: "/dashboard/admin/donations" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];
  const sidebarItemsMap = {
    admin: adminSidebarItems
  };

  const sidebarItems = sidebarItemsMap[userType];
  const userRoleLabel = userType
    ? userType.charAt(0).toUpperCase() + userType.slice(1)
    : "User";
    console.log("userType:", userType);
    console.log("userRoleLabel:", userRoleLabel);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const drawer = (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100%',
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <FavoriteIcon 
            sx={{ 
              fontSize: '2rem', 
              color: 'success.main',
              mb: 1 
            }} 
          />
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
                      ? 'success.main' 
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
    </>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton 
            color="inherit"
            onClick={handleNotificationsClick}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleNotificationsClose}>
              <Typography variant="body2">New donation available</Typography>
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose}>
              <Typography variant="body2">Your donation was claimed</Typography>
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose}>
              <Typography variant="body2">New message received</Typography>
            </MenuItem>
          </Menu>
          
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
              <MenuItem onClick={handleProfileClose} component={Link} to="/profile">Profile</MenuItem>
              <MenuItem onClick={handleProfileClose} component={Link} to="/settings">Account Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileClose} component={Link} to="/Login">
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
      
      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxHeight: '100vh',
          overflow: 'auto',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
