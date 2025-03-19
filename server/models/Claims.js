const mongoose = require('mongoose');

const FoodClaimSchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodDonation', required: true },
  claimed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimed_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Claimed','Cancelled', 'Rejected'], default: null },
  approval_status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: null }, 
  rejection_reason: { type: String }
});

module.exports = mongoose.model('FoodClaim', FoodClaimSchema);
