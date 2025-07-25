const rateLimit = require('express-rate-limit');

// Strict limiter for login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many attempts, please try again later.' }
});

// Moderate limiter for sensitive actions (e.g., order, payment)
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: { message: 'Too many requests, please try again later.' }
});

// General limiter for all APIs (high limit)
const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: { message: 'Too many requests, please slow down.' }
});

module.exports = {
  authLimiter,
  sensitiveLimiter,
  generalLimiter
}; 