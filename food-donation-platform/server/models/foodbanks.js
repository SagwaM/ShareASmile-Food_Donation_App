const mongoose = require("mongoose");

const foodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact_email: { type: String, required: true },
  contact_phone: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FoodBank", foodBankSchema);
