const express = require('express');
const { authenticateUser } = require('../middlewares/authMiddleware');
const Notification = require('../models/Notification');
const mongoose = require("mongoose");

const router = express.Router();

// ✅ Get all notifications for the logged-in user
router.get('/', authenticateUser, async (req, res) => {
  try {
    console.log("User ID requesting notifications:", req.user.userId); // Debugging

    if (!req.user.userId) {
      return res.status(400).json({ error: "User ID is missing in request" });
    }

    const notifications = await Notification.find({ user: req.user.userId }).sort({ created_at: -1 });
    console.log("Fetched notifications:", notifications); // Debugging log

    res.status(200).json({
      notifications: notifications.length > 0 ? notifications : [],
      message: notifications.length > 0 ? "Notifications fetched successfully" : "No messages or notifications yet",
    });
    
  } catch (err) {
    console.error("Error fetching notifications:", err); // Log error
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Mark notifications as read
router.put('/read/:id', authenticateUser, async (req, res) => {
  try {
    console.log("Notification ID:", req.params.id);
    console.log("User ID:", req.user.userId);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const notification = await Notification.findByIdAndUpdate(
      req.params.id, 
      {read: true}, 
      {new: true}
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    if (!notification.user || notification.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized or notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error("Error marking notification as read:", err); // Log error
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
