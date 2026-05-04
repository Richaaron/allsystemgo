# 🗄️ Supabase SQL Commands
# Copy and paste these commands into Supabase SQL Editor

## 📋 Step 1: Create Tables

Copy this entire block and paste into Supabase SQL Editor:

```sql
-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address_street VARCHAR(255) NOT NULL,
    address_city VARCHAR(100) NOT NULL,
    address_state VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id),
    staff_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    qualification VARCHAR(255),
    specialization JSONB,
    subjects_teaching JSONB,
    classes_assigned JSONB,
    department_id INTEGER,
    position VARCHAR(100),
    employment_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id),
    admission_number VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    state_of_origin VARCHAR(50) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    parent_guardian_name VARCHAR(255) NOT NULL,
    parent_guardian_relationship VARCHAR(50) NOT NULL,
    parent_guardian_phone VARCHAR(50) NOT NULL,
    class_id INTEGER,
    admission_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id),
    name VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    arm VARCHAR(5) NOT NULL,
    capacity INTEGER DEFAULT 30,
    current_enrollment INTEGER DEFAULT 0,
    room VARCHAR(50),
    academic_year_id INTEGER,
    term_id INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create academic_years table
CREATE TABLE IF NOT EXISTS academic_years (
    id SERIAL PRIMARY KEY,
    year VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create school_terms table
CREATE TABLE IF NOT EXISTS school_terms (
    id SERIAL PRIMARY KEY,
    academic_year_id INTEGER REFERENCES academic_years(id),
    term VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    class_id INTEGER REFERENCES classes(id),
    term_id INTEGER REFERENCES school_terms(id),
    academic_year_id INTEGER REFERENCES academic_years(id),
    subjects JSONB NOT NULL,
    summary JSONB NOT NULL,
    comments JSONB,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 📋 Step 2: Insert Initial Data

After creating tables, run this second block:

```sql
-- Insert school
INSERT INTO schools (name, email, address_street, address_city, address_state, phone)
VALUES ('Folusho Victory Schools', 'info@folushovictory.sch.ng', '123 Education Road', 'Kaduna', 'Kaduna', '+234-800-000-0000')
ON CONFLICT (email) DO NOTHING;

-- Insert academic year
INSERT INTO academic_years (year, start_date, end_date)
VALUES ('2024/2025', '2024-09-01', '2025-07-31')
ON CONFLICT (year) DO NOTHING;

-- Insert school terms
INSERT INTO school_terms (academic_year_id, term, name, start_date, end_date)
VALUES (1, 'First', 'First Term', '2024-09-01', '2024-12-15'),
       (1, 'Second', 'Second Term', '2025-01-06', '2025-03-28'),
       (1, 'Third', 'Third Term', '2025-04-14', '2025-07-31')
ON CONFLICT DO NOTHING;

-- Insert admin user
INSERT INTO users (school_id, email, password, role)
VALUES (1, 'admin@folushovictory.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;
```

---

## 🎯 How to Use

### **Step 1: Create Tables**
1. **Copy the first SQL block** (everything from CREATE TABLE to CREATE TABLE results)
2. **Paste into Supabase SQL Editor**
3. **Click "Run"** 
4. **Wait for success message**

### **Step 2: Insert Initial Data**
1. **Copy the second SQL block** (everything from INSERT INTO)
2. **Paste into Supabase SQL Editor**
3. **Click "Run"**
4. **Wait for success message**

### **Step 3: Verify Setup**
1. **Click "Table Editor"** in Supabase
2. **Check that tables exist:**
   - `schools` table with 1 record
   - `users` table with 1 record (admin user)
   - Other tables created successfully

---

## ✅ Success Indicators

You'll see these messages:
- ✅ **"Success"** - Tables created
- ✅ **"1 row affected"** - Data inserted
- ✅ **No errors** - Everything worked

---

## 🎯 After Database Setup

Once you see success messages:
1. **Go to your Netlify site**
2. **Try login:** admin@folushovictory.com / admin123
3. **Should work perfectly!** 🎓

**Your Folusho Victory Schools Management System will be fully operational!**
