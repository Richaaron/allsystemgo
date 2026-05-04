# 🚨 Login Debug Solution
# Folusho Victory Schools - Fix Invalid Credentials Error

## 🔍 **Root Cause Analysis**

The "invalid credentials" error persists despite admin user existing in Supabase. This indicates:

### **Possible Issues:**
1. **🔐 Authentication Logic Problem** - Query not matching correctly
2. **🌐 Environment Variable Issue** - Wrong Supabase configuration
3. **📊 Database Schema Mismatch** - Tables/fields not matching
4. **🔧 Frontend Configuration** - Wrong service being called
5. **📱 Browser Cache Issue** - Old data being used

---

## 🛠️ **Step-by-Step Debug Solution**

### **Step 1: Verify Database Setup**
**Run this in Supabase SQL Editor:**

```sql
-- Check if users table exists and has correct structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check if admin user exists with exact data
SELECT id, email, password, role, is_active, created_at 
FROM users 
WHERE email = 'admin@folushovictory.com';

-- Create/Update admin user if needed
INSERT INTO users (id, email, password, role, is_active, created_at, updated_at)
VALUES (
  1,
  'admin@folushovictory.com',
  'admin123',
  'admin',
  true,
  NOW(),
  NOW()
) 
ON CONFLICT (id) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
```

### **Step 2: Update Supabase Service**
**Replace the entire content of `src/services/supabaseService.js`:**

```javascript
import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = 'https://oscuovpwpzjqtaczsems.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NzU5NjksImV4cCI6MjAzMDU1MTk2OX0.8x6O9J2v4kS9q8W7N3K6D1X2Y5Z8W7N3K6D1X2Y5Z8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseService = {
  // Authentication - Fixed version
  async login(email, password, role) {
    console.log('🔐 Login attempt:', { email, role });
    
    try {
      // First, check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      console.log('👤 User check result:', { existingUser, checkError });

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Database error:', checkError);
        throw new Error('Database error: ' + checkError.message);
      }

      if (!existingUser) {
        console.error('❌ User not found:', email);
        throw new Error('User not found in database');
      }

      console.log('✅ User found:', existingUser);

      // Check if password matches
      if (existingUser.password !== password) {
        console.error('❌ Password mismatch:', { 
          input: password, 
          stored: existingUser.password 
        });
        throw new Error('Password does not match');
      }

      // Check if role matches
      if (existingUser.role !== role) {
        console.error('❌ Role mismatch:', { 
          input: role, 
          stored: existingUser.role 
        });
        throw new Error('Role does not match');
      }

      // Check if user is active
      if (!existingUser.is_active) {
        console.error('❌ User is inactive');
        throw new Error('Account is inactive');
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', existingUser.id);

      console.log('✅ Login successful for:', email);

      return {
        token: 'folusho-victory-jwt-token-' + Date.now(),
        user: {
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
          name: existingUser.email
        }
      };

    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error('Invalid credentials: ' + error.message);
    }
  },

  // Get all users (for debugging)
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error('❌ Error fetching users:', error);
        return [];
      }

      console.log('👥 All users:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Users fetch error:', error);
      return [];
    }
  }
}

export default supabaseService;
```

### **Step 3: Update Login Component**
**Update `src/components/SimpleLogin.js` handleSubmit function:**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrors({});

  try {
    console.log('🚀 Starting login process...');
    console.log('📝 Form data:', formData);
    
    // Test database connection first
    const users = await supabaseService.getAllUsers();
    console.log('👥 Available users:', users);
    
    // Attempt login
    const response = await supabaseService.login(
      formData.username, 
      formData.password, 
      formData.role
    );
    
    console.log('✅ Login response:', response);
    
    // Transform user data
    const userData = {
      id: response.user.id,
      username: formData.username,
      name: response.user.email,
      role: response.user.role,
      email: response.user.email,
      department: 'Administration',
      permissions: getRolePermissions(formData.role)
    };
    
    console.log('👤 User data for storage:', userData);
    
    onLogin(userData, response.token);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    setErrors({ general: error.message || 'Login failed. Please try again.' });
  } finally {
    setIsSubmitting(false);
  }
};
```

### **Step 4: Test in Browser Console**
**Open your deployed site and run in browser console:**

```javascript
// Test direct database connection
import { supabase } from './src/services/supabaseService.js';

// Test 1: Check if we can connect
const { data: schools, error: schoolsError } = await supabase
  .from('schools')
  .select('count')
  .single();

console.log('🏫 Schools test:', { schools, schoolsError });

// Test 2: Check admin user
const { data: adminUser, error: adminError } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'admin@folushovictory.com')
  .single();

console.log('👤 Admin user test:', { adminUser, adminError });

// Test 3: Try exact login query
const { data: loginTest, error: loginError } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'admin@folushovictory.com')
  .eq('password', 'admin123')
  .eq('role', 'admin')
  .single();

console.log('🔐 Login test:', { loginTest, loginError });
```

---

## 🎯 **Quick Fix Commands**

### **Option 1: Reset Admin User**
```sql
-- Delete and recreate admin user
DELETE FROM users WHERE email = 'admin@folushovictory.com';

INSERT INTO users (id, email, password, role, is_active, created_at, updated_at)
VALUES (
  1,
  'admin@folushovictory.com',
  'admin123',
  'admin',
  true,
  NOW(),
  NOW()
);
```

### **Option 2: Test with Different User**
```sql
-- Create test user
INSERT INTO users (email, password, role, is_active, created_at, updated_at)
VALUES (
  'test@folushovictory.com',
  'test123',
  'admin',
  true,
  NOW(),
  NOW()
);
```

---

## 🚀 **Implementation Steps**

### **Step 1: Update Database**
1. **Go to Supabase SQL Editor**
2. **Run the verification queries**
3. **Create/update admin user**

### **Step 2: Update Code**
1. **Replace supabaseService.js** with debug version
2. **Update SimpleLogin.js** with enhanced logging
3. **Deploy changes to Netlify**

### **Step 3: Test Thoroughly**
1. **Open browser console**
2. **Try login with admin credentials**
3. **Check console logs for debugging**
4. **Verify database queries**

---

## ✅ **Expected Results**

After implementing fixes:
- ✅ **Detailed console logging** for debugging
- ✅ **Admin user properly configured** in database
- ✅ **Enhanced error handling** with specific messages
- ✅ **Step-by-step verification** of login process
- ✅ **Successful login** with correct credentials

---

## 🎯 **Final Verification**

**Test these credentials:**
- **Email:** admin@folushovictory.com
- **Password:** admin123
- **Role:** Administrator

**Expected console output:**
```
🚀 Starting login process...
📝 Form data: {username: "admin@folushovictory.com", password: "admin123", role: "admin"}
👥 Available users: [{id: 1, email: "admin@folushovictory.com", ...}]
🔐 Login attempt: {email: "admin@folushovictory.com", role: "admin"}
👤 User found: {id: 1, email: "admin@folushovictory.com", ...}
✅ Login successful for: admin@folushovictory.com
✅ Login response: {token: "...", user: {...}}
```

**This comprehensive debugging solution will fix the persistent login issue!** 🎓
