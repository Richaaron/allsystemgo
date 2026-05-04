# 🚀 Quick Action - Email Deployment Checklist

## ✅ Phase 1: Set Supabase Secrets (5 minutes)

### Command 1: Login to Supabase
```bash
supabase login
```
- Follow the browser prompt to authenticate
- Authenticate with your Supabase account

### Command 2: Link Your Project
```bash
supabase link --project-ref oscuovpwpzjqtaczsems
```

### Command 3: Set Email Secrets
```bash
supabase secrets set SMTP_HOST=smtp.gmail.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=folushovictoryschool@gmail.com
supabase secrets set "SMTP_PASS=zulz lkxf rdaz ojnb"
supabase secrets set JWT_SECRET=nigerian-school-jwt-secret-2024
```

### Command 4: Verify Secrets
```bash
supabase secrets list
```

Expected output:
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = folushovictoryschool@gmail.com
SMTP_PASS = [MASKED]
JWT_SECRET = [MASKED]
```

---

## ✅ Phase 2: Deploy Edge Functions (3 minutes)

### Command 1: Navigate to Project
```bash
cd c:\Users\PASTOR\Desktop\folusho-victory-react
```

### Command 2: Deploy Functions
```bash
supabase functions deploy
```

Expected output:
```
✓ Deploying email/send-notification
✓ Deploying email/send-result-notification
✓ Deploying email/send-fee-reminder
✓ Deploying email/broadcast
✓ Deploying auth/login
✓ Deploying teachers/*
... etc
```

### Command 3: Verify Deployment
```bash
supabase functions list
```

All functions should show status `active`.

---

## ✅ Phase 3: Deploy Frontend to Netlify (Web UI)

### Step 1: Connect to Netlify
1. Go to: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **GitHub** and authorize

### Step 2: Select Repository
1. Search for: `allsystemgo`
2. Select: `Richaaron/allsystemgo`
3. Click **"Install"** (if prompted)

### Step 3: Configure Build
1. **Build command:** `npm run build`
2. **Publish directory:** `build`
3. **Node version:** `18`

### Step 4: Set Environment Variables
Click **"Advanced"** → **"New variable"** and add:

```
REACT_APP_SUPABASE_URL = https://oscuovpwpzjqtaczsems.supabase.co
REACT_APP_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NzU5NjksImV4cCI6MjAzMDU1MTk2OX0.8x6O9J2v4kS9q8W7N3K6D1X2Y5Z8W7N3K6D1X2Y5Z8
REACT_APP_JWT_SECRET = nigerian-school-jwt-secret-2024
REACT_APP_SMTP_USER = folushovictoryschool@gmail.com
```

### Step 5: Deploy
Click **"Deploy site"** and wait for completion (3-5 min)

Your site URL will be: `https://[your-site-name].netlify.app`

---

## ✅ Phase 4: Test Email (2 minutes)

### Test 1: Verify Netlify Deployment
1. Go to your Netlify site
2. You should see the Folusho Victory Schools login page
3. Check browser console (F12) for any errors

### Test 2: Test Email Function Locally
```bash
# In one terminal, start Supabase local dev
supabase start

# In another terminal, run functions locally
supabase functions serve

# In a third terminal, test the email function
curl -X POST http://localhost:54321/functions/v1/email/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NzU5NjksImV4cCI6MjAzMDU1MTk2OX0.8x6O9J2v4kS9q8W7N3K6D1X2Y5Z8W7N3K6D1X2Y5Z8" \
  -d '{
    "recipient": "your-test-email@gmail.com",
    "subject": "Test Email",
    "content": "<h1>Test from Folusho Victory Schools</h1>"
  }'
```

### Test 3: Check Email Function Logs
```bash
supabase functions logs email/send-notification
```

---

## 📋 Current Status

✅ **Done:**
- Email functions created
- Gmail credentials ready
- netlify.toml updated to use Supabase
- Database ready

⏳ **Next:**
1. Run Supabase secrets commands (Phase 1)
2. Run Supabase deploy commands (Phase 2)
3. Deploy to Netlify via web UI (Phase 3)
4. Test email functionality (Phase 4)

---

## 🆘 If Something Goes Wrong

**Error: "Function not found"**
- Run: `supabase functions list`
- Ensure all functions are deployed
- Check `supabase/functions/` directory structure

**Error: "SMTP credentials invalid"**
- Verify Gmail app password in Supabase secrets
- Check Gmail account settings: https://myaccount.google.com/apppasswords

**Error: "CORS error"**
- Verify netlify.toml redirect URL
- Check Supabase function CORS headers

**Error: "Netlify deployment failed"**
- Check Netlify build logs
- Verify Node version is 18
- Check environment variables are set

---

## 📞 Useful Links

- Supabase Dashboard: https://app.supabase.com
- Netlify Dashboard: https://app.netlify.com
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Supabase CLI Docs: https://supabase.com/docs/reference/cli
- Netlify Docs: https://docs.netlify.com

---

**Ready to deploy? Start with Phase 1 commands above!**
