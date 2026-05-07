// Nigerian School Management System - Data Models
// Comprehensive data structures for FOLUSHO VICTORY SCHOOLS

// Nigerian Grading Scale
export const NIGERIAN_GRADING_SCALE = {
  A: { score: 70, points: 5.0, grade: 'Excellent', remark: 'Excellent Performance' },
  B: { score: 60, points: 4.0, grade: 'Very Good', remark: 'Very Good Performance' },
  C: { score: 50, points: 3.0, grade: 'Good', remark: 'Good Performance' },
  D: { score: 45, points: 2.0, grade: 'Credit', remark: 'Credit Performance' },
  E: { score: 40, points: 1.0, grade: 'Pass', remark: 'Pass Performance' },
  F: { score: 0, points: 0.0, grade: 'Fail', remark: 'Fail - Needs Improvement' }
};

// Nigerian School Terms
export const SCHOOL_TERMS = {
  TERM_1: { name: 'First Term', start: 'September', end: 'December', duration: 3 },
  TERM_2: { name: 'Second Term', start: 'January', end: 'April', duration: 4 },
  TERM_3: { name: 'Third Term', start: 'May', end: 'July', duration: 3 }
};

// Nigerian Class Levels and Sections
export const CLASS_LEVELS = {
  PRE_NURSERY: ['Pre-Nursery 1', 'Pre-Nursery 2'],
  NURSERY: ['Nursery 1', 'Nursery 2', 'Nursery 3'],
  PRIMARY: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
  JUNIOR_SECONDARY: ['JSS 1', 'JSS 2', 'JSS 3'],
  SENIOR_SECONDARY: ['SSS 1', 'SSS 2', 'SSS 3']
};

export const CLASS_SECTIONS = ['A', 'B', 'C', 'D'];

export const getAllClasses = () => [
  ...CLASS_LEVELS.PRE_NURSERY,
  ...CLASS_LEVELS.NURSERY,
  ...CLASS_LEVELS.PRIMARY,
  ...CLASS_LEVELS.JUNIOR_SECONDARY,
  ...CLASS_LEVELS.SENIOR_SECONDARY
];

export const getEarlyChildhoodClasses = () => [
  ...CLASS_LEVELS.PRE_NURSERY,
  ...CLASS_LEVELS.NURSERY
];

export const getBasicEducationClasses = () => [
  ...CLASS_LEVELS.PRIMARY,
  ...CLASS_LEVELS.JUNIOR_SECONDARY
];

export const getSecondaryClasses = () => [
  ...CLASS_LEVELS.SENIOR_SECONDARY
];

// Common Nigerian Subjects
export const NIGERIAN_SUBJECTS = {
  EARLY_CHILDHOOD: [
    'Number Work', 'Letter Work', 'Rhymes and Songs', 
    'Story Telling', 'Creative Play', 'Physical Development',
    'Social Development', 'Health Habits', 'Sensorial Activities',
    'Practical Life', 'Cultural Activities', 'Art and Craft'
  ],
  CORE_SUBJECTS: [
    'English Language', 'Mathematics', 
    'Biology', 'Chemistry', 'Physics',
    'Civic Education', 'One Nigerian Language'
  ],
  JSS_SUBJECTS: [
    'Mathematics', 'English Language', 'National Values', 'Business Studies',
    'Home Economics', 'Physical & Health Education', 'Agricultural Science',
    'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies',
    'Computer Studies', 'Hausa'
  ],
  SSS_SUBJECTS: {
  SCIENCE: ['Physics', 'Chemistry'],
  ART: ['Government', 'Literature in English'],
  COMMERCIAL: ['Account', 'Commerce'],
  GENERAL: ['Economics', 'Religious Studies', 'ICT', 'Civic Education', 'Marketing', 'Geography', 'Agricultural Science', 'Biology']
  },
  ELECTIVE_SUBJECTS: [
    'Further Mathematics', 'Technical Drawing', 'Agricultural Science',
    'Geography', 'Economics', 'Government', 'History',
    'Literature in English', 'Christian Religious Studies',
    'Islamic Religious Studies', 'French', 'Computer Studies',
    'Physical and Health Education', 'Visual Art', 'Music'
  ],
  PRIMARY_SUBJECTS: [
    'English Language', 'Mathematics', 'Basic Science',
    'Social Studies', 'Civic Education', 'Computer Studies',
    'Physical and Health Education', 'Creative Arts',
    'Nigerian Language', 'Religious Education', 'Agriculture',
    'Home Economics'
  ]
};

