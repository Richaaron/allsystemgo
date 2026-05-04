# Supabase Migration - Setup & Deployment Guide

## Overview
Your Folusho Victory Schools app is now running on **Supabase Edge Functions** instead of Render. This means:
- ✅ Database: Supabase PostgreSQL (same as before)
- ✅ Backend: Supabase Edge Functions (replaces Express/Render)
- ✅ Email: Gmail SMTP (same credentials you already use!)
- ✅ Authentication: JWT (same approach)

## Architecture

```
React Frontend
      ↓ API calls
Supabase Edge Functions (serverless backend)
      ↓ queries
Supabase PostgreSQL
      ↓
Gmail SMTP (email)
```

## Prerequisites

1. **Supabase Account** (you have this: oscuovpwpzjqtaczsems.supabase.co)
2. **Gmail Account** (for SMTP email - you already have credentials!)
3. **Supabase CLI** (for local development)

## Step 1: Get Your Credentials

### Supabase
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings > API**
4. Copy:
   - `SUPABASE_URL` → `https://oscuovpwpzjqtaczsems.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
   - `SUPABASE_ANON_KEY` (for frontend)

### Gmail SMTP (You Already Have This!)
Your existing Gmail credentials work in Edge Functions:
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = folushovictoryschool@gmail.com
SMTP_PASS = your_app_password
```

**To get a Gmail app password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (custom name)"  
3. Google generates a 16-character password
4. Use that as `SMTP_PASS`

## Step 2: Local Development Setup

### Install Supabase CLI
```bash
npm install -g supabase
```

### Initialize Local Environment
```bash
cd c:\Users\PASTOR\Desktop\folusho-victory-react
supabase init  # Already done - folder exists
```

### Set Environment Variables
Create `.env.local`:
```bash
SUPABASE_URL=https://oscuovpwpzjqtaczsems.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key_here
JWT_SECRET=nigerian-school-jwt-secret-2024
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=folushovictoryschool@gmail.com
SMTP_PASS=your_app_password
```

### Test Locally
```bash
supabase start  # Starts local Supabase instance
supabase functions serve  # Serves Edge Functions locally
```

## Step 3: Deploy to Supabase

### Link Your Project
```bash
supabase link --project-ref oscuovpwpzjqtaczsems
```

### Deploy Edge Functions
```bash
supabase functions deploy
```

This will deploy all functions:
- auth/login
- auth/change-password
- teachers/*
- students/*
- results/*
- email/*
- data/*
- settings/*

## Step 4: Set Production Environment Variables

In Supabase Dashboard → Project Settings → Edge Functions Secrets:

```
JWT_SECRET = nigerian-school-jwt-secret-2024
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = folushovictoryschool@gmail.com
SMTP_PASS = your_gmail_app_password
```

## Step 5: Update Frontend

Your React app needs to call Edge Functions instead of Express.

Update `src/config/envConfig.js`:

```javascript
const config = {
  // Change from Express to Supabase Edge Functions
  apiUrl: process.env.REACT_APP_API_URL || 'https://oscuovpwpzjqtaczsems.supabase.co/functions/v1',
  
  // Add Supabase credentials
  supabaseUrl: 'https://oscuovpwpzjqtaczsems.supabase.co',
  supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  
  // Keep JWT_SECRET for token verification
  jwtSecret: process.env.REACT_APP_JWT_SECRET || 'nigerian-school-jwt-secret-2024'
};
```

## Step 6: Update API Calls

### Before (Render/Express):
```javascript
const response = await fetch('https://folusho-victory-schools-api.onrender.com/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### After (Supabase Edge Functions):
```javascript
const response = await fetch('https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/auth/login', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,  // For authenticated endpoints
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});
```

## Edge Function URLs

Replace your old API calls with these:

### Authentication
- `POST /functions/v1/auth/login`
- `POST /functions/v1/auth/change-password`

### Teachers
- `GET /functions/v1/teachers/list`
- `POST /functions/v1/teachers/create`
- `PUT /functions/v1/teachers/update/{id}`

### Students
- `GET /functions/v1/students/list`
- `POST /functions/v1/students/create`

### Results
- `GET /functions/v1/results/list`

### Email
- `POST /functions/v1/email/send-notification`
- `POST /functions/v1/email/send-result-notification`
- `POST /functions/v1/email/send-fee-reminder`
- `POST /functions/v1/email/broadcast`

### Data
- `GET /functions/v1/data/schools`
- `GET /functions/v1/data/academic-years`
- `GET /functions/v1/data/school-terms`
- `GET /functions/v1/data/classes`

### Settings
- `GET /functions/v1/settings/get`
- `PUT /functions/v1/settings/update`

## Testing

### Test Login Endpoint
```bash
curl -X POST https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password123"}'
```

### Test with Authentication
```bash
curl -X GET https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/teachers/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Email Testing

Once you have `SMTP_PASS` set:

```bash
# Test email function
curl -X POST https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/email/send-notification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient":"student@example.com",
    "subject":"Test Email",
    "content":"<h1>Hello from Supabase!</h1>"
  }'
```

**If email fails:** Check that SMTP credentials are set in Supabase Secrets

## Monitoring

### View Function Logs
```bash
supabase functions logs auth/login
```

### In Supabase Dashboard
1. Go to **Functions** tab
2. Click any function to see execution logs
3. Check for errors and performance metrics

## Cost Estimation

**Supabase Free Tier:**
- Edge Functions: 500K invocations/month
- PostgreSQL: 500MB database
- Email: Free (using your Gmail account via SMTP)

**Render Pricing:** You were paying $7/month minimum

**Supabase:** Free tier covers most small-medium apps + no email service fees!

## Troubleshooting

### Functions Not Deploying?
```bash
supabase functions deploy --no-verify-jwt
```

### Database Connection Error?
Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Environment Variables

### Email Not Sending?
1. Verify `SMTP_USER` and `SMTP_PASS` are set in Edge Functions Secrets
2. Make sure you're using Gmail app password (not your main password)
3. Check Supabase function logs: `supabase functions logs email/send-notification --tail`
4. Test with a broadcast endpoint or single notification

### CORS Issues?
All Edge Functions have CORS headers enabled. If still issues:
```javascript
// In utils.ts - already included
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
```

## Next Steps

1. ✅ Get Resend API key
2. ✅ Set environment variables in Supabase
3. ✅ Deploy Edge Functions
4. ✅ Update frontend API calls
5. ✅ Test each endpoint
6. ✅ Deploy React frontend
7. ✅ Monitor in Supabase dashboard

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Edge Functions: https://supabase.com/docs/guides/functions
- Resend Docs: https://resend.com/docs
- This project: Check `supabase/functions` folder
