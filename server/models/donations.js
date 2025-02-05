const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  foodbank_id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodBank", default: null },
  food_type: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickup_address: { type: String, required: true },
  expiry_date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "in transit", "delivered", "cancelled"], 
    default: "pending" 
  },
  image_url: { type: String, default: "" }, // URL of the food image
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donation", donationSchema);
