const express = require('express');
const { authenticateUser, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploads');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get logged-in user profile
// @access  Private (Requires Token)
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile (Name, Password, Profile Picture)
// @access  Private
router.put('/profile', authenticateUser, upload.single('profile_picture'), async (req, res) => {
    try {
      console.log("Uploaded file:", req.file); // Debugging line
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update name if provided
      if (req.body.name) {
        user.name = req.body.name;
      }

      // Update email if provided
      if (req.body.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser && existingUser._id.toString() !== req.user.userId) {
          return res.status(400).json({ error: 'Email already in use' });
        }
        user.email = req.body.email;
      }
  
      // Update password if provided
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      // Update phone if provided
      if (req.body.phone) {
        user.phone = req.body.phone;
      }
  
      // Update profile picture if uploaded
      if (req.file) {
        user.profile_picture = `/uploads/${req.file.filename}`;
      }
  
      await user.save();
      res.json({ message: 'Profile updated successfully', user });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', authenticateUser, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/recent
// @desc    Get recently registered users
// @access  Private (Admin)
router.get('/recent', authenticateUser, admin, async (req, res) => {
  try {
    const fromDate = new Date('2025-02-25'); // Set the starting date
    const users = await User.find({ createdAt: {$gte: fromDate} })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('-password');
    
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin)
router.get('/:id', authenticateUser,  async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateUser, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put('/:id/role', authenticateUser, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!req.body.role) {
      return res.status(400).json({ error: 'Role is required' });
    }
    user.role = req.body.role;
    await user.save();
    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
