const mongoose = require('mongoose');

const StoreKYCSchema = new mongoose.Schema({
  // --- References ---
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoreOwner',
    required: true,
    unique: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
  },

  // --- Owner Details ---
  ownerName:      { type: String, required: true },
  ownerPhone:     { type: String, required: true },
  ownerNID:       { type: String, required: true },
  ownerNIDImage:  { type: String, required: true },

  // --- Store Details ---
  storeName:      { type: String, required: true },
  storeType:      { type: String, enum: ['grocery', 'pharmacy', 'other'], required: true },
  storeAddress:   { type: String, required: true },
  storeGeo: {
    lat: { type: Number },
    lng: { type: Number },
  },
  storePhone:     { type: String, required: true },
  storePhoto:     { type: String },

  // --- Business Documents ---
  tradeLicenseNumber: { type: String, required: true },
  tradeLicenseImage:  { type: String, required: true },

  // --- Bank & Payout ---
  bankAccountName:   { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  bankName:          { type: String, required: true },
  bankBranch:        { type: String },
  digitalWallet:     { type: String }, // bKash/Nagad

  // --- Delivery & Operations ---
  operatingHours: { type: String },
  deliveryArea:   { type: [String] },

  // --- Contact Person (if different) ---
  contactPerson: {
    name:  String,
    phone: String,
    email: String,
  },

  // --- Status & Admin ---
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt:  { type: Date },
  remarks:     { type: String },

});

module.exports = mongoose.model('StoreKYC', StoreKYCSchema);
