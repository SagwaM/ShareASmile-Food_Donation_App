const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['donor', 'ngo', 'recipient', 'admin'], default: 'recipient',
    required: true
  },
  phone: { type: String, required: true },
  profile_picture: { type: String, default: '' }, // URL to profile image
  donor_type: { type: String, enum: ['individual', 'supermarket', 'restaurant'], default: 'individual' },
  organization_name: { type: String, required: function() { return this.role === 'ngo'; } }, // Only required for NGOs
  location: { type: String, required: true }, // Only required for NGOs
    
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
