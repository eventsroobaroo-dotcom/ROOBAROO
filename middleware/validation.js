// =============================================
// VALIDATION MIDDLEWARE FILE
// =============================================
// This file contains validation logic for form submissions
// It checks that all required fields are present and properly formatted

// =============================================
// FORM VALIDATION FUNCTIONS
// =============================================

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (10 digits)
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
  return phoneRegex.test(cleanPhone);
}

// Validate name (at least 2 characters, only letters and spaces)
function isValidName(name) {
  if (!name || name.trim().length < 2) return false;
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name.trim());
}

// Validate status (must be either 'single' or 'couple')
function isValidStatus(status) {
  return status === 'single' || status === 'couple';
}

// =============================================
// MAIN VALIDATION MIDDLEWARE
// =============================================
function validateRegistration(req, res, next) {
  const { name, email, phone, status } = req.body;
  const errors = [];

  // Check if all required fields are present
  if (!name) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  if (!phone) errors.push('Phone number is required');
  if (!status) errors.push('Status is required');

  // If basic fields are missing, return early
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      details: errors
    });
  }

  // Validate name
  if (!isValidName(name)) {
    errors.push('Name must be at least 2 characters long and contain only letters and spaces');
  }

  // Validate email
  if (!isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Validate phone
  if (!isValidPhone(phone)) {
    errors.push('Phone number must be exactly 10 digits');
  }

  // Validate status
  if (!isValidStatus(status)) {
    errors.push('Status must be either "single" or "couple"');
  }

  // If validation errors exist, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  // Clean and sanitize the data
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.replace(/\D/g, ''); // Remove all non-digits
  req.body.status = status.toLowerCase();

  // If everything is valid, continue to the next middleware
  next();
}

// =============================================
// SANITIZATION FUNCTIONS
// =============================================

// Remove potentially dangerous characters
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .substring(0, 200); // Limit length to prevent abuse
}

// Sanitize all form inputs
function sanitizeRegistrationData(req, res, next) {
  if (req.body.name) req.body.name = sanitizeInput(req.body.name);
  if (req.body.email) req.body.email = sanitizeInput(req.body.email);
  if (req.body.phone) req.body.phone = sanitizeInput(req.body.phone);
  if (req.body.status) req.body.status = sanitizeInput(req.body.status);
  
  next();
}

// =============================================
// RATE LIMITING (SIMPLE)
// =============================================

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map();

function simpleRateLimit(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;
  const currentTime = Date.now();
  const timeWindow = 60 * 1000; // 1 minute
  const maxRequests = parseInt(process.env.RATE_LIMIT) || 10; // 10 requests per minute per IP

  // Clean old entries
  for (const [ip, data] of rateLimitMap.entries()) {
    if (currentTime - data.firstRequest > timeWindow) {
      rateLimitMap.delete(ip);
    }
  }

  // Check current IP
  const ipData = rateLimitMap.get(clientIP);
  
  if (!ipData) {
    // First request from this IP
    rateLimitMap.set(clientIP, {
      requests: 1,
      firstRequest: currentTime
    });
  } else if (currentTime - ipData.firstRequest < timeWindow) {
    // Within time window
    if (ipData.requests >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((timeWindow - (currentTime - ipData.firstRequest)) / 1000)
      });
    }
    ipData.requests++;
  } else {
    // Time window expired, reset
    rateLimitMap.set(clientIP, {
      requests: 1,
      firstRequest: currentTime
    });
  }

  next();
}

// =============================================
// EXPORTS
// =============================================
module.exports = {
  validateRegistration,
  sanitizeRegistrationData,
  simpleRateLimit,
  // Export validation functions for testing
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidStatus
};
