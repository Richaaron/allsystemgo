// Teacher Role System Models and Data

export const TEACHER_ROLES = {
  FORM_TEACHER: 'form_teacher',
  SUBJECT_TEACHER: 'subject_teacher',
  DUAL_ROLE: 'dual_role'
};

export const TEACHER_ROLE_DESCRIPTIONS = {
  [TEACHER_ROLES.FORM_TEACHER]: {
    title: 'Form Teacher',
    description: 'Manages a specific class and oversees all students in that class',
    permissions: [
      'view_assigned_class_students',
      'manage_class_attendance',
      'view_class_results',
      'add_class_remarks',
      'manage_class_discipline',
      'communicate_with_parents'
    ]
  },
  [TEACHER_ROLES.SUBJECT_TEACHER]: {
    title: 'Subject Teacher',
    description: 'Teaches specific subjects and manages results for students taking those subjects',
    permissions: [
      'view_assigned_subject_students',
      'enter_subject_results',
      'manage_subject_attendance',
      'add_subject_remarks',
      'view_subject_performance'
    ]
  },
  [TEACHER_ROLES.DUAL_ROLE]: {
    title: 'Dual Role Teacher',
    description: 'Combines Form Teacher and Subject Teacher responsibilities',
    permissions: [
      'view_assigned_class_students',
      'manage_class_attendance',
      'view_class_results',
      'add_class_remarks',
      'manage_class_discipline',
      'communicate_with_parents',
      'view_assigned_subject_students',
      'enter_subject_results',
      'manage_subject_attendance',
      'add_subject_remarks',
      'view_subject_performance'
    ]
  }
};

// Mock teacher data
export const MOCK_TEACHERS = [
  {
    id: 1,
    staffId: 'FVS/STF/001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@folushovictory.sch.ng',
    phone: '+234-801-234-5678',
    role: TEACHER_ROLES.FORM_TEACHER,
    assignedClass: 'SSS 1A',
    assignedSubjects: [],
    department: 'Sciences',
    qualification: 'B.Sc Education',
    experience: '8 years',
    status: 'active',
    dateJoined: '2016-09-01'
  },
  {
    id: 2,
    staffId: 'FVS/STF/002',
    firstName: 'Michael',
    lastName: 'Chukwu',
    email: 'michael.chukwu@folushovictory.sch.ng',
    phone: '+234-802-345-6789',
    role: TEACHER_ROLES.SUBJECT_TEACHER,
    assignedClass: null,
    assignedSubjects: ['Mathematics', 'Further Mathematics'],
    department: 'Mathematics',
    qualification: 'M.Sc Mathematics',
    experience: '12 years',
    status: 'active',
    dateJoined: '2012-09-01'
  },
  {
    id: 3,
    staffId: 'FVS/STF/003',
    firstName: 'Aisha',
    lastName: 'Bello',
    email: 'aisha.bello@folushovictory.sch.ng',
    phone: '+234-803-456-7890',
    role: TEACHER_ROLES.DUAL_ROLE,
    assignedClass: 'JSS 2B',
    assignedSubjects: ['English Language', 'Literature in English'],
    department: 'Languages',
    qualification: 'B.A English',
    experience: '6 years',
    status: 'active',
    dateJoined: '2018-09-01'
  },
  {
    id: 4,
    staffId: 'FVS/STF/004',
    firstName: 'David',
    lastName: 'Okonkwo',
    email: 'david.okonkwo@folushovictory.sch.ng',
    phone: '+234-804-567-8901',
    role: TEACHER_ROLES.SUBJECT_TEACHER,
    assignedClass: null,
    assignedSubjects: ['Physics', 'Chemistry'],
    department: 'Sciences',
    qualification: 'B.Sc Physics',
    experience: '10 years',
    status: 'active',
    dateJoined: '2014-09-01'
  },
  {
    id: 5,
    staffId: 'FVS/STF/005',
    firstName: 'Grace',
    lastName: 'Abubakar',
    email: 'grace.abubakar@folushovictory.sch.ng',
    phone: '+234-805-678-9012',
    role: TEACHER_ROLES.FORM_TEACHER,
    assignedClass: 'Primary 5A',
    assignedSubjects: [],
    department: 'Primary',
    qualification: 'B.Ed Primary Education',
    experience: '15 years',
    status: 'active',
    dateJoined: '2009-09-01'
  }
];

// Teacher assignment service
export class TeacherAssignmentService {
  static getTeachersByRole(role) {
    return MOCK_TEACHERS.filter(teacher => teacher.role === role);
  }

  static getTeachersBySubject(subject) {
    return MOCK_TEACHERS.filter(teacher => 
      teacher.assignedSubjects.includes(subject)
    );
  }

  static getTeachersByClass(className) {
    return MOCK_TEACHERS.filter(teacher => 
      teacher.assignedClass === className
    );
  }

  static getTeacherById(id) {
    return MOCK_TEACHERS.find(teacher => teacher.id === id);
  }

  static getTeacherByStaffId(staffId) {
    return MOCK_TEACHERS.find(teacher => teacher.staffId === staffId);
  }

  static assignTeacherToClass(teacherId, className) {
    const teacher = this.getTeacherById(teacherId);
    if (teacher) {
      teacher.assignedClass = className;
      return true;
    }
    return false;
  }

