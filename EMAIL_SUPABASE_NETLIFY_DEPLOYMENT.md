# 📧 Email on Supabase on Netlify - Complete Deployment Guide

## 🎯 Deployment Overview

This guide walks you through deploying the Folusho Victory Schools app with **email functionality** on:
- **Frontend:** Netlify (static hosting)
- **Backend:** Supabase Edge Functions (serverless)
- **Database:** Supabase PostgreSQL
- **Email:** Gmail SMTP (already configured)

## ✅ Current Status

- ✅ Email service code ready (using Deno + SMTP)
- ✅ Email functions created (`send-notification`, `send-result-notification`, `send-fee-reminder`, `broadcast`)
- ✅ Gmail credentials configured
- ✅ Database schema ready
- ✅ Frontend React app built

## 🚀 Deployment Steps

### **Phase 1: Set Up Supabase Environment Variables**

#### Step 1.1: Get Your Supabase Keys

1. Go to https://app.supabase.com
2. Select your project: `oscuovpwpzjqtaczsems`
3. Navigate to **Settings → API**
4. Copy these values:
   - **SUPABASE_URL**: https://oscuovpwpzjqtaczsems.supabase.co
   - **SUPABASE_SERVICE_ROLE_KEY**: (Keep this secret! It's in your account)
   - **SUPABASE_ANON_KEY**: (Frontend only, already in .env.production)

#### Step 1.2: Set Supabase Project Secrets

Run these commands to add secrets to your Supabase project:

```bash
# First, login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref oscuovpwpzjqtaczsems

# Add secrets for Edge Functions
supabase secrets set SMTP_HOST=smtp.gmail.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=folushovictoryschool@gmail.com
supabase secrets set SMTP_PASS="zulz lkxf rdaz ojnb"
supabase secrets set JWT_SECRET=nigerian-school-jwt-secret-2024

# Verify secrets are set
supabase secrets list
```

### **Phase 2: Deploy Supabase Edge Functions**

#### Step 2.1: Prepare Environment

```bash
cd c:\Users\PASTOR\Desktop\folusho-victory-react

# Install Supabase CLI (if not already installed)
npm install -g supabase

# Verify CLI is installed
supabase --version
```

#### Step 2.2: Deploy Functions

```bash
# Deploy all Edge Functions to Supabase
supabase functions deploy

# This will deploy:
# - auth/*
# - data/*
# - email/* (send-notification, send-result-notification, etc.)
# - results/*
# - settings/*
# - students/*
# - teachers/*
```

#### Step 2.3: Verify Deployment

Check that functions are deployed:

```bash
# List deployed functions
supabase functions list

# You should see:
# - email/send-notification
# - email/send-result-notification
# - email/send-fee-reminder
# - email/broadcast
# - auth/login
# - teachers/*
# etc.
```

### **Phase 3: Update Netlify Configuration**

#### Step 3.1: Update netlify.toml

Update the API redirect URL from Render to Supabase Edge Functions:

**File:** `netlify.toml`

```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  REACT_APP_SUPABASE_URL = "https://oscuovpwpzjqtaczsems.supabase.co"

# Redirect API calls to Supabase Edge Functions
[[redirects]]
  from = "/api/*"
  to = "https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/:splat"
  status = 200
  force = true

# SPA routing - send all unknown requests to index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  command = "npm run build"

[context.deploy-preview]
  command = "npm run build"

[context.branch-deploy]
  command = "npm run build"
```

### **Phase 4: Deploy Frontend to Netlify**

#### Step 4.1: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authenticate
4. Choose your repository: `Richaaron/allsystemgo`
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Node version:** `18`

#### Step 4.2: Add Environment Variables

In Netlify dashboard, go to **Site settings → Build & deploy → Environment**

Add these variables:
```
REACT_APP_SUPABASE_URL = https://oscuovpwpzjqtaczsems.supabase.co
REACT_APP_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NzU5NjksImV4cCI6MjAzMDU1MTk2OX0.8x6O9J2v4kS9q8W7N3K6D1X2Y5Z8W7N3K6D1X2Y5Z8
REACT_APP_SESSION_SECRET = nigerian-school-super-secret-key-2024-change-in-production
REACT_APP_JWT_SECRET = nigerian-school-jwt-secret-2024
REACT_APP_SMTP_HOST = smtp.gmail.com
REACT_APP_SMTP_PORT = 587
REACT_APP_SMTP_USER = folushovictoryschool@gmail.com
```

#### Step 4.3: Deploy

1. Click **"Deploy site"**
2. Wait for build and deployment (3-5 minutes)
3. Your site will be live at: `https://[your-site-name].netlify.app`

### **Phase 5: Test Email Functionality**

#### Step 5.1: Test Locally (Optional)

```bash
# Start local Supabase
supabase start

# In another terminal, serve functions locally
supabase functions serve

# Test email function
curl -X POST http://localhost:54321/functions/v1/email/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "recipient": "your-test-email@gmail.com",
    "subject": "Test Email",
    "content": "<h1>Test Email from Folusho Victory Schools</h1>"
  }'
```

#### Step 5.2: Test on Production

After deploying:

1. Go to your Netlify site: `https://[your-site-name].netlify.app`
2. Log in with a test account
3. Trigger an email action:
   - Create a new teacher (triggers welcome email)
   - Release results (triggers result notification)
   - Add a fee reminder (triggers fee notification)
4. Check Gmail inbox for `folushovictoryschool@gmail.com` notifications

#### Step 5.3: Debug Email Issues

**Check Supabase Logs:**

```bash
# View real-time logs
supabase functions list --json

# Check function logs
supabase functions logs email/send-notification
```

**Check Netlify Logs:**

1. Go to Netlify dashboard
2. Select your site
3. Go to **Deploys** → Select latest deploy
4. Check **Logs** for any errors

### **Phase 6: Post-Deployment Checklist**

- [ ] Supabase secrets are set (SMTP_HOST, SMTP_PASS, JWT_SECRET)
- [ ] Edge Functions deployed successfully
- [ ] netlify.toml points to Supabase Functions
- [ ] Frontend deployed to Netlify
- [ ] Environment variables added to Netlify
- [ ] Email service tested (received test email)
- [ ] HTTPS is enabled (automatic on Netlify)
- [ ] CORS is properly configured
- [ ] Database backups are scheduled

## 📋 Quick Command Reference

```bash
# Deploy Supabase Edge Functions
supabase functions deploy

# Check function logs
supabase functions logs email/send-notification

# List all secrets
supabase secrets list

# Push database changes
supabase db push

# Local development
supabase start
supabase functions serve
```

## 🔐 Security Best Practices

1. **Never commit secrets** to GitHub
2. **Use environment variables** for all sensitive data
3. **Rotate Gmail app password** periodically
4. **Enable 2FA** on Gmail account
5. **Use service role key** only on backend (never expose to frontend)
6. **Use anon key** only on frontend

## 🆘 Troubleshooting

### Email not sending?
- Check Gmail app password is correct
- Verify SMTP credentials in Supabase secrets
- Check email function logs: `supabase functions logs email/send-notification`
- Enable "Less secure app access" if needed (not recommended)

### Functions returning 404?
- Verify functions deployed: `supabase functions list`
- Check netlify.toml redirect path
- Verify CORS headers in Edge Functions

### CORS errors?
- Check `handleCors` function in `_shared/utils.ts`
- Verify Origin header is allowed

## 📞 Support

For issues with:
- **Supabase:** https://supabase.com/docs
- **Netlify:** https://docs.netlify.com
- **Email:** Check `supabase/functions/email/` directory

---

**Last Updated:** $(date)
**Deployment Version:** 1.0.0
