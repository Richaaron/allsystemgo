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
      const isTeacherSubRole = ['form_teacher', 'subject_teacher', 'dual_role'].includes(role);
      const isTeacherMatch = user.role === 'teacher' && isTeacherSubRole;

      if (user.role !== role && !isTeacherMatch) {
        console.error('❌ Role mismatch. Expected:', role, 'Got:', user.role);
        throw new Error(`Role mismatch. User role is "${user.role}" but you selected "${role}"`);
      }

      console.log('✅ Login successful for user:', user.email);

      // Log the login activity
      await supabaseService.logTeacherActivity(
        user.email, // using email as we don't have name mapped here, or we can fetch teacher name, but email works
        user.role,
        'LOGIN',
        'Logged into the portal successfully.'
      );

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
    try {
      // Generate staff ID
      const staffId = 'STF' + Date.now().toString().slice(-6)

      // Build insert object with only fields that exist in your table
      const insertData = {
        staff_id: staffId,
        school_id: 1,
        first_name: teacherData.first_name || teacherData.firstName || '',
        last_name: teacherData.last_name || teacherData.lastName || '',
        email: teacherData.email || '',
        phone: teacherData.phone || '',
        gender: teacherData.gender || '',
        created_at: new Date().toISOString()
      }

      // Only add optional fields if they exist in your table
      // These will fail if columns don't exist - that's OK, teacher still gets created
      const optionalFields = ['department', 'role', 'subjects', 'status', 'assigned_class']
      optionalFields.forEach(field => {
        if (teacherData[field] !== undefined) {
          insertData[field] = teacherData[field]
        }
      })

      const { data, error } = await supabase
        .from('teachers')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase insert error:', error)
        throw new Error(error.message || 'Failed to create teacher')
      }

      return data
    } catch (error) {
      console.error('❌ createTeacher error:', error.message)
      throw error
    }
  },

  async updateTeacher(id, teacherData) {
    let data, error;

    const result = await supabase
      .from('teachers')
      .update(teacherData)
      .eq('id', id)
      .select()
      .single();

    data = result.data;
    error = result.error;

    // If updated_at column is missing, retry without it
    if (error && error.message && error.message.includes('updated_at')) {
      console.log('⚠️ updated_at column missing in teachers, retrying without it...');
      const { updated_at, ...restData } = teacherData;

      const result2 = await supabase
        .from('teachers')
        .update(restData)
        .eq('id', id)
        .select()
        .single();

      data = result2.data;
      error = result2.error;
    }

    if (error) throw error;
    return data;
  },

  async deleteTeacher(id) {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Create user account for teacher so they can login
  async createTeacherUser(userData) {
    try {
      console.log('👤 Creating teacher user account:', userData.email);

      // Check if user already exists first to prevent 409 Conflict browser network errors
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        console.warn('⚠️ Teacher user account already exists for this email.');
        return { exists: true, email: userData.email };
      }

      let data, error;

      // Try with school_id first
      const result = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password: userData.password,
          role: 'teacher',
          is_active: true,
          school_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      data = result.data;
      error = result.error;

      // If school_id column is missing, retry without it
      if (error && error.message && error.message.includes('school_id')) {
        console.log('⚠️ school_id column missing in users table, retrying without it...');

        const result2 = await supabase
          .from('users')
          .insert({
            email: userData.email,
            password: userData.password,
            role: 'teacher',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        data = result2.data;
        error = result2.error;
      }

      if (error) {
        if (error.code === '23505') {
          console.warn('⚠️ Teacher user account already exists for this email.');
          return { exists: true, email: userData.email };
        }
        console.error('❌ Failed to create teacher user:', error);
        throw error;
      }

      console.log('✅ Teacher user account created:', data);
      return data;
    } catch (error) {
      if (error.code !== '23505') {
        console.error('❌ Teacher user creation error:', error.message);
      }
      throw error;
    }
  },

  // Create user account for parent so they can login
  async createParentUser(userData) {
    try {
      console.log('👤 Creating parent user account:', userData.username);

      // We use username for parent login since email might be optional
      // But Supabase auth requires email format, so we can generate a dummy email if not provided
      const loginEmail = userData.email || `${userData.username}@parent.folushovictory.com`;

      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', loginEmail)
        .maybeSingle();

      if (existingUser) {
        console.warn('⚠️ Parent user account already exists.');
        return { exists: true, email: loginEmail };
      }

      let data, error;

      const result = await supabase
        .from('users')
        .insert({
          email: loginEmail,
          password: userData.password,
          role: 'parent',
          is_active: true,
          school_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      data = result.data;
      error = result.error;

      if (error && error.message && error.message.includes('school_id')) {
        const result2 = await supabase
          .from('users')
          .insert({
            email: loginEmail,
            password: userData.password,
            role: 'parent',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        data = result2.data;
        error = result2.error;
      }

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.code !== '23505') {
        console.error('❌ Parent user creation error:', error.message);
      }
      throw error;
    }
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
  },

  // Settings
  async getSettings(schoolId = 1) {
    try {
      console.log('📋 Fetching settings for school_id:', schoolId);
      
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('school_id', schoolId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching settings:', error);
        throw error;
      }

      console.log('✅ Settings fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Settings fetch error:', error.message);
      throw error;
    }
  },

  async updateSettings(schoolId, settingsData) {
    try {
      console.log('📝 Updating settings for school_id:', schoolId);
      console.log('📊 Settings data:', settingsData);

      // Try to update existing settings
      const { data, error } = await supabase
        .from('settings')
        .update(settingsData)
        .eq('school_id', schoolId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Error updating settings:', error);
        throw error;
      }

      if (!data) {
        // If no record was updated, create a new one
        console.log('📌 Creating new settings record');
        const { data: newData, error: insertError } = await supabase
          .from('settings')
          .insert([{
            school_id: schoolId,
            ...settingsData
          }])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating settings:', insertError);
          throw insertError;
        }

        console.log('✅ Settings created successfully:', newData);
        return newData;
      }

      console.log('✅ Settings updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Settings update error:', error.message);
      throw error;
    }
  },

  // Teacher Activity Logging
  async logTeacherActivity(teacherName, role, actionType, description, status = 'success') {
    try {
      // Allow it to fail gracefully if the table doesn't exist yet
      const { error } = await supabase
        .from('teacher_activities')
        .insert([{
          teacher_name: teacherName,
          role: role,
          action_type: actionType,
          description: description,
          status: status,
          school_id: 1 // Default
        }]);

      if (error) {
        console.warn('⚠️ Could not log activity (Table might not exist yet):', error.message);
      }
    } catch (e) {
      console.warn('⚠️ Activity logging failed:', e.message);
    }
  },

  async getTeacherActivities(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('teacher_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('⚠️ Could not fetch activities:', error.message);
        return []; // Return empty array if table missing
      }
      return data || [];
    } catch (e) {
      console.warn('⚠️ Fetching activities failed:', e.message);
      return [];
    }
  },

  // Students Data Operations
  async getStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('first_name', { ascending: true });
      if (error) throw error;
      
      // Map db column names to frontend camelCase
      return (data || []).map(s => ({
        id: s.id,
        admissionNumber: s.admission_number,
        firstName: s.first_name,
        lastName: s.last_name,
        studentClass: s.student_class,
        registeredSubjects: s.registered_subjects
      }));
    } catch (e) {
      console.error('❌ Error fetching students:', e.message);
      return [];
    }
  },

  async addStudent(studentData) {
    try {
      // Split name into first and last for compatibility with existing schema if needed
      const nameParts = studentData.studentName ? studentData.studentName.split(' ') : ['Unknown', 'Name'];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Unknown';

      const { data, error } = await supabase
        .from('students')
        .insert([{
          admission_number: studentData.admissionNumber,
          first_name: firstName,
          last_name: lastName,
          parent_guardian_name: studentData.parentName || 'Unknown',
          parent_guardian_phone: studentData.parentPhone || '0000000000',
          parent_guardian_email: studentData.parentEmail || null,
          student_class: studentData.class || 'Unassigned',
          status: 'active',
          gender: studentData.gender || 'Unknown',
          date_of_birth: studentData.dateOfBirth || '2000-01-01',
          address: studentData.address || 'Unknown',
          registered_subjects: []
        }])
        .select()
        .single();
        
      if (error) throw error;

      return {
        success: true,
        data: {
          id: data.id,
          admissionNumber: data.admission_number,
          firstName: data.first_name,
          lastName: data.last_name,
          studentClass: data.student_class,
          parentName: data.parent_guardian_name,
          parentPhone: data.parent_guardian_phone,
          parentEmail: data.parent_guardian_email,
          status: data.status,
          registeredSubjects: data.registered_subjects
        }
      };
    } catch (error) {
      console.error('❌ Error adding student:', error.message);
      throw error;
    }
  },

  async getStudentResults(term) {
    try {
      let query = supabase.from('student_results').select('*');
      if (term) query = query.eq('term', term);
      
      const { data, error } = await query;
      if (error) throw error;

      // Map db column names to frontend camelCase
      return (data || []).map(r => ({
        id: r.id,
        studentId: r.student_id,
        studentName: r.student_name,
        studentClass: r.student_class,
        term: r.term,
        subjects: r.subjects,
        overallTotal: r.overall_total,
        overallAverage: Number(r.overall_average),
        overallGrade: r.overall_grade,
        principalRemark: r.principal_remark,
        teacherRemark: r.teacher_remark
      }));
    } catch (e) {
      console.error('❌ Error fetching results:', e.message);
      return [];
    }
  },

  async saveStudentResult(student, term, subjectsArray, overallTotal, overallAverage, overallGrade) {
    try {
      // Upsert: Try to update if exists (by student_id and term), else insert
      const { data, error } = await supabase
        .from('student_results')
        .upsert([{
          student_id: student.id,
          student_name: `${student.firstName} ${student.lastName}`,
          student_class: student.studentClass,
          term: term,
          subjects: subjectsArray,
          overall_total: overallTotal,
          overall_average: overallAverage,
          overall_grade: overallGrade,
          school_id: 1
        }], { onConflict: 'student_id,term' })
        .select();
        
      if (error) throw error;
      return { success: true, data };
    } catch (e) {
      console.error('❌ Error saving result:', e.message);
      return { success: false, message: e.message };
    }
  },

  async seedSampleData() {
    try {
      // Check if students already exist
      const { count } = await supabase.from('students').select('*', { count: 'exact', head: true });
      if (count > 0) {
        console.log('🌱 Database already seeded.');
        return;
      }

      console.log('🌱 Seeding database with initial students...');
      
      const dummyDefaults = {
        parent_guardian_name: 'Mr. & Mrs. Default',
        parent_guardian_phone: '08000000000',
        parent_guardian_email: 'parent@example.com',
        address: '123 School Road',
        blood_group: 'O+',
        genotype: 'AA',
        state_of_origin: 'Kaduna',
        lga: 'Kaduna North',
        religion: 'Christianity',
        enrollment_date: '2024-01-01'
      };

      const sampleStudents = [
        { ...dummyDefaults, admission_number: 'FVS/2024/0001', first_name: 'Ahmed', last_name: 'Bello', student_class: 'JSS 2', date_of_birth: '2010-01-01', gender: 'Male', status: 'active', registered_subjects: [
            { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Basic Science', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Social Studies', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Civic Education', maxCA1: 20, maxCA2: 20, maxExam: 60 }
        ]},
        { ...dummyDefaults, admission_number: 'FVS/2024/0002', first_name: 'Chinyere', last_name: 'Okonkwo', student_class: 'JSS 2', date_of_birth: '2010-02-15', gender: 'Female', status: 'active', registered_subjects: [
            { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Basic Science', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Basic Technology', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Business Studies', maxCA1: 20, maxCA2: 20, maxExam: 60 }
        ]},
        { ...dummyDefaults, admission_number: 'FVS/2024/0003', first_name: 'Tunde', last_name: 'Johnson', student_class: 'SSS 1', date_of_birth: '2008-05-10', gender: 'Male', status: 'active', registered_subjects: [
            { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Physics', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Chemistry', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Biology', maxCA1: 20, maxCA2: 20, maxExam: 60 }
        ]},
        { ...dummyDefaults, admission_number: 'FVS/2024/0004', first_name: 'Fatima', last_name: 'Mohammed', student_class: 'SSS 1', date_of_birth: '2008-11-22', gender: 'Female', status: 'active', registered_subjects: [
            { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Physics', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Chemistry', maxCA1: 20, maxCA2: 20, maxExam: 60 }, { name: 'Geography', maxCA1: 20, maxCA2: 20, maxExam: 60 }
        ]}
      ];

      const { data: insertedStudents, error: studentError } = await supabase.from('students').insert(sampleStudents).select();
      if (studentError) throw studentError;

      // Seed 1 result
      if (insertedStudents && insertedStudents.length > 0) {
        const firstStudent = insertedStudents[0];
        await supabase.from('student_results').insert([{
          student_id: firstStudent.id,
          student_name: `${firstStudent.first_name} ${firstStudent.last_name}`,
          student_class: firstStudent.student_class,
          term: 'Second Term',
          subjects: [
            { name: 'English Language', ca1: 18, ca2: 19, exam: 48, total: 85, grade: 'A' },
            { name: 'Mathematics', ca1: 16, ca2: 17, exam: 45, total: 78, grade: 'B' },
            { name: 'Basic Science', ca1: 17, ca2: 18, exam: 50, total: 85, grade: 'A' }
          ],
          overall_total: 248,
          overall_average: 82.7,
          overall_grade: 'A',
          school_id: 1
        }]);
      }
      console.log('✅ Seed complete.');
    } catch (e) {
      console.error('❌ Seeding failed:', e.message);
    }
  }
}
