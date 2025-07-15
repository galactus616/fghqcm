const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "30d"; // Long-lived session

// Helper to generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to hash OTP (for security)
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// Step 1: Send OTP
const sendOtp = async (req, res, next) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }
  try {
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);
    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // TODO: Integrate Twilio here. For now, mock send.
    console.log(`OTP for ${phone}: ${otp}`);

    const response = { message: "OTP sent successfully" };
    if (process.env.NODE_ENV !== 'production') {
      response.devOtp = otp;
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
};

// Step 2: Verify OTP and login
const verifyOtp = async (req, res, next) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }
  try {
    const user = await User.findOne({ phone });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    const hashedOtp = hashOtp(otp);
    if (hashedOtp !== user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.otp = null;
    user.otpExpires = null;
    user.isPhoneVerified = true;
    await user.save();

    const token = jwt.sign(
      { id: user._id, phone: user.phone, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Profile, updateProfile, logout remain unchanged (except no password logic)

const getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const userId = req.user._id;
  const { name, email, address } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address !== undefined ? address : user.address;
    await user.save();
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('token', { sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  sendOtp,
  verifyOtp,
  getProfile,
  updateProfile,
  logout,
};
