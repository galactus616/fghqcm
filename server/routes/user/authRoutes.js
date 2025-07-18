const express = require("express");
const {
  sendOtp,
  verifyOtp,
  getProfile,
  updateProfile,
  logout,
} = require("../../controllers/user/authController");
const authenticateToken = require("../../middleware/authMiddleware");
const { authLimiter } = require('../../middleware/rateLimiters');
const router = express.Router();

// OTP-based authentication
router.post("/send-otp", authLimiter, sendOtp);
router.post("/verify-otp", authLimiter, verifyOtp);

router.post("/logout", logout);
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);

module.exports = router;