  static assignSubjectToTeacher(teacherId, subject) {
    const teacher = this.getTeacherById(teacherId);
    if (teacher && !teacher.assignedSubjects.includes(subject)) {
      teacher.assignedSubjects.push(subject);
      return true;
    }
    return false;
  }

  static removeSubjectFromTeacher(teacherId, subject) {
    const teacher = this.getTeacherById(teacherId);
    if (teacher) {
      const index = teacher.assignedSubjects.indexOf(subject);
      if (index > -1) {
        teacher.assignedSubjects.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  static updateTeacherRole(teacherId, newRole) {
    const teacher = this.getTeacherById(teacherId);
    if (teacher) {
      teacher.role = newRole;
      // Clear assignments that don't match the new role
      if (newRole === TEACHER_ROLES.FORM_TEACHER) {
        teacher.assignedSubjects = [];
      } else if (newRole === TEACHER_ROLES.SUBJECT_TEACHER) {
        teacher.assignedClass = null;
      }
      // Dual role keeps both assignments
      return true;
    }
    return false;
  }

  static getTeacherPermissions(teacherId) {
    const teacher = this.getTeacherById(teacherId);
    if (teacher) {
      return TEACHER_ROLE_DESCRIPTIONS[teacher.role].permissions;
    }
    return [];
  }

  static canTeacherAccessClass(teacherId, className) {
    const teacher = this.getTeacherById(teacherId);
    if (!teacher) return false;
    
    return teacher.role === TEACHER_ROLES.FORM_TEACHER || 
           teacher.role === TEACHER_ROLES.DUAL_ROLE ? 
           teacher.assignedClass === className : false;
  }

  static canTeacherAccessSubject(teacherId, subject) {
    const teacher = this.getTeacherById(teacherId);
    if (!teacher) return false;
    
    return teacher.role === TEACHER_ROLES.SUBJECT_TEACHER || 
           teacher.role === TEACHER_ROLES.DUAL_ROLE ? 
           teacher.assignedSubjects.includes(subject) : false;
  }

  static getStudentsForTeacher(teacherId, allStudents) {
    const teacher = this.getTeacherById(teacherId);
    if (!teacher) return [];
    
    let students = [];
    
    if (teacher.role === TEACHER_ROLES.FORM_TEACHER || teacher.role === TEACHER_ROLES.DUAL_ROLE) {
      // Get students in assigned class
      students = allStudents.filter(student => student.class === teacher.assignedClass);
    }
    
    if (teacher.role === TEACHER_ROLES.SUBJECT_TEACHER || teacher.role === TEACHER_ROLES.DUAL_ROLE) {
      // Get students taking assigned subjects
      const subjectStudents = allStudents.filter(student => 
        student.assignedSubjects.some(subject => teacher.assignedSubjects.includes(subject))
      );
      
      // Remove duplicates for dual role
      const uniqueStudents = subjectStudents.filter(student => 
        !students.some(s => s.id === student.id)
      );
      students = [...students, ...uniqueStudents];
    }
    
    return students;
  }
}

// Class and subject combinations
export const CLASS_SUBJECT_ASSIGNMENTS = {
  'Pre-Nursery 1': ['Early Childhood Education', 'Numeracy', 'Literacy', 'Creative Arts', 'Physical Development'],
  'Pre-Nursery 2': ['Early Childhood Education', 'Numeracy', 'Literacy', 'Creative Arts', 'Physical Development'],
  'Nursery 1': ['Early Childhood Education', 'Numeracy', 'Literacy', 'Creative Arts', 'Physical Development', 'Social Studies'],
  'Nursery 2': ['Early Childhood Education', 'Numeracy', 'Literacy', 'Creative Arts', 'Physical Development', 'Social Studies'],
  'Nursery 3': ['Early Childhood Education', 'Numeracy', 'Literacy', 'Creative Arts', 'Physical Development', 'Social Studies'],
  'Primary 1': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Creative Arts', 'Physical Education', 'Religious Studies'],
  'Primary 2': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Creative Arts', 'Physical Education', 'Religious Studies'],
  'Primary 3': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Creative Arts', 'Physical Education', 'Religious Studies'],
  'Primary 4': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Creative Arts', 'Physical Education', 'Religious Studies', 'Home Economics'],
  'Primary 5': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Creative Arts', 'Physical Education', 'Religious Studies', 'Home Economics', 'Agricultural Science'],
  'Primary 6': ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Creative Arts', 'Physical Education', 'Religious Studies', 'Home Economics', 'Agricultural Science', 'Computer Studies'],
  'JSS 1': ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
  'JSS 2': ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
  'JSS 3': ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
  'SSS 1': ['English Language', 'Mathematics', 'Biology', 'Civic Education'],
  'SSS 2': ['English Language', 'Mathematics', 'Biology', 'Civic Education'],
  'SSS 3': ['English Language', 'Mathematics', 'Biology', 'Civic Education']
};

// SSS Stream subjects
export const SSS_STREAM_SUBJECTS = {
  Science: ['Physics', 'Chemistry'],
  Art: ['Government', 'Literature in English'],
  Commercial: ['Account', 'Commerce'],
  General: ['Economics', 'Religious Studies', 'ICT', 'Marketing', 'Geography', 'Agricultural Science']
};
