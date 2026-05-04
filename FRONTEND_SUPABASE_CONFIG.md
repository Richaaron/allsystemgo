# 🔌 Frontend API Configuration - Supabase Edge Functions

## Overview

After deployment, your frontend will call Supabase Edge Functions instead of Render. This document shows the correct endpoint configuration.

---

## Frontend Endpoint Changes

### Before (Render Backend)
```javascript
const API_URL = "https://folusho-victory-schools-backend.onrender.com/api";

// Example: Send Email
fetch(`${API_URL}/email/send-notification`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ recipient, subject, content })
})
```

### After (Supabase Edge Functions)
```javascript
const SUPABASE_URL = "https://oscuovpwpzjqtaczsems.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // From .env

// Example: Send Email
fetch(`${SUPABASE_URL}/functions/v1/email/send-notification`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({ recipient, subject, content })
})
```

---

## API Endpoint Mapping

### Email Functions

| Function | Old Endpoint | New Endpoint |
|----------|-------------|--------------|
| Send Notification | `/api/email/send-notification` | `https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/email/send-notification` |
| Send Result Notification | `/api/email/send-result-notification` | `https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/email/send-result-notification` |
| Send Fee Reminder | `/api/email/send-fee-reminder` | `https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/email/send-fee-reminder` |
| Broadcast Email | `/api/email/broadcast` | `https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/email/broadcast` |

### Authentication Functions

| Function | Old Endpoint | New Endpoint |
|----------|-------------|--------------|
| Login | `/api/auth/login` | `https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/auth/login` |
| Change Password | `/api/auth/change-password` | `https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/auth/change-password` |

---

## Netlify Redirect Magic

**IMPORTANT:** Netlify's `netlify.toml` automatically redirects `/api/*` to Supabase!

This means your frontend can keep using:
```javascript
fetch('/api/email/send-notification', { ... })
```

And Netlify will automatically route it to:
```javascript
fetch('https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/email/send-notification', { ... })
```

### How it works:
```toml
# netlify.toml
[[redirects]]
  from = "/api/*"
  to = "https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/:splat"
  status = 200
  force = true
```

---

## Environment Variables

### For Frontend (.env.production)
```
REACT_APP_SUPABASE_URL=https://oscuovpwpzjqtaczsems.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_JWT_SECRET=nigerian-school-jwt-secret-2024
```

### In Netlify Build Settings
Set the same variables in:
**Site settings → Build & deploy → Environment**

---

## Code Example: Calling Email Function

### React Component
```javascript
import { useState, useEffect } from 'react';

export function SendEmailExample() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const sendEmail = async () => {
    try {
      setStatus('sending');
      
      const response = await fetch('/api/email/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          recipient: 'parent@example.com',
          subject: '📊 Your Child\'s Results are Ready',
          content: '<h1>Result Notification</h1><p>Your child\'s results are now available in the portal.</p>'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('success');
        setMessage('Email sent successfully!');
      } else {
        setStatus('error');
        setMessage('Failed to send email');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div>
      <button onClick={sendEmail} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Email'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

---

## Testing Endpoints

### Using cURL (From Terminal)

```bash
# Test email function
curl -X POST https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/email/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "recipient": "test@example.com",
    "subject": "Test Email",
    "content": "<h1>Test</h1>"
  }'
```

### Using JavaScript (Browser Console)

```javascript
const SUPABASE_URL = 'https://oscuovpwpzjqtaczsems.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

fetch(`${SUPABASE_URL}/functions/v1/email/send-notification`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_KEY}`
  },
  body: JSON.stringify({
    recipient: 'test@example.com',
    subject: 'Test from Browser',
    content: '<h1>Hello</h1>'
  })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

---

## Troubleshooting API Issues

### Issue: 404 Not Found
**Solution:** Function not deployed or wrong URL
```bash
# Check deployed functions
supabase functions list

# Verify URL spelling in your code
# Should be: /functions/v1/email/send-notification
```

### Issue: 401 Unauthorized
**Solution:** Missing or invalid Authorization header
```javascript
// Correct:
headers: {
  'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
}

// Wrong:
headers: {
  'Authorization': `Bearer invalid_key`
}
```

### Issue: CORS Error
**Solution:** Netlify redirect not working or Supabase CORS not configured
```bash
# Check netlify.toml is deployed
cat netlify.toml

# Should have:
# [[redirects]]
#   from = "/api/*"
#   to = "https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/:splat"
```

### Issue: Email Not Sending
**Solution:** SMTP credentials not set or invalid
```bash
# Check secrets in Supabase
supabase secrets list

# Should show:
# SMTP_HOST = smtp.gmail.com
# SMTP_PORT = 587
# SMTP_USER = [MASKED]
# SMTP_PASS = [MASKED]
```

---

## Summary

✅ Frontend stays on Netlify  
✅ Backend (Edge Functions) on Supabase  
✅ Email via Gmail SMTP  
✅ Database on Supabase PostgreSQL  
✅ Netlify redirects `/api/*` → Supabase  

Your frontend code **doesn't need major changes** - just ensure environment variables are set!

---

**Next Step:** Deploy Supabase Edge Functions using commands in QUICK_DEPLOYMENT_ACTIONS.md
