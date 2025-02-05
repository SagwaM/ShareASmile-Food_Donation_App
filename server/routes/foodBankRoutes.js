const express = require("express");
const FoodBank = require("../models/foodbanks");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const foodBank = await FoodBank.create(req.body);
    res.status(201).json(foodBank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const foodBanks = await FoodBank.find();
    res.status(200).json(foodBanks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
