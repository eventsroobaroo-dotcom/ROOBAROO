# ROOBAROO Backend - Simple Registration System

A lightweight Node.js backend for the ROOBAROO party registration website that captures form submissions and stores them in Google Sheets in real-time.

## 🎯 Project Overview

This backend provides:
- **Single endpoint** (`POST /api/register`) for form submissions
- **Real-time Google Sheets integration** - no database required
- **Input validation and sanitization** for security
- **Rate limiting** to prevent abuse
- **Simple deployment** on free hosting platforms

## 📋 Prerequisites

- Node.js 16+ installed
- A Google account
- A GitHub account (for deployment)

## 🚀 Quick Start Guide

### Step 1: Clone and Setup

```bash
# Clone your backend repository
git clone <your-backend-repo-url>
cd roobaroo-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Step 2: Google Sheets Setup

#### 2.1 Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "ROOBAROO Registrations"
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   The ID is: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

#### 2.2 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Create Project"
3. Name it "ROOBAROO Backend"
4. Note the Project ID

#### 2.3 Enable Google Sheets API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Sheets API"
3. Click **Enable**

#### 2.4 Create Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in details:
   - Name: `roobaroo-service-account`
   - Description: `Service account for ROOBAROO backend`
4. Click **Create and Continue**
5. For Role, select **Editor** (or **Project Owner**)
6. Click **Done**

#### 2.5 Generate Service Account Key

1. Click on your newly created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Select **JSON** format
5. Download the JSON file (keep it safe!)

#### 2.6 Share Sheet with Service Account

1. Open your Google Sheet
2. Click **Share** button
3. Add the service account email (from the JSON file):
   ```
   roobaroo-service-account@your-project.iam.gserviceaccount.com
   ```
4. Set permission to **Editor**
5. Uncheck "Notify people"
6. Click **Share**

### Step 3: Environment Configuration

Edit your `.env` file:

```bash
# Google Sheets Configuration
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
GOOGLE_SHEET_NAME=Form Responses
GOOGLE_PROJECT_ID=your-google-cloud-project-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=roobaroo-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from JSON file\n-----END PRIVATE KEY-----"

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Important:** For the `GOOGLE_PRIVATE_KEY`, copy the entire private key from the JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts.

### Step 4: Test Locally

```bash
# Start the server
npm start

# Test the health endpoint
curl http://localhost:5000/api/health

# Test Google Sheets connection
curl http://localhost:5000/api/test-sheets

# Test registration (replace with actual data)
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"9876543210","status":"single"}'
```

## 🌐 Deployment Options

### Option 1: Deploy to Render (Recommended - Free)

#### Step 1: Prepare for Deployment
1. Commit all files to your GitHub repository:
   ```bash
   git add .
   git commit -m "Initial backend setup"
   git push origin main
   ```

