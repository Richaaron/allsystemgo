// FOLUSHO VICTORY SCHOOLS - Database Schema
// Comprehensive Nigerian School Management System using Drizzle ORM

import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  integer, 
  decimal, 
  date, 
  timestamp, 
  boolean, 
  jsonb,
  index,
  unique,
  primaryKey
} from 'drizzle-orm/pg-core';

// Nigerian States and LGAs
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
  'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'FCT - Abuja'
] as const;

// School Information Table
export const schools = pgTable('schools', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  motto: varchar('motto', { length: 255 }),
  vision: text('vision'),
  mission: text('mission'),
  addressStreet: varchar('address_street', { length: 255 }).notNull(),
  addressCity: varchar('address_city', { length: 100 }).notNull(),
  addressState: varchar('address_state', { length: 50 }).notNull(),
  addressLga: varchar('address_lga', { length: 50 }),
  addressPostalCode: varchar('address_postal_code', { length: 20 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  website: varchar('website', { length: 255 }),
  establishmentDate: date('establishment_date'),
  founder: varchar('founder', { length: 255 }),
  firstPrincipal: varchar('first_principal', { length: 255 }),
  approvalNumber: varchar('approval_number', { length: 100 }),
  ministry: varchar('ministry', { length: 255 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Academic Years Table
export const academicYears = pgTable('academic_years', {
  id: serial('id').primaryKey(),
  year: varchar('year', { length: 20 }).notNull().unique(), // e.g., "2024/2025"
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// School Terms Table
export const schoolTerms = pgTable('school_terms', {
  id: serial('id').primaryKey(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  term: varchar('term', { length: 20 }).notNull(), // "TERM_1", "TERM_2", "TERM_3"
  name: varchar('name', { length: 50 }).notNull(), // "First Term", "Second Term", "Third Term"
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  resumptionDate: date('resumption_date'),
  vacationDate: date('vacation_date'),
  examStartDate: date('exam_start_date'),
  examEndDate: date('exam_end_date'),
  resultReleaseDate: date('result_release_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Departments Table
export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  description: text('description'),
  headOfDepartmentId: integer('head_of_department_id').references(() => teachers.id),
  establishedDate: date('established_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Subjects Table
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  departmentId: integer('department_id').references(() => departments.id),
  code: varchar('code', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // "core", "elective", "vocational", "early_childhood"
  description: text('description'),
  credits: integer('credits').default(1),
  passMark: integer('pass_mark').default(40),
  isCore: boolean('is_core').default(false),
  isOfferedInPreNursery: boolean('is_offered_in_pre_nursery').default(false),
  isOfferedInNursery: boolean('is_offered_in_nursery').default(false),
  isOfferedInPrimary: boolean('is_offered_in_primary').default(false),
  isOfferedInJSS: boolean('is_offered_in_jss').default(false),
  isOfferedInSSS: boolean('is_offered_in_sss').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Classes Table
export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  name: varchar('name', { length: 50 }).notNull(), // "Pre-Nursery 1A", "Nursery 2B", "JSS 1A", etc.
  level: varchar('level', { length: 20 }).notNull(), // "Pre-Nursery", "Nursery", "Primary", "JSS", "SSS"
  arm: varchar('arm', { length: 5 }).notNull(), // "A", "B", "C", "D"
  classTeacherId: integer('class_teacher_id').references(() => teachers.id),
  capacity: integer('capacity').default(30), // Smaller capacity for early childhood
  currentEnrollment: integer('current_enrollment').default(0),
  room: varchar('room', { length: 50 }),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  termId: integer('term_id').references(() => schoolTerms.id).notNull(),
  minAge: integer('min_age'), // Minimum age for class
  maxAge: integer('max_age'), // Maximum age for class
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Teachers Table
export const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  staffId: varchar('staff_id', { length: 20 }).notNull().unique(),
  title: varchar('title', { length: 10 }), // "Mr", "Mrs", "Miss", "Dr", "Prof"
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  gender: varchar('gender', { length: 10 }).notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  address: text('address'),
  qualification: varchar('qualification', { length: 255 }),
  specialization: jsonb('specialization').$type<string[]>(),
  subjectsTeaching: jsonb('subjects_teaching').$type<number[]>(),
  classesAssigned: jsonb('classes_assigned').$type<number[]>(),
  departmentId: integer('department_id').references(() => departments.id),
  position: varchar('position', { length: 100 }), // "Class Teacher", "Subject Teacher", "HOD", etc.
  employmentDate: date('employment_date').notNull(),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  bankAccountName: varchar('bank_account_name', { length: 255 }),
  bankAccountNumber: varchar('bank_account_number', { length: 50 }),
  bankName: varchar('bank_name', { length: 255 }),
  nextOfKinName: varchar('next_of_kin_name', { length: 255 }),
  nextOfKinRelationship: varchar('next_of_kin_relationship', { length: 50 }),
  nextOfKinPhone: varchar('next_of_kin_phone', { length: 50 }),
  nextOfKinAddress: text('next_of_kin_address'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Students Table
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  admissionNumber: varchar('admission_number', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  dateOfBirth: date('date_of_birth').notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  nationality: varchar('nationality', { length: 100 }).default('Nigerian'),
  stateOfOrigin: varchar('state_of_origin', { length: 50 }).notNull(),
  lga: varchar('lga', { length: 50 }),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  parentGuardianName: varchar('parent_guardian_name', { length: 255 }).notNull(),
  parentGuardianRelationship: varchar('parent_guardian_relationship', { length: 50 }).notNull(),
  parentGuardianPhone: varchar('parent_guardian_phone', { length: 50 }).notNull(),
  parentGuardianEmail: varchar('parent_guardian_email', { length: 255 }),
  parentGuardianOccupation: varchar('parent_guardian_occupation', { length: 255 }),
  classId: integer('class_id').references(() => classes.id),
  house: varchar('house', { length: 50 }),
  admissionDate: date('admission_date').notNull(),
  status: varchar('status', { length: 20 }).default('active'), // "active", "graduated", "transferred", "suspended"
  bloodGroup: varchar('blood_group', { length: 10 }),
  genotype: varchar('genotype', { length: 10 }),
  allergies: jsonb('allergies').$type<string[]>(),
  medicalConditions: jsonb('medical_conditions').$type<string[]>(),
  previousSchoolName: varchar('previous_school_name', { length: 255 }),
  previousClass: varchar('previous_class', { length: 50 }),
  lastResultAverage: decimal('last_result_average', { precision: 5, scale: 2 }),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Results Table
export const results = pgTable('results', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  classId: integer('class_id').references(() => classes.id).notNull(),
  termId: integer('term_id').references(() => schoolTerms.id).notNull(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  subjects: jsonb('subjects').notNull().$type<Array<{
    subjectId: number;
    subjectName: string;
    firstCA: number;
    secondCA: number;
    exam: number;
    total: number;
    grade: string;
    points: number;
    remark: string;
    position: number;
    classAverage: number;
  }>>(),
  summary: jsonb('summary').notNull().$type<{
    totalSubjects: number;
    totalPoints: number;
    averagePoints: number;
    gpa: number;
    classPosition: number;
    totalInClass: number;
    attendance: {
      daysPresent: number;
      daysAbsent: number;
      percentage: number;
    };
    conduct: {
      grade: string;
      remark: string;
    };
  }>(),
  comments: jsonb('comments').$type<{
    classTeacherComment: string;
    principalComment: string;
    houseMasterComment: string;
  }>(),
  approvedBy: jsonb('approved_by').$type<{
    classTeacher: string;
    principal: string;
    dateApproved: string;
  }>(),
  status: varchar('status', { length: 20 }).default('draft'), // "draft", "submitted", "approved", "printed"
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Attendance Table
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  classId: integer('class_id').references(() => classes.id).notNull(),
  date: date('date').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // "present", "absent", "late", "excused"
  timeIn: timestamp('time_in'),
  timeOut: timestamp('time_out'),
  reasonForAbsence: text('reason_for_absence'),
  markedBy: varchar('marked_by', { length: 255 }).notNull(),
  termId: integer('term_id').references(() => schoolTerms.id).notNull(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Fee Structure Table
export const feeStructures = pgTable('fee_structures', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  classId: integer('class_id').references(() => classes.id),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  termId: integer('term_id').references(() => schoolTerms.id).notNull(),
  tuition: decimal('tuition', { precision: 10, scale: 2 }).notNull(),
  development: decimal('development', { precision: 10, scale: 2 }).default(0),
  sports: decimal('sports', { precision: 10, scale: 2 }).default(0),
  laboratory: decimal('laboratory', { precision: 10, scale: 2 }).default(0),
  library: decimal('library', { precision: 10, scale: 2 }).default(0),
  ict: decimal('ict', { precision: 10, scale: 2 }).default(0),
  excursion: decimal('excursion', { precision: 10, scale: 2 }).default(0),
  pta: decimal('pta', { precision: 10, scale: 2 }).default(0),
  other: decimal('other', { precision: 10, scale: 2 }).default(0),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: date('due_date').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Student Fees Table
export const studentFees = pgTable('student_fees', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  feeStructureId: integer('fee_structure_id').references(() => feeStructures.id).notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).default(0),
  balance: decimal('balance', { precision: 10, scale: 2 }).notNull(),
  dueDate: date('due_date').notNull(),
  status: varchar('status', { length: 20 }).default('pending'), // "pending", "partial", "paid", "overdue"
  lastReminderDate: date('last_reminder_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Fee Payments Table
export const feePayments = pgTable('fee_payments', {
  id: serial('id').primaryKey(),
  studentFeeId: integer('student_fee_id').references(() => studentFees.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  method: varchar('method', { length: 50 }).notNull(), // "cash", "transfer", "cheque"
  bankReference: varchar('bank_reference', { length: 255 }),
  receivedBy: varchar('received_by', { length: 255 }).notNull(),
  receiptNumber: varchar('receipt_number', { length: 100 }).notNull(),
  paymentDate: date('payment_date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Users Table (for authentication)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // "admin", "teacher", "parent", "student"
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// User Profiles Table
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  profileType: varchar('profile_type', { length: 50 }).notNull(), // "teacher", "student", "parent"
  profileId: integer('profile_id').notNull(), // References teacher.id, student.id, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Academic Calendar Events Table
export const calendarEvents = pgTable('calendar_events', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id).notNull(),
  termId: integer('term_id').references(() => schoolTerms.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  type: varchar('type', { length: 50 }).notNull(), // "academic", "sports", "cultural", "examination", "holiday"
  isForAllClasses: boolean('is_for_all_classes').default(true),
  affectedClasses: jsonb('affected_classes').$type<number[]>(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Assignments Table
export const assignments = pgTable('assignments', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').references(() => teachers.id).notNull(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  classId: integer('class_id').references(() => classes.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  dueDate: date('due_date').notNull(),
  totalPoints: integer('total_points').default(100),
  submissionType: varchar('submission_type', { length: 50 }).default('physical'), // "physical", "online", "both"
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Student Submissions Table
export const studentSubmissions = pgTable('student_submissions', {
  id: serial('id').primaryKey(),
  assignmentId: integer('assignment_id').references(() => assignments.id).notNull(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  score: decimal('score', { precision: 5, scale: 2 }),
  maxScore: decimal('max_score', { precision: 5, scale: 2 }),
  remarks: text('remarks'),
  submissionDate: date('submission_date'),
  status: varchar('status', { length: 50 }).default('pending'), // "pending", "submitted", "graded", "returned"
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Notifications Table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // "info", "warning", "success", "error"
  recipientType: varchar('recipient_type', { length: 50 }).notNull(), // "all", "admin", "teacher", "parent", "student"
  recipientIds: jsonb('recipient_ids').$type<number[]>(),
  isRead: boolean('is_read').default(false),
  scheduledFor: timestamp('scheduled_for'),
  sentAt: timestamp('sent_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// System Settings Table
export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  schoolId: integer('school_id').references(() => schools.id).notNull(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Create indexes for performance
export const schoolsIndex = index('schools_email_idx').on(schools.email);
export const studentsIndex = index('students_admission_number_idx').on(students.admissionNumber);
export const studentsIndex2 = index('students_class_id_idx').on(students.classId);
export const teachersIndex = index('teachers_staff_id_idx').on(teachers.staffId);
export const teachersIndex2 = index('teachers_email_idx').on(teachers.email);
export const resultsIndex = index('results_student_term_idx').on(results.studentId, results.termId);
export const attendanceIndex = index('attendance_student_date_idx').on(attendance.studentId, attendance.date);
export const studentFeesIndex = index('student_fees_student_status_idx').on(studentFees.studentId, studentFees.status);
export const notificationsIndex = index('notifications_recipient_type_idx').on(notifications.recipientType, notifications.isRead);