// Student Model
export const StudentModel = {
  id: '',
  admissionNumber: '',
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: '',
  gender: '',
  nationality: 'Nigerian',
  stateOfOrigin: '',
  lga: '',
  address: '',
  phone: '',
  email: '',
  parentGuardian: {
    name: '',
    relationship: '',
    phone: '',
    email: '',
    occupation: ''
  },
  class: '',
  house: '',
  admissionDate: '',
  status: 'active', // active, graduated, transferred, suspended
  medicalInfo: {
    bloodGroup: '',
    genotype: '',
    allergies: [],
    medicalConditions: []
  },
  previousSchool: {
    name: '',
    classLeft: '',
    lastResultAverage: ''
  }
};

// Teacher Model
export const TeacherModel = {
  id: '',
  staffId: '',
  title: '', // Mr, Mrs, Miss, Dr, Prof
  firstName: '',
  lastName: '',
  middleName: '',
  gender: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  address: '',
  qualification: '',
  specialization: [],
  subjectsTeaching: [],
  classesAssigned: [],
  department: '',
  position: '', // Class Teacher, Subject Teacher, HOD, Principal, Vice Principal
  employmentDate: '',
  salary: 0,
  bankDetails: {
    bankName: '',
    accountNumber: '',
    accountName: ''
  },
  nextOfKin: {
    name: '',
    relationship: '',
    phone: '',
    address: ''
  }
};

// Subject Model
export const SubjectModel = {
  id: '',
  code: '',
  name: '',
  category: '', // core, elective, vocational
  description: '',
  credits: 0,
  passMark: 40,
  department: '',
  teachersAssigned: [],
  classesOffered: []
};

// Class/Form Model
export const ClassModel = {
  id: '',
  name: '', // e.g., "JSS 1A", "Primary 2B"
  level: '', // Primary, JSS, SSS
  arm: '', // A, B, C, D
  classTeacher: '',
  students: [],
  subjects: [],
  capacity: 40,
  currentEnrollment: 0,
  room: '',
  academicYear: '',
  term: ''
};

// Result Model
export const ResultModel = {
  id: '',
  studentId: '',
  studentName: '',
  class: '',
  term: '',
  academicYear: '',
  subjects: [
    {
      subjectId: '',
      subjectName: '',
      firstCA: 0,  // Continuous Assessment 1 (10 marks)
      secondCA: 0, // Continuous Assessment 2 (10 marks)
      exam: 0,    // Examination (70 marks)
      total: 0,   // Total (100 marks)
      grade: '',  // A, B, C, D, E, F
      points: 0.0, // 5.0, 4.0, 3.0, 2.0, 1.0, 0.0
      remark: '',
      position: 0,
      classAverage: 0
    }
  ],
  summary: {
    totalSubjects: 0,
    totalPoints: 0,
    averagePoints: 0,
    gpa: 0,
    classPosition: 0,
    totalInClass: 0,
    attendance: {
      daysPresent: 0,
      daysAbsent: 0,
      percentage: 0
    },
    conduct: {
      grade: '',
      remark: ''
    }
  },
  comments: {
    classTeacherComment: '',
    principalComment: '',
    houseMasterComment: ''
  },
  approvedBy: {
    classTeacher: '',
    principal: '',
    dateApproved: ''
  },
  status: 'draft' // draft, submitted, approved, printed
};

// Attendance Model
export const AttendanceModel = {
  id: '',
  studentId: '',
  class: '',
  date: '',
  status: '', // present, absent, late, excused
  timeIn: '',
  timeOut: '',
  reasonForAbsence: '',
  markedBy: '',
  term: '',
  academicYear: ''
};