#### Step 2: Deploy on Render
1. Go to [Render.com](https://render.com)
2. Sign up/in with GitHub
3. Click **New** > **Web Service**
4. Connect your backend repository
5. Configure the service:
   - **Name**: `roobaroo-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Add Environment Variables
In Render dashboard, go to **Environment** and add:
```
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SHEET_NAME=Form Responses  
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your_private_key_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

#### Step 4: Deploy
1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Copy the service URL (e.g., `https://roobaroo-backend.onrender.com`)

### Option 2: Deploy to Railway (Alternative - Free Tier)

#### Step 1: Setup Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **New Project** > **Deploy from GitHub repo**
4. Select your backend repository

#### Step 2: Add Environment Variables
1. Go to **Variables** tab
2. Add all the environment variables from your `.env` file

#### Step 3: Deploy
1. Railway automatically deploys
2. Copy the generated URL

### Option 3: Deploy to Vercel (Serverless)

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Setup Vercel Project
```bash
# In your backend directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: roobaroo-backend
# - Directory: ./
# - Override settings? No
```

#### Step 3: Add Environment Variables
```bash
# Add each environment variable
vercel env add GOOGLE_SHEET_ID
vercel env add GOOGLE_PROJECT_ID
# ... add all variables
```

#### Step 4: Deploy
```bash
vercel --prod
```

## 📱 Frontend Integration

### Update Frontend Configuration

In your frontend `app.js`, update the API configuration:

```javascript
const API_CONFIG = {
    // Replace with your deployed backend URL
    BASE_URL: 'https://your-backend-url.onrender.com/api',
    // For local development: 'http://localhost:5000/api'
    TIMEOUT: 10000,
    DEBUG: false
};
```

### Mobile Responsiveness Fixes

Add the mobile enhancement CSS to your existing `style.css`:

1. **Copy the contents of `mobile-enhancements.css`**
2. **Paste it at the end of your existing `style.css` file**

These enhancements provide:
- Better touch targets (44px minimum)
- Improved mobile navigation
- Responsive form layouts
- Better spacing on small screens
- Landscape orientation support

## 🧪 Testing the Complete Flow

### 1. Test Backend Health
```bash
curl https://your-backend-url.onrender.com/api/health
```

### 2. Test Google Sheets Connection
```bash
curl https://your-backend-url.onrender.com/api/test-sheets
```

### 3. Test Registration
```bash
curl -X POST https://your-backend-url.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"9876543210","status":"single"}'
```

### 4. Check Google Sheet
- Open your Google Sheet
- Verify that the test registration appears as a new row

### 5. Test Frontend Integration
1. Open your frontend website
2. Fill out the registration form
3. Submit the form
4. Check that:
   - Success message appears
   - Entry appears in Google Sheet within 5 seconds
   - Payment page loads (if applicable)

### 6. Test Mobile Responsiveness
1. Open your website on mobile device or browser dev tools
2. Test mobile width (375px, 768px)
3. Verify:
   - Navigation works properly
   - Forms are easy to use
   - Text is readable
   - Buttons are easily tappable

## 📊 API Reference

### POST /api/register

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "phone": "9876543210",
  "status": "single"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration submitted successfully!",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "status": "single",
    "submittedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["Name is required", "Invalid email format"]
}
```

### GET /api/health

**Response:**
```json
{
  "status": "OK",
  "message": "ROOBAROO Backend is running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production"
}
```

## 🔧 Troubleshooting

### Common Issues

**1. "Permission denied" Error**
- **Cause**: Service account doesn't have access to the sheet
- **Solution**: Share your Google Sheet with the service account email

**2. "Sheet not found" Error** 
- **Cause**: Wrong `GOOGLE_SHEET_ID` in environment variables
- **Solution**: Double-check the Sheet ID from the URL

**3. "Authentication failed" Error**
- **Cause**: Invalid service account credentials
- **Solution**: Recreate the service account key and update `.env`

**4. CORS Errors on Frontend**
- **Cause**: Frontend URL not in CORS whitelist
- **Solution**: Update `FRONTEND_URL` environment variable

**5. "Quota exceeded" Error**
- **Cause**: Too many API requests to Google Sheets
- **Solution**: Wait a few minutes, or request quota increase

### Debugging Steps

**1. Check Logs**
```bash
# For Render
# Go to Render dashboard > Logs tab

# For Railway  
# Go to Railway dashboard > Deployments > View Logs

