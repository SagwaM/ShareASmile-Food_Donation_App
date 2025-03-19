const mongoose = require('mongoose');

const FoodDonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to donor
  food_name: { type: String, required: true },
  category: {
    type: String,
    required: true, 
    enum: ['Vegetarian', 'Non-Vegetarian', 'Dairy', 'Grains', 'Canned Goods','Fresh Produce','Others'] 
  }, // Food category
  custom_category: { type: String, default: null }, // Stores user-defined category if 'others' is selected
  quantity: { type: Number, required: true }, // In kg or number of items
  description: { type: String },
  expiry_date: { type: Date, required: true },
  pickup_location: {type: String,required: true },
  status: { type: String, enum: ['Available', 'Claimed', 'Expired'], default: 'Available' },
  approval_status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: null }, 
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  claimed_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }],
  claimed_date: { type: Date, default: null }, // ✅ Add this field
  rejection_reason: { type: String, default: null }, // ✅ Add this field
  image: { type: String, default: '' }, // Food image URL
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodDonation', FoodDonationSchema);
