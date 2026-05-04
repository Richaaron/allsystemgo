# 🚀 Supabase Only Setup Guide
# Folusho Victory Schools - Database + Backend + Frontend

## 🎯 Architecture Overview

```
Frontend (Netlify) ←→ Supabase Edge Functions (Backend API) ←→ Supabase Database
```

**Benefits:**
- ✅ **Single platform** - Everything on Supabase
- ✅ **No separate backend** - Edge Functions handle API
- ✅ **Free tier** - Database + Functions
- ✅ **Easy deployment** - One platform
- ✅ **No host issues** - Everything works together

---

## 📋 Step-by-Step Setup

### **Step 1: Set Up Supabase Database**

1. **Go to your Supabase project**
2. **Click "SQL Editor"**
3. **Run this SQL to create all tables:**

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

4. **Insert initial data:**

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

### **Step 2: Create Supabase Edge Functions**

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Edge Functions:**
   ```bash
   supabase login
   supabase init --project-id oscuovpwpzjqtaczsems
   supabase functions setup
   ```

3. **Create Edge Function files:**

Create `supabase/functions/auth/index.ts`:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, role } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    )

    // Check user credentials
    const { data: user, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('role', role)
      .single()

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Update last login
    await supabaseClient
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    return new Response(
      JSON.stringify({ 
        token: 'dummy-jwt-token',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

Create `supabase/functions/teachers/index.ts`:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    )

    if (req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('teachers')
        .select('*')

      if (error) throw error
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      const teacherData = await req.json()
      
      // Generate staff ID
      const staffId = 'STF' + Date.now().toString().slice(-6)
      
      const { data, error } = await supabaseClient
        .from('teachers')
        .insert({
          ...teacherData,
          staff_id: staffId,
          school_id: 1
        })
        .select()
        .single()

      if (error) throw error
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

Create `supabase/functions/students/index.ts`:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    )

    if (req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('students')
        .select('*')

      if (error) throw error
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      const studentData = await req.json()
      
      // Generate admission number
      const admissionNumber = 'ADM' + Date.now().toString().slice(-6)
      
      const { data, error } = await supabaseClient
        .from('students')
        .insert({
          ...studentData,
          admission_number: admissionNumber,
          school_id: 1
        })
        .select()
        .single()

      if (error) throw error
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

### **Step 3: Deploy Edge Functions**

```bash
supabase functions deploy auth
supabase functions deploy teachers
supabase functions deploy students
```

---

### **Step 4: Update Frontend Configuration**

Create `src/config/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oscuovpwpzjqtaczsems.supabase.co'
const supabaseAnonKey = 'your-anon-key-from-supabase'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Edge Functions URLs
export const API_URL = 'https://oscuovpwpzjqtaczsems.supabase.co/functions/v1'
```

Update `src/services/apiService.js`:
```javascript
import { API_URL } from '../config/supabase'

export const apiService = {
  async login(credentials) {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })
    return response.json()
  },

  async getTeachers() {
    const response = await fetch(`${API_URL}/teachers`)
    return response.json()
  },

  async createTeacher(teacherData) {
    const response = await fetch(`${API_URL}/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherData)
    })
    return response.json()
  },

  async getStudents() {
    const response = await fetch(`${API_URL}/students`)
    return response.json()
  },

  async createStudent(studentData) {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData)
    })
    return response.json()
  }
}
```

---

### **Step 5: Deploy Frontend to Netlify**

1. **Update .env.production:**
   ```env
   REACT_APP_SUPABASE_URL=https://oscuovpwpzjqtaczsems.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Deploy to Netlify:**
   - Go to https://app.netlify.com
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`

---

## ✅ Success Checklist

Your setup is complete when:
- [ ] All tables created in Supabase
- [ ] Edge Functions deployed
- [ ] Frontend deployed to Netlify
- [ ] Login works with admin credentials
- [ ] CRUD operations work

---

## 🎯 Final URLs

```
Frontend: https://your-site.netlify.app
Database: https://app.supabase.com
Edge Functions: https://oscuovpwpzjqtaczsems.supabase.co/functions/v1
```

**Your complete system runs on just two platforms: Supabase + Netlify!** 🎓
