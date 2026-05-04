# 🚨 Login Troubleshooting Guide
# Folusho Victory Schools - Supabase Authentication Issues

## 🎯 Current Issue: "Invalid Credentials"

Admin user exists in Supabase database, but login fails on the website.

---

## 🔍 Step-by-Step Troubleshooting

### **Step 1: Verify Supabase Database Setup**

1. **Go to Supabase:** https://app.supabase.com
2. **Click "SQL Editor"**
3. **Run this verification query:**

```sql
-- Check if admin user exists
SELECT id, email, password, role, is_active, created_at 
FROM users 
WHERE email = 'admin@folushovictory.com';

-- Check if schools table exists
SELECT COUNT(*) as school_count 
FROM schools;
```

4. **Expected Results:**
   - Should see 1 record for admin user
   - Should see 1 record for schools table

### **Step 2: Check Environment Variables**

1. **Go to your Netlify site**
2. **Open browser console** (F12)
3. **Check these variables:**

```javascript
// In browser console
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY);
```

4. **Expected Values:**
   ```
   REACT_APP_SUPABASE_URL: https://oscuovpwpzjqtaczsems.supabase.co
   REACT_APP_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NzU5NjksImV4cCI6MjAzMDU1MTk2OX0.8x6O9J2v4kS9q8W7N3K6D1X2Y5Z8W7N3K6D1X2Y5Z8
   ```

### **Step 3: Test Supabase Connection Directly**

1. **Create a test file** anywhere on your computer
2. **Add this code:**

```javascript
// test-connection.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oscuovpwpzjqtaczsems.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NzU5NjksImV4cCI6MjAzMDU1MTk2OX0.8x6O9J2v4kS9q8W7N3K6D1X2Y5Z8W7N3K6D1X2Y5Z8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can connect
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('count')
      .single()

    if (schoolsError) {
      console.error('❌ Schools connection failed:', schoolsError);
      return;
    }

    console.log('✅ Schools table accessible. Count:', schools.count);

    // Test 2: Check if admin user exists
    console.log('👤 Checking admin user...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@folushovictory.com')
      .single()

    if (usersError) {
      console.error('❌ Users connection failed:', usersError);
      return;
    }

    if (users) {
      console.log('✅ Admin user found:', {
        id: users.id,
        email: users.email,
        role: users.role,
        created_at: users.created_at
      });
    } else {
      console.log('❌ Admin user NOT found');
    }

    // Test 3: Try authentication
    console.log('🔐 Testing authentication...');
    const response = await supabaseService.login('admin@folushovictory.com', 'admin123', 'admin');
    console.log('✅ Authentication successful:', response);

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();
```

3. **Run the test:** `node test-connection.js`
4. **Expected output:** All tests should pass

### **Step 4: Check Network Issues**

1. **Browser Console:** Check for CORS errors
2. **Network Tab:** Check for failed requests
3. **Supabase Logs:** Check for connection issues

---

## 🔧 Common Issues and Solutions

### **Issue 1: Environment Variables Not Loading**
**Problem:** Netlify environment variables not set correctly
**Solution:** 
1. Go to Netlify → Site settings → Environment variables
2. Verify both variables are set correctly
3. Redeploy site

### **Issue 2: CORS Errors**
**Problem:** Browser blocking requests to Supabase
**Solution:** Supabase handles CORS automatically

### **Issue 3: Supabase Client Configuration**
**Problem:** Wrong Supabase URL or key
**Solution:** 
1. Verify URL: `https://oscuovpwpzjqtaczsems.supabase.co`
2. Verify ANON_KEY is correct
3. Check project settings in Supabase dashboard

### **Issue 4: Authentication Logic**
**Problem:** Password comparison or role mismatch
**Solution:** 
1. Check password field is correct
2. Verify role field matches database

---

## 🎯 Quick Fix Checklist

- [ ] Admin user exists in Supabase database
- [ ] Environment variables set correctly in Netlify
- [ ] No CORS errors in browser console
- [ ] Authentication works in test file
- [ ] Login works on deployed site

---

## 🚀 **Next Steps**

1. **Run verification queries** in Supabase SQL Editor
2. **Test connection** with test file
3. **Check environment variables** in Netlify
4. **Redeploy if needed** and test again

---

## ✅ **Expected Results**

After fixing issues:
- ✅ **Login works** with admin@folushovictory.com / admin123
- ✅ **No errors** in browser console
- ✅ **Authentication flow** completes successfully
- ✅ **User redirected** to dashboard

**Your Folusho Victory Schools Management System will be fully operational!** 🎓
