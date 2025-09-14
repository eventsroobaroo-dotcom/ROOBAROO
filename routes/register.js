// =============================================
// REGISTRATION ROUTE FILE
// =============================================
// This file handles the /api/register endpoint
// It receives form submissions and saves them to Google Sheets

const express = require('express');
const router = express.Router();
const googleSheets = require('../config/google-sheets');
const { 
  validateRegistration, 
  sanitizeRegistrationData, 
  simpleRateLimit 
} = require('../middleware/validation');

// =============================================
// POST /api/register
// =============================================
// This endpoint receives registration form submissions
// and saves them to Google Sheets

router.post('/register', 
  simpleRateLimit,           // Rate limiting middleware
  sanitizeRegistrationData,  // Clean input data
  validateRegistration,      // Validate form data
  async (req, res) => {
    try {
      console.log('📝 New registration request received:', {
        name: req.body.name,
        email: req.body.email,
        status: req.body.status,
        timestamp: new Date().toISOString()
      });

      // Extract validated and sanitized data
      const { name, email, phone, status } = req.body;

      // Save to Google Sheets
      const result = await googleSheets.appendRegistration({
        name,
        email,
        phone,
        status
      });

      // Log successful registration
      console.log('✅ Registration saved successfully:', {
        name: name,
        email: email,
        rowsUpdated: result.rowsUpdated
      });

      // Send success response
      res.status(200).json({
        success: true,
        message: 'Registration submitted successfully!',
        data: {
          name: name,
          email: email,
          status: status,
          submittedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Registration error:', error.message);

      // Handle specific Google Sheets errors
      if (error.message.includes('Permission denied')) {
        return res.status(500).json({
          success: false,
          error: 'Server configuration error. Please contact support.',
          code: 'PERMISSION_ERROR'
        });
      }

      if (error.message.includes('Sheet not found')) {
        return res.status(500).json({
          success: false,
          error: 'Server configuration error. Please contact support.',
          code: 'SHEET_NOT_FOUND'
        });
      }

      if (error.message.includes('quota')) {
        return res.status(503).json({
          success: false,
          error: 'Service temporarily unavailable. Please try again in a few minutes.',
          code: 'QUOTA_EXCEEDED'
        });
      }

      // Generic error response
      res.status(500).json({
        success: false,
        error: 'Registration failed. Please try again later.',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

// =============================================
// GET /api/register (for testing)
// =============================================
// This endpoint returns information about the registration API
router.get('/register', (req, res) => {
  res.json({
    message: 'ROOBAROO Registration API',
    method: 'POST',
    endpoint: '/api/register',
    requiredFields: ['name', 'email', 'phone', 'status'],
    statusOptions: ['single', 'couple'],
    example: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      status: 'single'
    }
  });
});

// =============================================
// GET /api/test-sheets (for setup testing)
// =============================================
// This endpoint tests the Google Sheets connection
router.get('/test-sheets', async (req, res) => {
  try {
    console.log('🔍 Testing Google Sheets connection...');
    
    // Test connection
    const connectionTest = await googleSheets.testConnection();
    
    // Setup headers if needed
    const headerSetup = await googleSheets.setupSheetHeaders();
    
    res.json({
      success: true,
      message: 'Google Sheets connection successful',
      connection: connectionTest,
      headers: headerSetup
    });

  } catch (error) {
    console.error('❌ Sheets connection test failed:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Google Sheets connection failed',
      details: error.message,
      troubleshooting: {
        checkList: [
          '1. Verify GOOGLE_SHEET_ID in .env file',
          '2. Ensure service account has access to the sheet',
          '3. Check that all Google credentials are correct',
          '4. Make sure Google Sheets API is enabled in Google Cloud Console'
        ]
      }
    });
  }
});

module.exports = router;
