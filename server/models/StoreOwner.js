const mongoose = require('mongoose');

const StoreOwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Now optional
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  kycId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoreKYC',
  },
  kycCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StoreOwner', StoreOwnerSchema); 