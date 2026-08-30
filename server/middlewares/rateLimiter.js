const rateLimit = require('express-rate-limit');

/**
 * Standard API Rate Limiter
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

/**
 * Strict Rate Limiter for Authentication & Financial actions
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many sensitive requests from this IP. Please try again later.'
  }
});

module.exports = {
  apiRateLimiter,
  authRateLimiter
};
