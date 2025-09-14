# =============================================
# GOOGLE SHEETS CONFIGURATION FILE
# =============================================
# This file handles the connection to Google Sheets API
# It uses service account authentication for secure access

const { google } = require('googleapis');

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.auth = null;
    this.initializeAuth();
  }

  // =============================================
  // AUTHENTICATION SETUP
  // =============================================
  initializeAuth() {
    try {
      // Create authentication object using service account credentials
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          type: 'service_account',
          project_id: process.env.GOOGLE_PROJECT_ID,
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      // Create Sheets API instance
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      console.log('✅ Google Sheets authentication initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets auth:', error.message);
      throw error;
    }
  }

  // =============================================
  // WRITE DATA TO SHEET
  // =============================================
  async appendRegistration(registrationData) {
    try {
      // Validate required environment variables
      if (!process.env.GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID environment variable is required');
      }

      const { name, email, phone, status } = registrationData;
      
      // Prepare data row with timestamp
      const timestamp = new Date();
      const formattedDate = timestamp.toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // Data to append to sheet
      const values = [[
        formattedDate,    // Timestamp
        name,             // Name
        email,            // Email
        phone,            // Phone
        status,           // Status (single/couple)
        'Pending'         // Payment Status (you can update this later)
      ]];

      // Append data to Google Sheet
      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${process.env.GOOGLE_SHEET_NAME || 'Form Responses'}!A:F`, // Columns A through F
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values,
        },
      });

      console.log(`✅ Registration added to sheet: ${result.data.updates.updatedRows} row(s) updated`);
      
      return {
        success: true,
        rowsUpdated: result.data.updates.updatedRows,
        range: result.data.updates.updatedRange
      };

    } catch (error) {
      console.error('❌ Error writing to Google Sheets:', error.message);
      
      // Provide specific error messages for common issues
      if (error.message.includes('Unable to parse range')) {
        throw new Error('Invalid sheet name. Please check GOOGLE_SHEET_NAME in your .env file');
      } else if (error.message.includes('Requested entity was not found')) {
        throw new Error('Google Sheet not found. Please check GOOGLE_SHEET_ID in your .env file');
      } else if (error.message.includes('The caller does not have permission')) {
        throw new Error('Permission denied. Please share your Google Sheet with the service account email');
      }
      
      throw error;
    }
  }

  // =============================================
  // SETUP SHEET HEADERS (ONE-TIME SETUP)
  // =============================================
  async setupSheetHeaders() {
    try {
      // Check if headers already exist
      const headerCheck = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${process.env.GOOGLE_SHEET_NAME || 'Form Responses'}!A1:F1`,
      });

      // If headers don't exist or are empty, add them
      if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
        const headers = [['Timestamp', 'Name', 'Email', 'Phone', 'Status', 'Payment Status']];
        
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `${process.env.GOOGLE_SHEET_NAME || 'Form Responses'}!A1:F1`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: headers,
          },
        });

        console.log('✅ Sheet headers created successfully');
        return { success: true, message: 'Headers created' };
      } else {
        console.log('✅ Sheet headers already exist');
        return { success: true, message: 'Headers already exist' };
      }

    } catch (error) {
      console.error('❌ Error setting up sheet headers:', error.message);
      throw error;
    }
  }

  // =============================================
  // TEST CONNECTION
  // =============================================
  async testConnection() {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
      });

      console.log(`✅ Successfully connected to sheet: "${response.data.properties.title}"`);
      return {
        success: true,
        sheetTitle: response.data.properties.title,
        sheetId: response.data.spreadsheetId
      };
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new GoogleSheetsService();
