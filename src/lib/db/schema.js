// FOLUSHO VICTORY SCHOOLS - Database Schema (JavaScript version)
// For use with Node.js backend server

const { pgTable, serial, varchar, text, integer, decimal, date, timestamp, boolean, jsonb, index, unique, primaryKey } = require('drizzle-orm/pg-core');

// Schools Table
const schools = pgTable('schools', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  address_street: varchar('address_street', { length: 255 }).notNull(),
  address_city: varchar('address_city', { length: 100 }).notNull(),
  address_state: varchar('address_state', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow()
});

// Academic Years Table
const academicYears = pgTable('academic_years', {
  id: serial('id').primaryKey(),
  year: varchar('year', { length: 20 }).notNull().unique(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow()
});

// School Terms Table
const schoolTerms = pgTable('school_terms', {
  id: serial('id').primaryKey(),
  academic_year_id: integer('academic_year_id').references(() => academicYears.id).notNull(),
  term: varchar('term', { length: 20 }).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow()
});

// Departments Table
const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  school_id: integer('school_id').references(() => schools.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  description: text('description'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow()
});

// Subjects Table
const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  school_id: integer('school_id').references(() => schools.id).notNull(),
  department_id: integer('department_id').references(() => departments.id),
  code: varchar('code', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  description: text('description'),
  credits: integer('credits').default(1),
  pass_mark: integer('pass_mark').default(40),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow()
});

// Classes Table
const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  school_id: integer('school_id').references(() => schools.id).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  level: varchar('level', { length: 20 }).notNull(),
  arm: varchar('arm', { length: 5 }).notNull(),
  capacity: integer('capacity').default(30),
  current_enrollment: integer('current_enrollment').default(0),
  room: varchar('room', { length: 50 }),
  academic_year_id: integer('academic_year_id').references(() => academicYears.id).notNull(),
  term_id: integer('term_id').references(() => schoolTerms.id).notNull(),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow()
});

// Teachers Table
const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  school_id: integer('school_id').references(() => schools.id).notNull(),
  staff_id: varchar('staff_id', { length: 20 }).notNull().unique(),
  title: varchar('title', { length: 10 }),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  date_of_birth: date('date_of_birth').notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  address: text('address'),
  qualification: varchar('qualification', { length: 255 }),
  specialization: jsonb('specialization'),
  subjects_teaching: jsonb('subjects_teaching'),
  classes_assigned: jsonb('classes_assigned'),
  department_id: integer('department_id').references(() => departments.id),
  position: varchar('position', { length: 100 }),
  employment_date: date('employment_date').notNull(),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow()
});

// Students Table
const students = pgTable('students', {
  id: serial('id').primaryKey(),
  school_id: integer('school_id').references(() => schools.id).notNull(),
  admission_number: varchar('admission_number', { length: 50 }).notNull().unique(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  date_of_birth: date('date_of_birth').notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  state_of_origin: varchar('state_of_origin', { length: 50 }).notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  parent_guardian_name: varchar('parent_guardian_name', { length: 255 }).notNull(),
  parent_guardian_relationship: varchar('parent_guardian_relationship', { length: 50 }).notNull(),
  parent_guardian_phone: varchar('parent_guardian_phone', { length: 50 }).notNull(),
  class_id: integer('class_id').references(() => classes.id),
  admission_date: date('admission_date').notNull(),
  status: varchar('status', { length: 20 }).default('active'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow()
});

// Results Table
const results = pgTable('results', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').references(() => students.id).notNull(),
  class_id: integer('class_id').references(() => classes.id).notNull(),
  term_id: integer('term_id').references(() => schoolTerms.id).notNull(),
  academic_year_id: integer('academic_year_id').references(() => academicYears.id).notNull(),
  subjects: jsonb('subjects').notNull(),
  summary: jsonb('summary').notNull(),
  comments: jsonb('comments'),
  status: varchar('status', { length: 20 }).default('draft'),
  created_at: timestamp('created_at').defaultNow()
});

// Users Table for authentication
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  school_id: integer('school_id').references(() => schools.id).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  is_active: boolean('is_active').default(true),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at').defaultNow()
});

module.exports = {
  schools,
  academicYears,
  schoolTerms,
  departments,
  subjects,
  classes,
  teachers,
  students,
  results,
  users
};
