const express = require("express");
const User = require("../models/users");
const router = express.Router();

// Create a new user
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password, phone, address, role } = req.body;
    const user = await User.create({ full_name, email, password, phone, address, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
