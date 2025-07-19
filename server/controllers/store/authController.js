const StoreOwner = require('../../models/StoreOwner');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// Register a new store owner (email only)
exports.register = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const exists = await StoreOwner.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const storeOwner = new StoreOwner({ email });
  await storeOwner.save();
  res.json({ message: 'Store owner registered' });
};

// Request OTP for login
exports.requestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const storeOwner = await StoreOwner.findOne({ email });
  if (!storeOwner) return res.status(404).json({ message: 'No account found with this email' });
  // Generate 6-digit OTP
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  storeOwner.otp = otp;
  storeOwner.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await storeOwner.save();
  // TODO: Send OTP via email (use nodemailer here)
  // await sendOtpEmail(email, otp);
  console.log(`OTP for ${email}: ${otp}`); // For dev/testing
  res.json({ message: 'OTP sent to email' });
};

// Verify OTP and login
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });
  const storeOwner = await StoreOwner.findOne({ email });
  if (!storeOwner || !storeOwner.otp || !storeOwner.otpExpires) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  if (storeOwner.otp !== otp || Date.now() > storeOwner.otpExpires) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  // OTP is valid, clear it
  storeOwner.otp = undefined;
  storeOwner.otpExpires = undefined;
  await storeOwner.save();
  const token = jwt.sign(
    { id: storeOwner._id, type: 'storeOwner' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.cookie('store_owner_token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({
    message: 'Login successful',
    storeOwner: {
      email: storeOwner.email,
      id: storeOwner._id,
    },
  });
};

// Logout a store owner
exports.logout = async (req, res) => {
  res.clearCookie('store_owner_token');
  res.json({ message: 'Logout successful' });
};

// Get the current store owner's profile
exports.profile = async (req, res) => {
  const storeOwner = await StoreOwner.findById(req.storeOwner.id).select('-otp -otpExpires');
  res.json({ storeOwner });
}; 