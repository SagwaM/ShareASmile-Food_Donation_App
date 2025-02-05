const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  donation_id: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
  delivery_person_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["pending", "in transit", "delivered"], 
    default: "pending" 
  },
  delivery_date: { type: Date, default: null },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Delivery", deliverySchema);
