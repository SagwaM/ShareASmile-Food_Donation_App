const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const upload = require('../middlewares/uploads'); // Import Multer

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', upload.single('profile_picture'), [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').not().isEmpty().withMessage('Phone number is required'),
  body('role').isIn(['donor', 'ngo', 'recipient', 'admin']).withMessage('Invalid role'),
  body('donor_type').optional().isIn(['individual', 'supermarket', 'restaurant']).withMessage('Invalid donor type'),

  //body('location').custom((value) => {
    //if (!value || typeof value.lat !== 'number' || typeof value.lng !== 'number') {
      //throw new Error('Invalid location format');
    //}
    //return true;
  //})
  body('organization_name').custom((value, { req }) => {
    if (req.body.role === 'ngo' && (!value || value.trim() === '')) {
      throw new Error('Organization name is required for NGOs');
    }
    return true;
  })
], async (req, res) => {
  console.log("Received Body:", req.body);  // Debugging
  console.log("Received File:", req.file);  // Debugging

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role, phone, organization_name, donor_type} = req.body;
  const profilePicturePath = req.file ? `/uploads/${req.file.filename}` : ''; // Save uploaded file path


  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      profile_picture: profilePicturePath, 
      organization_name: role === 'ngo' ? organization_name : undefined, // Only save if role is NGO
      donor_type: role === "donor" ? donor_type || "individual" : undefined // Only save if role is Donor
    });

    await user.save();

    // Generate JWT Token
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User registered successfully', token,  profile_picture: profilePicturePath });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
// @access  Public
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').not().isEmpty().withMessage('Password is required')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      // Find user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Compare entered password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT Token
      const payload = { userId: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  
      res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email, role: user.role, profile_picture: user.profile_picture } });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post("/forgot-password", async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
