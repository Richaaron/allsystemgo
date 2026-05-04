# 🔧 Database Schema Fix
# Folusho Victory Schools - Correct Table Structure

## 🚨 **Issue Identified**
The SQL error shows that the `users` table doesn't have an `updated_at` column. This means the table structure is incomplete.

---

## 🛠️ **Complete Database Schema**

### **Step 1: Check Current Table Structure**
Run this in Supabase SQL Editor:

```sql
-- Check what columns exist in users table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

### **Step 2: Create/Update Users Table**
```sql
-- Drop and recreate users table with correct structure
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
```

### **Step 3: Insert Admin User**
```sql
-- Insert admin user with correct structure
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

### **Step 4: Create Other Required Tables**
```sql
-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address_street TEXT,
  address_city VARCHAR(100),
  address_state VARCHAR(100),
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  staff_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  position VARCHAR(100),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  school_id INTEGER REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  admission_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  date_of_birth DATE,
  class_id INTEGER,
  parent_guardian_name VARCHAR(255),
  parent_guardian_relationship VARCHAR(50),
  parent_guardian_phone VARCHAR(50),
  parent_guardian_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  school_id INTEGER REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level VARCHAR(50),
  arm VARCHAR(10),
  capacity INTEGER DEFAULT 40,
  current_enrollment INTEGER DEFAULT 0,
  school_id INTEGER REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic years table
CREATE TABLE IF NOT EXISTS academic_years (
  id SERIAL PRIMARY KEY,
  year VARCHAR(20) NOT NULL,
  is_current BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  school_id INTEGER REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- School terms table
CREATE TABLE IF NOT EXISTS school_terms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  academic_year_id INTEGER REFERENCES academic_years(id),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  school_id INTEGER REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Step 5: Insert Initial Data**
```sql
-- Insert school data
INSERT INTO schools (id, name, email, phone, address_city, address_state, created_at, updated_at)
VALUES (
  1,
  'Folusho Victory Schools',
  'info@folushovictory.com',
  '+234-800-000-0000',
  'Lagos',
  'Lagos State',
  NOW(),
  NOW()
);

-- Insert academic year
INSERT INTO academic_years (id, year, is_current, start_date, end_date, school_id, created_at, updated_at)
VALUES (
  1,
  '2024/2025',
  true,
  '2024-09-01',
  '2025-07-31',
  1,
  NOW(),
  NOW()
);

-- Insert school terms
INSERT INTO school_terms (id, name, academic_year_id, start_date, end_date, is_current, school_id, created_at, updated_at)
VALUES 
  (1, 'First Term', 1, '2024-09-01', '2024-12-15', true, 1, NOW(), NOW()),
  (2, 'Second Term', 1, '2025-01-06', '2025-03-28', false, 1, NOW(), NOW()),
  (3, 'Third Term', 1, '2025-04-14', '2025-07-31', false, 1, NOW(), NOW());
```

---

## 🎯 **Quick Fix Commands**

### **Option 1: Just Add Missing Column**
```sql
-- Add missing updated_at column to existing users table
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Then insert admin user
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

### **Option 2: Complete Table Recreation**
```sql
-- Recreate everything from scratch
DROP TABLE IF EXISTS users CASCADE;
-- Then run the CREATE TABLE statements above
```

---

## ✅ **Verification Steps**

### **Step 1: Verify Table Creation**
```sql
-- Check users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

### **Step 2: Verify Admin User**
```sql
-- Check if admin user exists
SELECT * FROM users WHERE email = 'admin@folushovictory.com';
```

### **Step 3: Test Login Query**
```sql
-- Test the exact login query
SELECT * FROM users 
WHERE email = 'admin@folushovictory.com' 
  AND password = 'admin123' 
  AND role = 'admin'
  AND is_active = true;
```

---

## 🚀 **Implementation Steps**

### **Step 1: Run Schema Fix**
1. **Open Supabase SQL Editor**
2. **Run table creation commands**
3. **Verify all tables created**

### **Step 2: Insert Data**
1. **Run admin user insertion**
2. **Run initial data insertion**
3. **Verify data integrity**

### **Step 3: Test Login**
1. **Test login query in SQL Editor**
2. **Test login in application**
3. **Check for errors**

---

## ✅ **Expected Results**

After fixing schema:
- ✅ **All tables created** with correct structure
- ✅ **Admin user exists** with proper credentials
- ✅ **Login query works** without SQL errors
- ✅ **Application login** succeeds
- ✅ **No more database errors**

**This will fix the SQL error and enable successful login!** 🎓
