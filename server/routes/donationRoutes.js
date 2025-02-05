const express = require("express");
const Donation = require("../models/donations");
const router = express.Router();

// Create a new donation
router.post("/donate", async (req, res) => {
  try {
    const { donor_id, food_type, quantity, pickup_address, expiry_date } = req.body;
    const donation = await Donation.create({ donor_id, food_type, quantity, pickup_address, expiry_date });
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find().populate("donor_id", "full_name email");
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
