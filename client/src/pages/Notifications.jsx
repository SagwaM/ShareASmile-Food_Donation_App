import React, { useState, useEffect } from "react";
import axios from "axios";
import { Drawer, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Badge, List, ListItem, ListItemText, IconButton, Box, Popover } from "@mui/material";
import { Notifications as NotificationsIcon, Close as CloseIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { ThemeProviderWrapper } from "@/context/ThemeContext";
import { useTheme } from "@mui/material/styles";

const Notifications = ({}) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const token = localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/notification/",{
           headers: { Authorization: `Bearer ${token}` } 
        });
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      } catch (error) {
        console.log("Fetched Notifications:", data);
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();
   
   
  }, []);

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    setAnchorEl(null); // Close popover
    setOpenDrawer(true); // Open notification detail modal

    if (!notification.read) {
      try {
        await axios.put(`http://localhost:5000/api/notification/read/${notification._id}`,{},{
            headers: { Authorization: `Bearer ${token}` } 
        });
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };
  
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <ThemeProviderWrapper>
    <>
     {/* Notification Bell */}
     <IconButton color="inherit" onClick={handleBellClick}>
        <Badge badgeContent={notifications?.filter(n => !n.read).length || 0} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Popover for Notification List */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Notifications
          </Typography>
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <motion.div key={notification._id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <ListItem
                    button
                    onClick={() => handleNotificationClick(notification)}
                    sx={{ background: notification.read ? "#f5f5f5" : "#e3f2fd", borderRadius: 1, mb: 1 }}
                  >
                    <ListItemText primary={notification.message} secondary={notification.created_at ? new Date(notification.created_at).toLocaleString() : "No timestamp"} />
                  </ListItem>
                </motion.div>
              ))
            ) : (
              <Typography>No new notifications</Typography>
            )}
          </List>
        </Box>
      </Popover>

      {/* Drawer for Extended Notification */}
      <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
        <Box sx={{ width: 300, p: 2, background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Notification Details</Typography>
            <IconButton onClick={handleCloseDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedNotification ? (
            <Box>
              <Typography variant="body1"><strong>Message:</strong> {selectedNotification.message}</Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                {selectedNotification.created_at || "No timestamp"}
              </Typography>
            </Box>
          ) : (
            <Typography>No notification selected</Typography>
          )}
        </Box>
      </Drawer>
    </>
    </ThemeProviderWrapper>
  );
};

export default Notifications;
