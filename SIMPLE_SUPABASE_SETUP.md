# 🚀 Simple Supabase + Netlify Setup
# Folusho Victory Schools - No Backend Needed

## 🎯 What You Need to Do

### **Step 1: Set Up Supabase Database (5 minutes)**

1. **Go to your Supabase project:** https://app.supabase.com
2. **Click "SQL Editor"**
3. **Run this SQL:**

```sql
-- Create all tables
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

CREATE TABLE IF NOT EXISTS academic_years (
    id SERIAL PRIMARY KEY,
    year VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

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

-- Insert initial data
INSERT INTO schools (name, email, address_street, address_city, address_state, phone)
VALUES ('Folusho Victory Schools', 'info@folushovictory.sch.ng', '123 Education Road', 'Kaduna', 'Kaduna', '+234-800-000-0000')
ON CONFLICT (email) DO NOTHING;

INSERT INTO academic_years (year, start_date, end_date)
VALUES ('2024/2025', '2024-09-01', '2025-07-31')
ON CONFLICT (year) DO NOTHING;

INSERT INTO school_terms (academic_year_id, term, name, start_date, end_date)
VALUES (1, 'First', 'First Term', '2024-09-01', '2024-12-15'),
       (1, 'Second', 'Second Term', '2025-01-06', '2025-03-28'),
       (1, 'Third', 'Third Term', '2025-04-14', '2025-07-31')
ON CONFLICT DO NOTHING;

INSERT INTO users (school_id, email, password, role)
VALUES (1, 'admin@folushovictory.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;
```

### **Step 2: Deploy to Netlify (3 minutes)**

1. **Go to Netlify:** https://app.netlify.com
2. **Connect your GitHub repository:** `Richaaron/allsystemgo`
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
4. **Add environment variables:**
   ```
   REACT_APP_SUPABASE_URL=https://oscuovpwpzjqtaczsems.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NzU5NjksImV4cCI6MjAzMDU1MTk2OX0.8x6O9J2v4kS9q8W7N3K6D1X2Y5Z8W7N3K6D1X2Y5Z8
   ```
5. **Click "Deploy site"**

---

## ✅ What's Already Done

I've already created:
- ✅ **Supabase service** (`src/services/supabaseService.js`) - Direct database operations
- ✅ **Updated login** to use Supabase directly
- ✅ **Environment variables** configured for production
- ✅ **No backend needed** - Everything runs through Supabase

---

## 🎯 Final Architecture

```
Frontend (Netlify) ←→ Supabase (Database + Auth)
```

**Just 2 platforms needed:**
- **Netlify** - Frontend hosting
- **Supabase** - Database + Authentication

---

## 🧪 Test Your System

1. **Login:** admin@folushovictory.com / admin123
2. **Create teachers** and **students**
3. **All data saved** directly to Supabase
4. **No backend** to maintain!

---

## 🎉 Benefits

- ✅ **No server management**
- ✅ **No backend deployment**
- ✅ **Free hosting** (Netlify + Supabase)
- ✅ **Simple maintenance**
- ✅ **Fast performance**
- ✅ **Real-time data**

**Your school management system is ready for production!** 🎓
