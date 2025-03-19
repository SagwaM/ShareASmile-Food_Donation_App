const cron = require('node-cron');
const FoodDonation = require('../models/FoodDonation');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Function to clean up expired donations
const cleanupExpiredDonations = async () => {
  try {
    console.log("🔄 Running cleanup job...");

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);  // ✅ Ensure time is set to midnight UTC

    console.log("📅 Current date (UTC):", today);

    const expiredDonations = await FoodDonation.find({ 
      expiry_date: { $lt: today }, 
      status: "available" 
    });

    console.log("🧐 Expired Donations Found:", expiredDonations);

    if (expiredDonations.length === 0) {
      console.log("ℹ️ No donations to update.");
      return;
    }
    const result = await FoodDonation.updateMany(
      { expiry_date: { $lt: today }, status: 'available' },
      { $set: { status: 'expired' } }
    );

    console.log(`✅ Expired donations marked: ${result.modifiedCount}`);
  } catch (err) {
    console.error("❌ Error cleaning expired donations:", err);
  }
};


module.exports = cleanupExpiredDonations;