# For local development
npm run dev
```

**2. Verify Environment Variables**
```bash
# Test locally
node -e "require('dotenv').config(); console.log(process.env.GOOGLE_SHEET_ID)"
```

**3. Test Google Sheets Access**
```bash
curl https://your-backend-url.onrender.com/api/test-sheets
```

## 📈 Usage Limits & Quotas

### Google Sheets API Limits (Free)
- **Read requests**: 300 per minute per project
- **Write requests**: 300 per minute per project  
- **No daily limit**
- **No cost** for basic usage

### Free Hosting Limits

**Render Free Tier:**
- 512MB RAM
- Sleeps after 15 minutes of inactivity
- 750 hours/month (enough for most use cases)

**Railway Free Tier:**
- $5 credit monthly
- No sleep restrictions
- Pay-per-use after credits

**Vercel Free Tier:**
- 100GB bandwidth/month
- 10 seconds max execution time
- Perfect for serverless functions

## 🔒 Security Features

- **Input validation** and sanitization
- **Rate limiting** (10 requests per minute per IP)
- **CORS protection** (only allowed origins)
- **Environment variable protection** (no secrets in code)
- **Helmet.js** security headers
- **No database** (reduces attack surface)

## 📝 File Structure Explained

```
roobaroo-backend/
├── package.json          # Dependencies and scripts
├── server.js             # Main application entry point
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── config/
│   └── google-sheets.js # Google Sheets API configuration
├── middleware/
│   └── validation.js    # Input validation and sanitization
└── routes/
    └── register.js      # Registration endpoint handler
```

### File Explanations

**server.js** - The main file that starts your backend server. It sets up Express, adds security middleware, and connects all the routes together.

**config/google-sheets.js** - Handles all communication with Google Sheets. It authenticates with Google, writes data to sheets, and handles errors.

**middleware/validation.js** - Checks that form submissions have all required fields and are properly formatted. It also cleans the data and prevents spam.

**routes/register.js** - Handles the `/api/register` endpoint. When someone submits the form, this file receives it, validates it, and saves it to Google Sheets.

**.env.example** - Template showing what environment variables you need. Copy this to `.env` and fill in your actual values.

## ✅ Acceptance Criteria Checklist

- [ ] **Backend Setup**: All files created and configured
- [ ] **Google Sheets Integration**: Service account created and sheet shared  
- [ ] **Local Testing**: Backend runs locally without errors
- [ ] **API Testing**: Registration endpoint accepts and validates data
- [ ] **Google Sheets Testing**: Data appears in sheet after API call
- [ ] **Deployment**: Backend deployed to free hosting platform
- [ ] **Frontend Integration**: Frontend updated with backend URL
- [ ] **End-to-End Testing**: Form submission → sheet entry within 5 seconds
- [ ] **Mobile Testing**: Website looks good on mobile devices (375px, 768px)
- [ ] **Error Handling**: Appropriate error messages for validation failures
- [ ] **Documentation**: README complete with deployment steps

## 🎉 Success Verification

### Final Test Steps

1. **Submit a test registration** from your frontend
2. **Check Google Sheet** - new row should appear within 5 seconds
3. **Test on mobile** - form should be easy to use
4. **Test error handling** - submit invalid data, verify error messages
5. **Check backend health** - `/api/health` endpoint should return OK

### Expected Result
- ✅ Form submissions save to Google Sheets automatically  
- ✅ Mobile website looks professional and is easy to use
- ✅ All validation and error handling works properly
- ✅ Backend is live and accessible from your frontend

## 🆘 Support

If you encounter issues:

1. **Check the logs** in your hosting platform dashboard
2. **Verify environment variables** are set correctly
3. **Test the Google Sheets connection** using `/api/test-sheets`
4. **Check that your sheet is shared** with the service account
5. **Ensure your frontend** is using the correct backend URL

For additional help, verify each step in this README carefully. The most common issues are related to Google Sheets permissions and environment variable configuration.

## 🔄 Changelog

### Frontend Changes Made
- **style.css**: Added mobile responsiveness enhancements at the end of the file
- **app.js**: No changes needed (API configuration updated by you)

### Why These Changes Were Made
- **Mobile enhancements**: Improve touch targets, navigation, and form usability on mobile devices
- **No desktop changes**: All existing desktop styling and functionality preserved
- **Accessibility**: Better focus indicators and touch target sizes for mobile users

---

**🎊 That's it! Your ROOBAROO backend is now ready to handle registrations and save them to Google Sheets in real-time!**