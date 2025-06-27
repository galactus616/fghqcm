const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
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
