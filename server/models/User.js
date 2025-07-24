const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  addresses: [
    {
      label: { type: String, default: "Home" },
      flat: { type: String },
      floor: { type: String },
      area: { type: String },
      landmark: { type: String },
      isDefault: { type: Boolean, default: false },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    }
  ],
  // OTP fields for authentication
  otp: {
    type: String,
    default: null,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
