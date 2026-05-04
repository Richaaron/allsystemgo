# 🚀 Supabase Setup Guide
# Folusho Victory Schools Database

## 🎯 Why Supabase is Better

- ✅ **Free tier** - 500MB database, 50MB file storage
- ✅ **Easy setup** - No complex configuration
- ✅ **Built-in tools** - SQL editor, authentication, storage
- ✅ **Great performance** - Fast and reliable
- ✅ **No host header issues** - Works perfectly with Render

---

## 📋 Step-by-Step Setup

### **Step 1: Create Supabase Account**

1. **Go to:** https://supabase.com
2. **Click "Start your project"**
3. **Sign up with GitHub** (recommended)
4. **Verify your email** if prompted

### **Step 2: Create New Project**

1. **Click "New Project"**
2. **Choose organization** (or create new)
3. **Configure project:**
   ```
   Project Name: folusho-victory-schools
   Database Password: Create a strong password
   Region: Choose closest to Nigeria (Europe West)
   ```
4. **Click "Create new project"**
5. **Wait for setup** (1-2 minutes)

### **Step 3: Get Connection Details**

1. **Go to Project Dashboard**
2. **Click "Settings" → "Database"**
3. **Find "Connection string"**
4. **Copy the URI** (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres
   ```

### **Step 4: Set Up Database Tables**

1. **Go to "SQL Editor"** in Supabase dashboard
2. **Click "New query"**
3. **Copy and paste this SQL:**

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

4. **Click "Run"** to create tables

### **Step 5: Insert Initial Data**

Run this SQL in the same editor:

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

## 🔧 Update Render Web Service

### **Step 6: Update Environment Variables**

1. **Go to your Render web service**
2. **Click "Environment" tab**
3. **Update DATABASE_URL:**
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres
   ```
4. **Keep other variables:**
   ```
   NODE_VERSION=18
   JWT_SECRET=nigerian-school-jwt-secret-2024
   REACT_APP_SMTP_HOST=smtp.gmail.com
   REACT_APP_SMTP_PORT=587
   REACT_APP_SMTP_SECURE=false
   REACT_APP_SMTP_USER=folushovictoryschool@gmail.com
   REACT_APP_SMTP_PASS=zulz lkxf rdaz ojnb
   ```

---

## 🚀 Deploy and Test

### **Step 7: Deploy Backend**

1. **Click "Manual Deploy"** → "Deploy Latest Commit"
2. **Wait for deployment** (2-3 minutes)
3. **Test health endpoint:**
   ```
   https://your-service-name.onrender.com/api/health
   ```

### **Step 8: Test Database Connection**

```bash
curl -X POST https://your-service-name.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@folushovictory.com","password":"admin123","role":"admin"}'
```

---

## ✅ Success Indicators

Your setup is successful when:
- ✅ All tables created in Supabase
- ✅ Admin user inserted
- ✅ API health endpoint responds
- ✅ Login works with admin credentials
- ✅ No more host header errors

---

## 🎯 Benefits of Supabase

- **✅ No host header issues** - Works perfectly with Render
- **✅ Free tier** - 500MB database (plenty for schools)
- **✅ Built-in tools** - Easy SQL editor
- **✅ Great performance** - Fast and reliable
- **✅ Easy backup** - Automatic backups
- **✅ Scalable** - Can grow with your school

---

## 📱 Final Architecture

```
Frontend (Netlify) ←→ Backend API (Render) ←→ Database (Supabase)
```

**Your system will be much more reliable with Supabase!** 🎓
