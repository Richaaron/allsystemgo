import { NIGERIAN_SUBJECTS, StudentModel, ClassModel, SubjectModel, FeeModel, AttendanceModel } from '../data/models';

// Mock database for development
const mockDatabase = {
  students: [],
  teachers: [],
  classes: [],
  subjects: [],
  results: [],
  fees: [],
  attendance: []
};

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate admission numbers
const generateAdmissionNumber = (year, sequence) => {
  return `FVS/${year}/${String(sequence).padStart(4, '0')}`;
};

// Helper function to get current academic year
const getCurrentAcademicYear = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return `${currentYear}/${nextYear}`;
};

// Helper function to get current term
const getCurrentTerm = () => {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 3) return 'First Term';
  if (month >= 4 && month <= 7) return 'Second Term';
  return 'Third Term';
};

// Initialize mock data
const initializeMockData = () => {
  // Initialize Subjects
  const allSubjects = [
    ...NIGERIAN_SUBJECTS.CORE_SUBJECTS,
    ...NIGERIAN_SUBJECTS.ELECTIVE_SUBJECTS
  ];

  mockDatabase.subjects = allSubjects.map((subject, index) => ({
    ...SubjectModel,
    id: `subj-${String(index + 1).padStart(3, '0')}`,
    code: subject.substring(0, 3).toUpperCase(),
    name: subject,
    category: NIGERIAN_SUBJECTS.CORE_SUBJECTS.includes(subject) ? 'core' : 'elective',
    credits: 1,
    passMark: 40
  }));

  // Initialize Classes
  const CLASS_LEVELS = {
    PRE_NURSERY: ['Pre-Nursery 1', 'Pre-Nursery 2'],
    NURSERY: ['Nursery 1', 'Nursery 2', 'Nursery 3'],
    PRIMARY: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
    JUNIOR_SECONDARY: ['JSS 1', 'JSS 2', 'JSS 3'],
    SENIOR_SECONDARY: ['SSS 1', 'SSS 2', 'SSS 3']
  };

  const getAllClasses = () => [
    ...CLASS_LEVELS.PRE_NURSERY,
    ...CLASS_LEVELS.NURSERY,
    ...CLASS_LEVELS.PRIMARY,
    ...CLASS_LEVELS.JUNIOR_SECONDARY,
    ...CLASS_LEVELS.SENIOR_SECONDARY
  ];

  const allClasses = getAllClasses();
  mockDatabase.classes = allClasses.map((className, index) => ({
    ...ClassModel,
    id: `class-${String(index + 1).padStart(3, '0')}`,
    name: className,
    level: className.includes('Pre-Nursery') ? 'Pre-Nursery' : className.includes('Nursery') ? 'Nursery' : className.includes('Primary') ? 'Primary' : className.includes('JSS') ? 'JSS' : 'SSS',
    arm: className.match(/[A-Z]$/)?.[0] || 'A',
    capacity: 40,
    currentEnrollment: Math.floor(Math.random() * 15) + 25,
    room: `Room ${index + 1}`,
    academicYear: getCurrentAcademicYear(),
    term: getCurrentTerm(),
    subjects: mockDatabase.subjects.filter(s => 
      className.includes('Primary') ? 
        NIGERIAN_SUBJECTS.PRIMARY_SUBJECTS.includes(s.name) : 
        NIGERIAN_SUBJECTS.CORE_SUBJECTS.includes(s.name)
    ).map(s => s.id)
  }));

  // Initialize Students
  const studentNames = [
    { firstName: 'Ahmed', lastName: 'Bello', gender: 'Male' },
    { firstName: 'Chinyere', lastName: 'Okonkwo', gender: 'Female' },
    { firstName: 'Tunde', lastName: 'Johnson', gender: 'Male' },
    { firstName: 'Funke', lastName: 'Adebayo', gender: 'Female' },
    { firstName: 'Muhammad', lastName: 'Ibrahim', gender: 'Male' },
    { firstName: 'Grace', lastName: 'Okafor', gender: 'Female' },
    { firstName: 'David', lastName: 'Chukwu', gender: 'Male' },
    { firstName: 'Amina', lastName: 'Yusuf', gender: 'Female' },
    { firstName: 'Samuel', lastName: 'Ojo', gender: 'Male' },
    { firstName: 'Peace', lastName: 'Eze', gender: 'Female' }
  ];

  mockDatabase.students = studentNames.map((student, index) => ({
    ...StudentModel,
    id: `student-${String(index + 1).padStart(4, '0')}`,
    admissionNumber: generateAdmissionNumber(new Date().getFullYear(), index + 1),
    firstName: student.firstName,
    lastName: student.lastName,
    gender: student.gender,
    dateOfBirth: '2008-05-15',
    stateOfOrigin: ['Lagos', 'Ogun', 'Oyo', 'Kano', 'Abuja', 'Rivers'][index % 6],
    class: allClasses[index % allClasses.length],
    admissionDate: '2020-09-15',
    parentGuardian: {
      name: `Mr./Mrs. ${student.lastName}`,
      phone: `+234-80${Math.floor(Math.random() * 90000000) + 10000000}`,
      email: `parent${index + 1}@example.com`,
      address: `${['Lagos', 'Abuja', 'Port Harcourt', 'Kano'][index % 4]}, Nigeria`
    },
    status: 'active',
    profilePhoto: null
  }));

  // Initialize sample results
  mockDatabase.results = mockDatabase.students.map(student => ({
    id: `result-${student.id}`,
    studentId: student.id,
    academicYear: getCurrentAcademicYear(),
    term: getCurrentTerm(),
    subjects: mockDatabase.subjects.filter(s => 
      student.class.includes('Primary') ? 
        NIGERIAN_SUBJECTS.PRIMARY_SUBJECTS.includes(s.name) : 
        NIGERIAN_SUBJECTS.CORE_SUBJECTS.includes(s.name)
    ).map(subject => ({
      subjectId: subject.id,
      subjectName: subject.name,
      firstAssessment: Math.floor(Math.random() * 5) + 15,
      secondAssessment: Math.floor(Math.random() * 5) + 15,
      exam: Math.floor(Math.random() * 20) + 40,
      total: 0,
      grade: 'A',
      remarks: 'Excellent'
    })),
    overallAverage: 0,
    position: 1,
    totalStudents: mockDatabase.students.length,
    submittedAt: new Date().toISOString()
  }));

  // Calculate totals and grades for results
  mockDatabase.results.forEach(result => {
    result.subjects.forEach(subject => {
      subject.total = subject.firstAssessment + subject.secondAssessment + subject.exam;
      
      // Calculate grade based on total
      if (subject.total >= 70) subject.grade = 'A';
      else if (subject.total >= 60) subject.grade = 'B';
      else if (subject.total >= 50) subject.grade = 'C';
      else if (subject.total >= 45) subject.grade = 'D';
      else if (subject.total >= 40) subject.grade = 'E';
      else subject.grade = 'F';
      
      // Set remarks
      if (subject.grade === 'A') subject.remarks = 'Excellent';
      else if (subject.grade === 'B') subject.remarks = 'Very Good';
      else if (subject.grade === 'C') subject.remarks = 'Good';
      else if (subject.grade === 'D') subject.remarks = 'Fair';
      else if (subject.grade === 'E') subject.remarks = 'Pass';
      else subject.remarks = 'Fail';
    });
    
    // Calculate overall average
    const totalScore = result.subjects.reduce((sum, s) => sum + s.total, 0);
    result.overallAverage = Math.round((totalScore / result.subjects.length) * 10) / 10;
  });

  // Initialize sample fees
  mockDatabase.fees = mockDatabase.students.map(student => ({
    id: `fee-${student.id}`,
    studentId: student.id,
    academicYear: getCurrentAcademicYear(),
    term: getCurrentTerm(),
    totalAmount: 45000,
    amountPaid: Math.random() > 0.3 ? 45000 : Math.floor(Math.random() * 20000) + 5000,
    balance: 0,
    status: 'paid',
    dueDate: '2024-09-01',
    paidAt: new Date().toISOString()
  }));

  // Calculate balance and status for fees
  mockDatabase.fees.forEach(fee => {
    fee.balance = fee.totalAmount - fee.amountPaid;
    if (fee.balance === 0) fee.status = 'paid';
    else if (fee.amountPaid > 0) fee.status = 'partial';
    else fee.status = 'pending';
  });

  // Initialize sample attendance
  mockDatabase.attendance = mockDatabase.students.map(student => ({
    id: `attendance-${student.id}`,
    studentId: student.id,
    academicYear: getCurrentAcademicYear(),
    term: getCurrentTerm(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalDays: 20,
    presentDays: Math.floor(Math.random() * 5) + 15,
    absentDays: Math.floor(Math.random() * 3),
    lateDays: Math.floor(Math.random() * 2),
    percentage: 0,
    remarks: 'Good'
  }));

  // Calculate attendance percentage
  mockDatabase.attendance.forEach(attendance => {
    attendance.percentage = Math.round((attendance.presentDays / attendance.totalDays) * 100);
  });
};

// Student Services
const StudentService = {
  // Get all students
  getStudents: async (filters = {}) => {
    await delay(800);
    let students = [...mockDatabase.students];

    if (filters.class) {
      students = students.filter(s => s.class === filters.class);
    }
    if (filters.status) {
      students = students.filter(s => s.status === filters.status);
    }
    if (filters.gender) {
      students = students.filter(s => s.gender === filters.gender);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      students = students.filter(s => 
        s.firstName.toLowerCase().includes(searchTerm) ||
        s.lastName.toLowerCase().includes(searchTerm) ||
        s.admissionNumber.toLowerCase().includes(searchTerm)
      );
    }

    return { success: true, data: students };
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    await delay(500);
    const student = mockDatabase.students.find(s => s.id === studentId);
    return { success: true, data: student };
  },

  // Create new student
  createStudent: async (studentData) => {
    await delay(1000);
    const newStudent = {
      ...StudentModel,
      id: `student-${String(mockDatabase.students.length + 1).padStart(4, '0')}`,
      admissionNumber: generateAdmissionNumber(new Date().getFullYear(), mockDatabase.students.length + 1),
      ...studentData,
      status: 'active',
      admissionDate: new Date().toISOString().split('T')[0]
    };

    mockDatabase.students.push(newStudent);
    return { success: true, data: newStudent };
  },

  // Update student
  updateStudent: async (studentId, updateData) => {
    await delay(800);
    const index = mockDatabase.students.findIndex(s => s.id === studentId);
    if (index === -1) {
      return { success: false, error: 'Student not found' };
    }

    mockDatabase.students[index] = { ...mockDatabase.students[index], ...updateData };
    return { success: true, data: mockDatabase.students[index] };
  },

  // Delete student
  deleteStudent: async (studentId) => {
    await delay(500);
    const index = mockDatabase.students.findIndex(s => s.id === studentId);
    if (index === -1) {
      return { success: false, error: 'Student not found' };
    }

    mockDatabase.students.splice(index, 1);
    return { success: true };
  }
};

// Result Management Services
const ResultService = {
  // Get student results
  getStudentResults: async (studentId, filters = {}) => {
    await delay(600);
    let results = mockDatabase.results.filter(r => r.studentId === studentId);

    if (filters.academicYear) {
      results = results.filter(r => r.academicYear === filters.academicYear);
    }
    if (filters.term) {
      results = results.filter(r => r.term === filters.term);
    }

    return { success: true, data: results };
  },

  // Get class results
  getClassResults: async (className, filters = {}) => {
    await delay(800);
    const classStudents = mockDatabase.students.filter(s => s.class === className);
    let results = mockDatabase.results.filter(r => 
      classStudents.some(s => s.id === r.studentId)
    );

    if (filters.academicYear) {
      results = results.filter(r => r.academicYear === filters.academicYear);
    }
    if (filters.term) {
      results = results.filter(r => r.term === filters.term);
    }

    return { success: true, data: results };
  },

  // Submit results
  submitResults: async (resultData) => {
    await delay(1000);
    const newResult = {
      id: `result-${resultData.studentId}-${Date.now()}`,
      ...resultData,
      submittedAt: new Date().toISOString()
    };

    // Remove existing result for same student, year, and term
    mockDatabase.results = mockDatabase.results.filter(r => 
      !(r.studentId === resultData.studentId && 
        r.academicYear === resultData.academicYear && 
        r.term === resultData.term)
    );

    mockDatabase.results.push(newResult);
    return { success: true, data: newResult };
  },

  // Update results
  updateResults: async (resultId, updateData) => {
    await delay(800);
    const index = mockDatabase.results.findIndex(r => r.id === resultId);
    if (index === -1) {
      return { success: false, error: 'Result not found' };
    }

    mockDatabase.results[index] = { ...mockDatabase.results[index], ...updateData };
    return { success: true, data: mockDatabase.results[index] };
  }
};

// Attendance Services
const AttendanceService = {
  // Mark attendance
  markAttendance: async (attendanceData) => {
    await delay(500);
    const newAttendance = {
      id: `attendance-${attendanceData.studentId}-${Date.now()}`,
      ...attendanceData,
      markedAt: new Date().toISOString()
    };

    // Remove existing attendance for same student, month, and year
    mockDatabase.attendance = mockDatabase.attendance.filter(a => 
      !(a.studentId === attendanceData.studentId && 
        a.month === attendanceData.month && 
        a.year === attendanceData.year)
    );

    mockDatabase.attendance.push(newAttendance);
    return { success: true, data: newAttendance };
  },

  // Get student attendance
  getStudentAttendance: async (studentId, filters = {}) => {
    await delay(600);
    let attendance = mockDatabase.attendance.filter(a => a.studentId === studentId);

    if (filters.month) {
      attendance = attendance.filter(a => a.month === filters.month);
    }
    if (filters.year) {
      attendance = attendance.filter(a => a.year === filters.year);
    }

    return { success: true, data: attendance };
  },

  // Get class attendance
  getClassAttendance: async (className, filters = {}) => {
    await delay(800);
    const classStudents = mockDatabase.students.filter(s => s.class === className);
    let attendance = mockDatabase.attendance.filter(a => 
      classStudents.some(s => s.id === a.studentId)
    );

    if (filters.month) {
      attendance = attendance.filter(a => a.month === filters.month);
    }
    if (filters.year) {
      attendance = attendance.filter(a => a.year === filters.year);
    }

    return { success: true, data: attendance };
  }
};

// Fee Management Services
const FeeService = {
  // Get student fees
  getStudentFees: async (studentId, filters = {}) => {
    await delay(600);
    let fees = mockDatabase.fees.filter(f => f.studentId === studentId);

    if (filters.academicYear) {
      fees = fees.filter(f => f.academicYear === filters.academicYear);
    }
    if (filters.term) {
      fees = fees.filter(f => f.term === filters.term);
    }

    return { success: true, data: fees };
  },

  // Get class fees
  getClassFees: async (className, filters = {}) => {
    await delay(800);
    const classStudents = mockDatabase.students.filter(s => s.class === className);
    let fees = mockDatabase.fees.filter(f => 
      classStudents.some(s => s.id === f.studentId)
    );

    if (filters.academicYear) {
      fees = fees.filter(f => f.academicYear === filters.academicYear);
    }
    if (filters.term) {
      fees = fees.filter(f => f.term === filters.term);
    }

    return { success: true, data: fees };
  },

  // Process fee payment
  processPayment: async (feeId, paymentData) => {
    await delay(1000);
    const feeIndex = mockDatabase.fees.findIndex(f => f.id === feeId);
    if (feeIndex === -1) {
      return { success: false, error: 'Fee record not found' };
    }

    const fee = mockDatabase.fees[feeIndex];
    fee.amountPaid += paymentData.amount;
    fee.balance = fee.totalAmount - fee.amountPaid;
    fee.paidAt = new Date().toISOString();

    if (fee.balance === 0) {
      fee.status = 'paid';
    } else if (fee.amountPaid > 0) {
      fee.status = 'partial';
    }

    return { success: true, data: fee };
  },

  // Get fee summary for class/term
  getFeeSummary: async (filters = {}) => {
    await delay(800);
    let fees = [...mockDatabase.fees];

    if (filters.class) {
      const studentsInClass = mockDatabase.students.filter(s => s.class === filters.class);
      fees = fees.filter(f => studentsInClass.some(s => s.id === f.studentId));
    }
    if (filters.term) {
      fees = fees.filter(f => f.term === filters.term);
    }
    if (filters.academicYear) {
      fees = fees.filter(f => f.academicYear === academicYear);
    }

    const summary = {
      totalStudents: new Set(fees.map(f => f.studentId)).size,
      totalAmount: fees.reduce((sum, f) => sum + f.totalAmount, 0),
      totalPaid: fees.reduce((sum, f) => sum + f.amountPaid, 0),
      totalBalance: fees.reduce((sum, f) => sum + f.balance, 0),
      paid: fees.filter(f => f.status === 'paid').length,
      partial: fees.filter(f => f.status === 'partial').length,
      pending: fees.filter(f => f.status === 'pending').length,
      overdue: fees.filter(f => f.status === 'overdue').length
    };

    return { success: true, data: summary };
  }
};

// Initialize mock data on import
initializeMockData();

// Export class-related constants and functions
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

// Export services
export { StudentService, ResultService, AttendanceService, FeeService };

// Export mockDatabase for use in components
export { mockDatabase };
