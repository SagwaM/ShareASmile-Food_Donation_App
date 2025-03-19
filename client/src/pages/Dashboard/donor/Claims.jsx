import React, { useState, useEffect } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Button, Card, CardContent, AppBar, Toolbar, IconButton, Menu, MenuItem, Tabs, Tab } from "@mui/material";
import { Home, Favorite, Add, Settings, ListAlt, Notifications, AccountCircle } from "@mui/icons-material";
import {Link, useLocation} from 'react-router-dom';
import axios from 'axios';

const sidebarItems = [
  { text: "Overview", icon: <Home />, route: "/dashboard/donor" },
  { text: "My Donations", icon: <Favorite />, route: "/dashboard/donor/my-donations" },
  { text: "Manage Donation Claim", icon: <ListAlt />, route: "/dashboard/donor/claims" },
  { text: "Settings", icon: <Settings />, route: "/settings" }
];
const DonorClaimsPage = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [claims, setClaims] = useState({ Pending: [], Approved: [], Rejected: [] });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const state = location.state || {};

  useEffect(() => {
    console.log("Updated claims state:", claims);
    fetchClaims();
  }, []);
  
  const fetchClaims = async () => {
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/food/claims",{
            headers: { Authorization: `Bearer ${token}` } 
      });
      console.log("Claims Response:", response.data);
      // Ensure response.data.claims exists and is an array
      const claimsData = response.data.claims || [];
      const organizedClaims = { Pending: [], Approved: [], Rejected: [] };

      claimsData.forEach((claim) => {
        const status = claim.approval_status?.trim.toLowerCase()(); // Normalize status
        if (status && organizedClaims[status.charAt(0).toUpperCase() + status.slice(1)]) {
          organizedClaims[status.charAt(0).toUpperCase() + status.slice(1)].push(claim);
        } else {
          console.warn("Unexpected approval_status:", claim.approval_status);
        }
      });
      
      setClaims(organizedClaims);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  const handleApprove = async (id, claimId) => {
    if (!id || !claimId) {
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

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={{ width: 250, flexShrink: 0, "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box" } }}>
        <Typography variant="h6" sx={{ textAlign: "center", mt: 2, fontWeight: "bold", color: "green" }}>
        ShareASmile
        </Typography>
        <List>
          {sidebarItems.map((item, index) => (
            <ListItemButton key={index} component={Link} to={item.route} selected={location.pathname === item.route}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Navbar */}
        <AppBar position="permanent" sx={{ backgroundColor: "#1976d2", color: "black", boxShadow: 1 }}>
          <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              Manage Donation Claims
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/settings">Settings</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/login">Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

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

          {claims[activeTab] && claims[activeTab].length > 0 ? (
            claims[activeTab]?.map((claim) => (
              <Card key={claim._id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6">{claim.food_name}</Typography>
                  <Typography variant="body2">Claimed By:</Typography>
                  {claim.claimed_by.map(user => (
                      <Box key={user._id} sx={{ border: "1px solid #ddd", p: 2, mt: 2 }}>
                        <Typography>Recipient: {user.name}</Typography>
                        <Typography>Date Claimed: {new Date(claim.claimed_date).toLocaleDateString()}</Typography>
                        <Typography>Status: {claim.approval_status}</Typography>

                        {activeTab === "Pending" && (
                          <Box sx={{ mt: 2 }}>
                            <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleApprove(claim._id, claim.claimed_by[0]._id)}>
                              Approve
                            </Button>
                            <Button variant="contained" color="error" onClick={() => handleReject(claim._id, claim.claimed_by[0]._id, 'Not eligible for this donation')}>
                              Reject
                            </Button>
                          </Box>
                        )}
                        {activeTab === "Rejected" && claim.rejected_reason && (
                              <Typography sx={{ color: "red", mt: 1 }}><strong>Reason:</strong> {claim.rejected_reason}</Typography>
                            )}
                      </Box>
                    ))}
                  </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No {activeTab} claims available.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DonorClaimsPage;
