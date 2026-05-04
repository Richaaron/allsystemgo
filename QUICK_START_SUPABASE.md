# 🚀 Supabase Edge Functions - Quick Start (5 Minutes)

## ✅ Done
Your Edge Functions are created and ready to deploy!

## 📋 What You Have
- ✅ 18+ Edge Functions (TypeScript/Deno)
- ✅ Email templates with Resend support
- ✅ JWT authentication
- ✅ Database integration (Supabase PostgreSQL)
- ✅ Frontend service layer

## 🔧 Next: Get Credentials (2 min)

### 1. Get Supabase Keys
Visit: https://app.supabase.com → Your Project → Settings → API

```
SUPABASE_URL = https://oscuovpwpzjqtaczsems.supabase.co
SUPABASE_SERVICE_ROLE_KEY = (copy from "Service role secret")
SUPABASE_ANON_KEY = (copy from "anon public")
```

### 2. Gmail App Password (for SMTP email)
**If you want to keep using Gmail for email:**

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (custom name)"
3. Type "Folusho Victory Schools"
4. Copy the generated password

```
SMTP_USER = folushovictoryschool@gmail.com
SMTP_PASS = (the generated app password)
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
```

**If you don't want email notifications at all:**
- Skip this step - email will just fail silently

## 🚀 Deploy (2 min)

### Install Supabase CLI
```bash
npm install -g supabase
```

### Link Your Project
```bash
supabase link --project-ref oscuovpwpzjqtaczsems
# Password: your Supabase password
```

### Deploy Functions
```bash
supabase functions deploy
```

### Set Secrets in Supabase Dashboard
1. Go to https://app.supabase.com → Your Project
2. Settings → Edge Functions → Secrets
3. Add:
   - `JWT_SECRET` = nigerian-school-jwt-secret-2024
   - `SMTP_USER` = folushovictoryschool@gmail.com
   - `SMTP_PASS` = your_app_password (from Gmail)
   - `SMTP_HOST` = smtp.gmail.com
   - `SMTP_PORT` = 587

## ✨ Test (1 min)

### Test Login
```bash
curl -X POST https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"yourpassword"}'
```

Should return:
```json
{
  "user": { "id": 1, "email": "admin@school.com", "role": "admin" },
  "token": "eyJhbGc...",
  "message": "Login successful"
}
```

## 📱 Update Frontend (Optional - Recommended)

### In any component, use:
```javascript
import { authService, teacherService } from 'src/services/supabaseEdgeFunctions';

// Login
const { user, token } = await authService.login('email@school.com', 'password');
localStorage.setItem('authToken', token);

// Get teachers
const { teachers } = await teacherService.list();

// Send email
await emailService.sendNotification(
  'parent@example.com',
  'Grade Report',
  '<h1>Your child got an A!</h1>'
);
```

## 🔄 Replace Old Express Calls

Old (Render):
```javascript
fetch('https://folusho-victory-schools-api.onrender.com/api/teachers')
```

New (Supabase):
```javascript
fetch('https://oscuovpwpzjqtaczsems.supabase.co/functions/v1/teachers/list', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

**Or just use the service layer (recommended):**
```javascript
import { teacherService } from 'src/services/supabaseEdgeFunctions';
const { teachers } = await teacherService.list();
```

## 📊 Monitor

View live logs:
```bash
supabase functions logs auth/login --tail
```

Or in Dashboard: Functions tab → Click any function → Logs

## 🎯 Success Checklist

- [ ] Supabase CLI installed
- [ ] Project linked (`supabase link`)
- [ ] Functions deployed (`supabase functions deploy`)
- [ ] SMTP credentials set in Secrets (SMTP_USER, SMTP_PASS, etc)
- [ ] JWT_SECRET set in Secrets
- [ ] Login endpoint tested (curl command above)
- [ ] Frontend updated to use new API URLs
- [ ] Email sending works (test broadcast endpoint)

## 💡 Benefits Now

✅ No Render bills anymore  
✅ Auto-scaling (handles traffic spikes)  
✅ Email notifications work (same Gmail you already use)  
✅ All data in Supabase (single source of truth)  
✅ Easy monitoring and logging  
✅ Free tier covers all usage + no email service costs  

## ❓ Questions?

- Edge Functions: https://supabase.com/docs/guides/functions
- Resend: https://resend.com/docs
- Supabase CLI: https://supabase.com/docs/reference/cli/introduction

## 🔗 Your Project URLs

```
Supabase Dashboard: https://app.supabase.com
Project URL: https://oscuovpwpzjqtaczsems.supabase.co
Edge Functions Base: https://oscuovpwpzjqtaczsems.supabase.co/functions/v1
```

---

**Ready? Run these commands:**

```bash
npm install -g supabase
supabase link --project-ref oscuovpwpzjqtaczsems
supabase functions deploy
```

That's it! 🎉
