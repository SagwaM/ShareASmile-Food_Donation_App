import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { Modal, Form, Table } from "react-bootstrap";
import {
  Box,Typography,Divider,List,ListItem,ListItemIcon,ListItemText,Drawer,Toolbar,AppBar,Avatar,MenuItem,Menu,Dialog,DialogTitle,
  DialogContent,DialogActions,TextField,IconButton,CssBaseline,useTheme,Button, Stack} from "@mui/material";
import {BarChart as BarChartIcon,Home as HomeIcon,Inventory as InventoryIcon,Settings as SettingsIcon,People as PeopleIcon,Favorite as FavoriteIcon,Logout as LogoutIcon,Menu as MenuIcon,Notifications as NotificationsIcon,Person as PersonIcon,ChevronRight as ChevronRightIcon,
  Add as AddIcon,Delete as DeleteIcon,AssignmentTurnedIn as AssignmentTurnedInIcon, DeleteOutline, EditOutlined} from "@mui/icons-material";
import { PlusCircle } from 'lucide-react'
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { set } from 'date-fns';

const iconMap = {
  Home: HomeIcon,
  Users: PeopleIcon,
  Donations: InventoryIcon,
  Reports: BarChartIcon,
  Settings: SettingsIcon,
  "My Donations": FavoriteIcon,
  "Create Donation": AddIcon,
  "Manage Donation Claims": AssignmentTurnedInIcon,
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
    const [openModal, setOpenModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newDonation, setNewDonation] = useState({ food_name: "", quantity: "" });
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
  
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState({
        food_name: "",
        category: "",
        custom_category: "",
        quantity: "",
        description: "",
        expiry_date: "",
        pickup_location: "",
        status: "Available",
        image: null,
      });

    const fetchDonations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/food/my-donations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDonations(response.data);
      } catch (error) {
        iziToast.error({
          title: "Error",
          message: "Failed to fetch donations",
          position: "topRight",
          timeout: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchDonations();
    }, []);
    
    // Fetch Donation Details for Editing
const handleUpdate = async (id, updatedDonationData) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/food/${id}`, updatedDonationData, {
      headers: { Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data" ,
    }
    });

    setSelectedDonation(response.data.donation); // Update the selected donation with the response data
    iziToast.success({
      title: "Success",
      message: "Donation updated successfully!",
      position: "topRight",
      timeout: 3000,
    });
    
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Failed to fetch donation details",
      position: "topRight",
      timeout: 3000,
    });
  }
};
  const handleOpenEdit = (donation) => {
    setSelectedDonation(donation);
    setEditModalOpen(true);
  };
  const handleCloseEdit = () => {
    setEditModalOpen(false);
  };
  // Handle Form Change
  const handleEditChange = (e) => {
  const { name, value } = e.target;
  setSelectedDonation((prev) => ({
    ...prev,
    [name]: value || "",
  }));
  };
  const handleEditSubmit = (e) => {
  e.preventDefault(); // Prevents page reload

  if (!selectedDonation || !selectedDonation._id) {
    iziToast.error({ title: "Error", message: "Invalid donation", position: "topRight" });
    return;
  }

  handleUpdate(selectedDonation._id, selectedDonation);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/food/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(donations.filter(donation => donation._id !== id));
      iziToast.success({
        title: "Success",
        message: "Food donation deleted successfully",
        position: "topRight",
        timeout: 3000
      });
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "Failed to delete donation",
        position: "topRight",
        timeout: 3000
      });
    }
  };
  
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

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleFileChange = (e) => {
      setFormData({ ...formData, image: e.target.files[0] });
    };
    // ✅ Close modal function (previously missing)
    const handleClose = () => {
      setOpenModal(false);
    };
  
    // ✅ Open modal function
    const handleOpen = () => {
      setOpenModal(true);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formDataToSend = new FormData();
  
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
      }
      });
      console.log("FormData:", [...formDataToSend.entries()]); // Debugging
  
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/food/`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Donation created:", response.data);
        fetchDonations(); // Refresh the donation list
        handleClose();
        iziToast.success({
          title: "Success",
          message: "Food donation created successfully!",
          position: "topRight",
          timeout: 3000
        });
      
      } catch (error) {
        console.error("Error creating donation:", error.response?.data || error);
        
        iziToast.error({
          title: "Error",
          message: "Failed to create donation",
          position: "topRight",
          timeout: 3000
        });
      }
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
                          <Button variant="contained" color="success" onClick={handleOpen} className="mb-3">
                            <AddIcon /> Create Donation
                          </Button>
            
                    <Table striped bordered hover className="text-center">
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
                              <td>
                                <Stack direction="row" spacing={2} justifyContent="center">
                                  <Button variant="contained" onClick={() => handleOpenEdit(donation)}>
                                    <EditOutlined /> Edit
                                  </Button>
                                  <Button variant="contained" color="error" onClick={() => handleDelete(donation._id)}>
                                    <DeleteOutline /> Delete
                                  </Button>
                                </Stack>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">No donations available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Box>
            
                  <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
                  <DialogTitle>Create Food Donation</DialogTitle>
                  <DialogContent>
                    <TextField
                      label="Food Name"
                      name="food_name"
                      value={formData.food_name}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                    >
                      <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                      <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                      <MenuItem value="Dairy">Dairy</MenuItem>
                      <MenuItem value="Grains">Grains</MenuItem>
                      <MenuItem value="Canned Goods">Canned Goods</MenuItem>
                      <MenuItem value="Fresh Produce">Fresh Produce</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </TextField>
                    {formData.category === "Others" && (
                      <TextField
                        label="Custom Category"
                        name="custom_category"
                        value={formData.custom_category}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                      />
                    )}
                    <TextField
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                      multiline
                      rows={3}
                    />
                    <TextField
                      label="Expiry Date"
                      name="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Pickup Location"
                      name="pickup_location"
                      value={formData.pickup_location}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ marginTop: "10px" }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog open={editModalOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
                  <DialogTitle>Edit Donation</DialogTitle>
                  <DialogContent>
                    {selectedDonation && (
                      <Form onSubmit={handleEditSubmit}>
                        <TextField
                          label="Food Name"
                          name="food_name"
                          fullWidth
                          margin="dense"
                          value={selectedDonation.food_name}
                          onChange={handleEditChange}
                        />
                        <TextField
                          label="Category"
                          name="category"
                          fullWidth
                          margin="dense"
                          value={selectedDonation.category}
                          onChange={handleEditChange}
                        />
                        <TextField
                          label="Quantity"
                          name="quantity"
                          fullWidth
                          margin="dense"
                          value={selectedDonation.quantity}
                          onChange={handleEditChange}
                        />
                        <TextField
                          label="Description"
                          name="description"
                          fullWidth
                          margin="dense"
                          value={selectedDonation.description}
                          onChange={handleEditChange}
                        />
                        <TextField
                          label="Expiry Date"
                          name="expiry_date"
                          type="date"
                          fullWidth
                          margin="dense"
                          value={selectedDonation.expiry_date}
                          onChange={handleEditChange}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="Pickup Location"
                          name="pickup_location"
                          fullWidth
                          margin="dense"
                          value={selectedDonation.pickup_location}
                          onChange={handleEditChange}
                        />
                        <TextField
                          label="Status"
                          name="status"
                          fullWidth
                          margin="dense"
                          value={selectedDonation.status}
                          onChange={handleEditChange}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ marginTop: "10px" }}
                        />
                      </Form>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
                    <Button onClick={(e) => handleEditSubmit(e)} color="primary">Update</Button>
                  </DialogActions>
                </Dialog>

                </Box>
                
              );
            };

export default MyDonations;