// Fee/Payment Model
export const FeeModel = {
  id: '',
  studentId: '',
  studentName: '',
  class: '',
  term: '',
  academicYear: '',
  feeStructure: {
    tuition: 0,
    development: 0,
    sports: 0,
    laboratory: 0,
    library: 0,
    ict: 0,
    excursion: 0,
    pta: 0,
    other: 0
  },
  totalAmount: 0,
  amountPaid: 0,
  balance: 0,
  dueDate: '',
  payments: [
    {
      id: '',
      date: '',
      amount: 0,
      method: '', // cash, transfer, cheque
      bankReference: '',
      receivedBy: '',
      receiptNumber: ''
    }
  ],
  status: 'pending', // pending, partial, paid, overdue
  lastReminderDate: ''
};

// Academic Calendar Model
export const AcademicCalendarModel = {
  id: '',
  academicYear: '',
  terms: [
    {
      term: '',
      startDate: '',
      endDate: '',
      resumptionDate: '',
      vacationDate: '',
      examStartDate: '',
      examEndDate: '',
      resultReleaseDate: '',
      holidays: [
        {
          name: '',
          startDate: '',
          endDate: '',
          type: '' // public, school, mid-term
        }
      ]
    }
  ],
  events: [
    {
      name: '',
      date: '',
      type: '', // academic, sports, cultural, examination
      description: ''
    }
  ]
};

// Department Model
export const DepartmentModel = {
  id: '',
  name: '',
  code: '',
  headOfDepartment: '',
  teachers: [],
  subjects: [],
  description: '',
  establishedDate: ''
};

// School Information Model
export const SchoolModel = {
  id: '',
  name: '',
  motto: '',
  vision: '',
  mission: '',
  address: {
    street: '',
    city: '',
    state: '',
    lga: '',
    postalCode: '',
    phone: '',
    email: '',
    website: ''
  },
  establishment: {
    date: '',
    founder: '',
    firstPrincipal: '',
    approvalNumber: '',
    ministry: ''
  },
  administration: {
    proprietor: '',
    proprietorTitle: '',
    principal: '',
    vicePrincipal: '',
    registrar: '',
    bursar: '',
    librarian: '',
    counselor: ''
  },
  facilities: {
    classrooms: 0,
    laboratories: 0,
    libraries: 0,
    computerLabs: 0,
    sportsFacilities: [],
    otherFacilities: []
  },
  statistics: {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    averageClassSize: 0,
    studentTeacherRatio: 0
  },
  accreditation: {
    ministryApproval: '',
    examinationBodies: [], // WAEC, NECO, etc.
    lastInspection: '',
    nextInspection: ''
  }
};

// Utility Functions
export const calculateGrade = (score) => {
  for (const [grade, config] of Object.entries(NIGERIAN_GRADING_SCALE)) {
    if (score >= config.score) {
      return {
        grade,
        points: config.points,
        gradeName: config.grade,
        remark: config.remark
      };
    }
  }
  return {
    grade: 'F',
    points: 0.0,
    gradeName: 'Fail',
    remark: 'Fail - Needs Improvement'
  };
};

export const calculateGPA = (subjects) => {
  if (!subjects || subjects.length === 0) return 0;
  
  const totalPoints = subjects.reduce((sum, subject) => {
    return sum + (subject.points || 0);
  }, 0);
  
  return (totalPoints / subjects.length).toFixed(2);
};

export const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount);
};

export const generateAdmissionNumber = (year, sequence) => {
  return `FVS/${year}/${String(sequence).padStart(4, '0')}`;
};

export const getCurrentAcademicYear = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return `${currentYear}/${nextYear}`;
};

export const getCurrentTerm = () => {
  const month = new Date().getMonth();
  if (month >= 8 && month <= 11) return 'TERM_1';
  if (month >= 0 && month <= 3) return 'TERM_2';
  return 'TERM_3';
};

export default {
  NIGERIAN_GRADING_SCALE,
  SCHOOL_TERMS,
  CLASS_LEVELS,
  NIGERIAN_SUBJECTS,
  StudentModel,
  TeacherModel,
  SubjectModel,
  ClassModel,
  ResultModel,
  AttendanceModel,
  FeeModel,
  AcademicCalendarModel,
  DepartmentModel,
  SchoolModel,
  calculateGrade,
  calculateGPA,
  formatNaira,
  generateAdmissionNumber,
  getCurrentAcademicYear,
  getCurrentTerm
};
