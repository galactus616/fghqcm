const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  // Check for token in cookie first, then Authorization header
  let token = req.cookies && req.cookies.token;
  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Authentication token required");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    const error = new Error("Invalid or expired token");
    error.statusCode = 403;
    next(error);
  }
};

module.exports = authenticateToken;
