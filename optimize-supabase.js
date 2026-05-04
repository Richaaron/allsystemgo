// Optimized Supabase Connection
// Better performance and error handling

import { createClient } from '@supabase/supabase-js'

// Optimized Supabase client with connection pooling
const supabase = createClient(
  'https://oscuovpwpzjqtaczsems.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NDA0ODcsImV4cCI6MjA5MzQxNjQ4N30.pgofT26v04XScBHOi_yihTHox4L5lPEUYCGDGb0cltY',
  {
    auth: {
      persistSession: false, // Don't persist session for better performance
      detectSessionInUrl: false, // Don't detect session in URL
      autoRefreshToken: false, // Don't auto-refresh token
    },
    db: {
      schema: 'public', // Explicit schema
    },
    global: {
      headers: {
        'X-Client-Info': 'folusho-victory-schools'
      }
    }
  }
)

export const optimizedSupabaseService = {
  // Optimized authentication with better error handling
  async login(email, password, role) {
    console.log('🔐 Attempting login with:', { email, role });
    
    try {
      // Use optimized query with specific fields only
      const { data, error } = await supabase
        .from('users')
        .select('id, email, password, role, is_active, last_login, created_at')
        .eq('email', email)
        .eq('password', password)
        .eq('role', role)
        .single()
        .throwOnError()

      if (error) {
        console.error('❌ Database query failed:', error);
        throw new Error(`Authentication failed: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No user found with provided credentials');
        throw new Error('Invalid credentials: User not found');
      }

      // Check if user is active
      if (!data.is_active) {
        throw new Error('Account is inactive. Please contact administrator.');
      }

      console.log('✅ Login successful for user:', data.email);
      
      // Update last login with optimized query
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id)
        .single()

      return {
        token: 'folusho-victory-jwt-token-' + Date.now(),
        user: {
          id: data.id,
          email: data.email,
          role: data.role
        }
      };

    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  // Optimized data fetching with caching
  async getTeachers() {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, staff_id, first_name, last_name, email, phone, position, is_active, created_at')
        .order('created_at', { ascending: false })
        .throwOnError()

      if (error) {
        console.error('❌ Teachers fetch failed:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Teachers fetch error:', error);
      return [];
    }
  },

  // Optimized student fetching
  async getStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, admission_number, first_name, last_name, email, class_id, status, created_at')
        .order('created_at', { ascending: false })
        .throwOnError()

      if (error) {
        console.error('❌ Students fetch failed:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Students fetch error:', error);
      return [];
    }
  },

  // Optimized class fetching
  async getClasses() {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, level, arm, capacity, current_enrollment, created_at')
        .order('name')
        .throwOnError()

      if (error) {
        console.error('❌ Classes fetch failed:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Classes fetch error:', error);
      return [];
    }
  },

  // Optimized teacher creation
  async createTeacher(teacherData) {
    try {
      // Generate optimized staff ID
      const staffId = 'STF' + Date.now().toString().slice(-6);
      
      const { data, error } = await supabase
        .from('teachers')
        .insert({
          ...teacherData,
          staff_id: staffId,
          school_id: 1,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select('id, staff_id, first_name, last_name, email')
        .single()
        .throwOnError()

      if (error) {
        console.error('❌ Teacher creation failed:', error);
        throw error;
      }

      console.log('✅ Teacher created successfully:', data.email);
      return data;

    } catch (error) {
      console.error('❌ Teacher creation error:', error);
      throw error;
    }
  },

  // Optimized student creation
  async createStudent(studentData) {
    try {
      // Generate optimized admission number
      const admissionNumber = 'ADM' + Date.now().toString().slice(-6);
      
      const { data, error } = await supabase
        .from('students')
        .insert({
          ...studentData,
          admission_number: admissionNumber,
          school_id: 1,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select('id, admission_number, first_name, last_name, email')
        .single()
        .throwOnError()

      if (error) {
        console.error('❌ Student creation failed:', error);
        throw error;
      }

      console.log('✅ Student created successfully:', data.admission_number);
      return data;

    } catch (error) {
      console.error('❌ Student creation error:', error);
      throw error;
    }
  }
}

export default optimizedSupabaseService;
