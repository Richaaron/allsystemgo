// Supabase Service - Direct Database Operations
// No backend needed - use Supabase directly

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oscuovpwpzjqtaczsems.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NDA0ODcsImV4cCI6MjA5MzQxNjQ4N30.pgofT26v04XScBHOi_yihTHox4L5lPEUYCGDGb0cltY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseService = {
  // Authentication
  async login(email, password, role) {
    console.log('🔐 Login attempt with:', { email, password, role });
    
    try {
      // First, try to get the user without .single() to see what we get
      const { data: allUsers, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

      console.log('📊 All matching users:', allUsers);

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        throw new Error(fetchError.message);
      }

      if (!allUsers || allUsers.length === 0) {
        console.error('❌ No user found with email:', email);
        throw new Error('User not found');
      }

      const user = allUsers[0];
      console.log('👤 User found:', user);

      // Check password
      if (user.password !== password) {
        console.error('❌ Password mismatch');
        throw new Error('Invalid password');
      }

      // Check role
      if (user.role !== role) {
        console.error('❌ Role mismatch. Expected:', role, 'Got:', user.role);
        throw new Error(`Role mismatch. User role is "${user.role}" but you selected "${role}"`);
      }

      console.log('✅ Login successful for user:', user.email);

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      return {
        token: 'dummy-jwt-token',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };

    } catch (error) {
      console.error('❌ Login error:', error.message);
      throw new Error(error.message || 'Invalid credentials');
    }
  },

  // Teachers
  async getTeachers() {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createTeacher(teacherData) {
    // Generate staff ID
    const staffId = 'STF' + Date.now().toString().slice(-6)

    const { data, error } = await supabase
      .from('teachers')
      .insert({
        ...teacherData,
        staff_id: staffId,
        school_id: 1
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTeacher(id, teacherData) {
    const { data, error } = await supabase
      .from('teachers')
      .update(teacherData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTeacher(id) {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Students
  async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createStudent(studentData) {
    // Generate admission number
    const admissionNumber = 'ADM' + Date.now().toString().slice(-6)

    const { data, error } = await supabase
      .from('students')
      .insert({
        ...studentData,
        admission_number: admissionNumber,
        school_id: 1
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateStudent(id, studentData) {
    const { data, error } = await supabase
      .from('students')
      .update(studentData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteStudent(id) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Classes
  async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async createClass(classData) {
    const { data, error } = await supabase
      .from('classes')
      .insert({
        ...classData,
        school_id: 1
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Results
  async getResults() {
    const { data, error } = await supabase
      .from('results')
      .select(`
        *,
        students:student_id (
          first_name,
          last_name,
          admission_number
        ),
        classes:class_id (
          name,
          level
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createResult(resultData) {
    const { data, error } = await supabase
      .from('results')
      .insert(resultData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Schools
  async getSchools() {
    const { data, error } = await supabase
      .from('schools')
      .select('*')

    if (error) throw error
    return data
  },

  // Academic Years
  async getAcademicYears() {
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .order('year', { ascending: false })

    if (error) throw error
    return data
  },

  // School Terms
  async getSchoolTerms() {
    const { data, error } = await supabase
      .from('school_terms')
      .select(`
        *,
        academic_years:academic_year_id (
          year
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
