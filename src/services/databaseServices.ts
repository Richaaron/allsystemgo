// FOLUSHO VICTORY SCHOOLS - Database Services
// Replaces mock services with real database operations using Drizzle ORM

import { db } from '../lib/db';
import { 
  schools, 
  academicYears, 
  schoolTerms, 
  departments, 
  subjects, 
  classes, 
  teachers, 
  students, 
  users,
  userProfiles,
  results,
  attendance,
  feeStructures,
  studentFees,
  feePayments,
  calendarEvents,
  assignments,
  studentSubmissions,
  notifications,
  systemSettings
} from '../lib/db';
import { eq, and, desc, asc, like, gte, lte, count, sum } from 'drizzle-orm';
import { formatNaira, getCurrentAcademicYear, getCurrentTerm, calculateGrade, calculateGPA } from '../data/models';

// Utility function for delay (to simulate async operations)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication Service
export const DatabaseAuthService = {
  async login(email: string, password: string) {
    await delay(800);
    
    try {
      const user = await db.select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.isActive, true)))
        .limit(1);

      if (user.length === 0) {
        throw new Error('User not found');
      }

      // In a real app, you would hash and compare passwords
      // For demo purposes, we'll accept any password for demo users
      const validPasswords = {
        'admin@folushovictory.com': 'admin123',
        'teacher@folushovictory.com': 'teacher123',
        'parent@folushovictory.com': 'parent123'
      };

      if (!validPasswords[email as keyof typeof validPasswords] || validPasswords[email as keyof typeof validPasswords] !== password) {
        throw new Error('Invalid credentials');
      }

      // Get user profile information
      const userProfile = await db.select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, user[0].id))
        .limit(1);

      let profileData = {};
      if (userProfile.length > 0) {
        const { profileType, profileId } = userProfile[0];
        
        if (profileType === 'teacher') {
          const teacher = await db.select()
            .from(teachers)
            .where(eq(teachers.id, profileId))
            .limit(1);
          if (teacher.length > 0) {
            profileData = {
              ...teacher[0],
              department: await this.getDepartmentName(teacher[0].departmentId),
              subjects: await this.getSubjectNames(teacher[0].subjectsTeaching),
              classes: await this.getClassNames(teacher[0].classesAssigned)
            };
          }
        } else if (profileType === 'student') {
          const student = await db.select()
            .from(students)
            .where(eq(students.id, profileId))
            .limit(1);
          if (student.length > 0) {
            profileData = {
              ...student[0],
              class: await this.getClassName(student[0].classId)
            };
          }
        }
      }

      return {
        success: true,
        data: {
          user: {
            id: user[0].id,
            email: user[0].email,
            role: user[0].role,
            name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || user[0].email,
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            ...profileData
          },
          school: await this.getSchoolInfo()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  },

  async getSchoolInfo() {
    const school = await db.select().from(schools).limit(1);
    if (school.length === 0) return null;

    return {
      id: school[0].id,
      name: school[0].name,
      motto: school[0].motto,
      vision: school[0].vision,
      mission: school[0].mission,
      address: {
        street: school[0].addressStreet,
        city: school[0].addressCity,
        state: school[0].addressState,
        lga: school[0].addressLga,
        postalCode: school[0].addressPostalCode,
        phone: school[0].phone,
        email: school[0].email,
        website: school[0].website
      },
      establishment: {
        date: school[0].establishmentDate,
        founder: school[0].founder,
        firstPrincipal: school[0].firstPrincipal,
        approvalNumber: school[0].approvalNumber,
        ministry: school[0].ministry
      }
    };
  },

  async getDepartmentName(departmentId: number) {
    const dept = await db.select().from(departments).where(eq(departments.id, departmentId)).limit(1);
    return dept.length > 0 ? dept[0].name : '';
  },

  async getSubjectNames(subjectIds: number[]) {
    if (subjectIds.length === 0) return [];
    const subjects = await db.select()
      .from(subjects)
      .where(subjects.id.in(subjectIds));
    return subjects.map(s => s.name);
  },

  async getClassNames(classIds: number[]) {
    if (classIds.length === 0) return [];
    const classList = await db.select()
      .from(classes)
      .where(classes.id.in(classIds));
    return classList.map(c => c.name);
  },

  async getClassName(classId: number) {
    const classList = await db.select().from(classes).where(eq(classes.id, classId)).limit(1);
    return classList.length > 0 ? classList[0].name : '';
  }
};

// Student Service
export const DatabaseStudentService = {
  async getStudents(filters: any = {}) {
    await delay(600);
    
    try {
      let query = db.select()
        .from(students)
        .where(eq(students.isActive, true));

      // Apply filters
      if (filters.classId) {
        query = query.where(eq(students.classId, filters.classId));
      }
      if (filters.search) {
        query = query.where(
          like(students.firstName, `%${filters.search}%`)
        );
      }

      const students = await query.limit(filters.limit || 50).offset(filters.offset || 0);

      // Enrich with class information
      const enrichedStudents = await Promise.all(
        students.map(async (student) => {
          const classInfo = await db.select()
            .from(classes)
            .where(eq(classes.id, student.classId))
            .limit(1);
          
          return {
            ...student,
            class: classInfo.length > 0 ? classInfo[0].name : '',
            attendance: await this.getStudentAttendance(student.id),
            fees: await this.getStudentFees(student.id)
          };
        })
      );

      return {
        success: true,
        data: enrichedStudents,
        total: enrichedStudents.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch students'
      };
    }
  },

  async getStudentById(id: number) {
    await delay(400);
    
    try {
      const student = await db.select()
        .from(students)
        .where(eq(students.id, id))
        .limit(1);

      if (student.length === 0) {
        return { success: false, error: 'Student not found' };
      }

      const classInfo = await db.select()
        .from(classes)
        .where(eq(classes.id, student[0].classId))
        .limit(1);

      return {
        success: true,
        data: {
          ...student[0],
          class: classInfo.length > 0 ? classInfo[0].name : ''
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch student'
      };
    }
  },

  async createStudent(studentData: any) {
    await delay(800);
    
    try {
      // Generate admission number
      const lastStudent = await db.select()
        .from(students)
        .orderBy(desc(students.id))
        .limit(1);
      
      const sequence = lastStudent.length > 0 ? lastStudent[0].id + 1 : 1;
      const admissionNumber = `FVS/${new Date().getFullYear()}/${sequence.toString().padStart(4, '0')}`;

      const [student] = await db.insert(students).values({
        ...studentData,
        admissionNumber,
        status: 'active',
        isActive: true
      }).returning();

      return {
        success: true,
        data: student
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create student'
      };
    }
  },

  async updateStudent(id: number, studentData: any) {
    await delay(600);
    
    try {
      const [student] = await db.update(students)
        .set({ ...studentData, updatedAt: new Date() })
        .where(eq(students.id, id))
        .returning();

      return {
        success: true,
        data: student
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update student'
      };
    }
  },

  async deleteStudent(id: number) {
    await delay(500);
    
    try {
      await db.update(students)
        .set({ isActive: false })
        .where(eq(students.id, id));

      return {
        success: true,
        message: 'Student deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete student'
      };
    }
  },

  async getStudentAttendance(studentId: number) {
    await delay(400);
    
    try {
      const attendanceRecords = await db.select()
        .from(attendance)
        .where(eq(attendance.studentId, studentId))
        .limit(100);

      const present = attendanceRecords.filter(r => r.status === 'present').length;
      const absent = attendanceRecords.filter(r => r.status === 'absent').length;
      const total = attendanceRecords.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      return {
        present,
        absent,
        total,
        percentage
      };
    } catch (error) {
      return {
        present: 0,
        absent: 0,
        total: 0,
        percentage: 0
      };
    }
  },

  async getStudentFees(studentId: number) {
    await delay(400);
    
    try {
      const studentFeeRecords = await db.select()
        .from(studentFees)
        .where(eq(studentFees.studentId, studentId))
        .limit(10);

      if (studentFeeRecords.length === 0) {
        return {
          total: 0,
          paid: 0,
          outstanding: 0,
          dueDate: null
        };
      }

      const total = studentFeeRecords.reduce((sum, fee) => sum + Number(fee.totalAmount), 0);
      const paid = studentFeeRecords.reduce((sum, fee) => sum + Number(fee.amountPaid), 0);
      const outstanding = total - paid;
      const dueDate = studentFeeRecords[0].dueDate;

      return {
        total,
        paid,
        outstanding,
        dueDate
      };
    } catch (error) {
      return {
        total: 0,
        paid: 0,
        outstanding: 0,
        dueDate: null
      };
    }
  }
};

// Result Service
export const DatabaseResultService = {
  async getStudentResults(studentId: number, filters: any = {}) {
    await delay(600);
    
    try {
      let query = db.select()
        .from(results)
        .where(eq(results.studentId, studentId));

      if (filters.termId) {
        query = query.where(eq(results.termId, filters.termId));
      }
      if (filters.academicYearId) {
        query = query.where(eq(results.academicYearId, filters.academicYearId));
      }

      const resultRecords = await query.orderBy(desc(results.createdAt)).limit(10);

      return {
        success: true,
        data: resultRecords
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch results'
      };
    }
  },

  async createResult(resultData: any) {
    await delay(800);
    
    try {
      // Calculate GPA and other metrics
      const totalPoints = resultData.subjects.reduce((sum: number, subject: any) => sum + subject.points, 0);
      const averagePoints = totalPoints / resultData.subjects.length;
      const gpa = averagePoints;

      const [result] = await db.insert(results).values({
        ...resultData,
        summary: {
          totalSubjects: resultData.subjects.length,
          totalPoints,
          averagePoints,
          gpa,
          classPosition: 1, // Would need to calculate based on class
          totalInClass: 30, // Would need to get from class
          attendance: resultData.attendance || {
            daysPresent: 0,
            daysAbsent: 0,
            percentage: 0
          },
          conduct: resultData.conduct || {
            grade: 'Excellent',
            remark: 'Good conduct'
          }
        },
        status: 'draft'
      }).returning();

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create result'
      };
    }
  },

  async getClassResults(classId: number, filters: any = {}) {
    await delay(800);
    
    try {
      // Get all students in the class
      const classStudents = await db.select()
        .from(students)
        .where(eq(students.classId, classId));

      const studentIds = classStudents.map(s => s.id);

      if (studentIds.length === 0) {
        return {
          success: true,
          data: []
        };
      }

      // Get results for all students in the class
      const classResults = await db.select()
        .from(results)
        .where(results.studentId.in(studentIds));

      if (filters.termId) {
        // Filter by term
        // This would need additional filtering logic
      }

      return {
        success: true,
        data: classResults
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch class results'
      };
    }
  },

  async updateResult(id: number, resultData: any) {
    await delay(600);
    
    try {
      const [result] = await db.update(results)
        .set({ ...resultData, updatedAt: new Date() })
        .where(eq(results.id, id))
        .returning();

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update result'
      };
    }
  }
};

// Fee Service
export const DatabaseFeeService = {
  async getFeeStructures(filters: any = {}) {
    await delay(500);
    
    try {
      let query = db.select()
        .from(feeStructures)
        .where(eq(feeStructures.isActive, true));

      if (filters.classId) {
        query = query.where(eq(feeStructures.classId, filters.classId));
      }
      if (filters.academicYearId) {
        query = query.where(eq(feeStructures.academicYearId, filters.academicYearId));
      }
      if (filters.termId) {
        query = query.where(eq(feeStructures.termId, filters.termId));
      }

      const feeStructures = await query.limit(50);

      return {
        success: true,
        data: feeStructures
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fee structures'
      };
    }
  },

  async getStudentFees(studentId: number) {
    await delay(400);
    
    try {
      const studentFeeRecords = await db.select({
        studentFees: studentFees,
        feeStructures: feeStructures
      })
        .from(studentFees)
        .leftJoin(feeStructures, eq(studentFees.feeStructureId, feeStructures.id))
        .where(eq(studentFees.studentId, studentId));

      return {
        success: true,
        data: studentFeeRecords
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch student fees'
      };
    }
  },

  async createPayment(paymentData: any) {
    await delay(600);
    
    try {
      const [payment] = await db.insert(feePayments).values({
        ...paymentData,
        paymentDate: new Date()
      }).returning();

      // Update student fee balance
      const studentFee = await db.select()
        .from(studentFees)
        .where(eq(studentFees.id, paymentData.studentFeeId))
        .limit(1);

      if (studentFee.length > 0) {
        const newAmountPaid = Number(studentFee[0].amountPaid) + Number(paymentData.amount);
        const newBalance = Number(studentFee[0].balance) - Number(paymentData.amount);
        const status = newBalance <= 0 ? 'paid' : 'partial';

        await db.update(studentFees)
          .set({
            amountPaid: newAmountPaid,
            balance: newBalance,
            status,
            updatedAt: new Date()
          })
          .where(eq(studentFees.id, paymentData.studentFeeId));
      }

      return {
        success: true,
        data: payment
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment'
      };
    }
  },

  async getFeeSummary(filters: any = {}) {
    await delay(800);
    
    try {
      let query = db.select({
        totalAmount: sum(studentFees.totalAmount),
        amountPaid: sum(studentFees.amountPaid),
        balance: sum(studentFees.balance),
        count: count(studentFees.id)
      })
        .from(studentFees);

      if (filters.status) {
        query = query.where(eq(studentFees.status, filters.status));
      }

      const summary = await query.limit(1);

      const [result] = summary;

      return {
        success: true,
        data: {
          totalAmount: Number(result.totalAmount) || 0,
          amountPaid: Number(result.amountPaid) || 0,
          balance: Number(result.balance) || 0,
          count: Number(result.count) || 0,
          pending: await this.getFeeCountByStatus('pending'),
          partial: await this.getFeeCountByStatus('partial'),
          paid: await this.getFeeCountByStatus('paid'),
          overdue: await this.getFeeCountByStatus('overdue')
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fee summary'
      };
    }
  },

  async getFeeCountByStatus(status: string) {
    const result = await db.select({ count: count(studentFees.id) })
      .from(studentFees)
      .where(eq(studentFees.status, status))
      .limit(1);
    
    return Number(result[0]?.count || 0);
  }
};

// Attendance Service
export const DatabaseAttendanceService = {
  async markAttendance(attendanceData: any) {
    await delay(500);
    
    try {
      const [attendanceRecord] = await db.insert(attendance).values({
        ...attendanceData,
        date: new Date(attendanceData.date),
        createdAt: new Date()
      }).returning();

      return {
        success: true,
        data: attendanceRecord
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark attendance'
      };
    }
  },

  async getAttendance(filters: any = {}) {
    await delay(600);
    
    try {
      let query = db.select({
        attendance: attendance,
        students: students,
        classes: classes
      })
        .from(attendance)
        .leftJoin(students, eq(attendance.studentId, students.id))
        .leftJoin(classes, eq(attendance.classId, classes.id));

      if (filters.classId) {
        query = query.where(eq(attendance.classId, filters.classId));
      }
      if (filters.date) {
        query = query.where(eq(attendance.date, new Date(filters.date)));
      }
      if (filters.studentId) {
        query = query.where(eq(attendance.studentId, filters.studentId));
      }

      const attendanceRecords = await query.limit(100);

      return {
        success: true,
        data: attendanceRecords
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendance'
      };
    }
  },

  async getAttendanceSummary(classId: number, filters: any = {}) {
    await delay(800);
    
    try {
      const attendanceRecords = await db.select()
        .from(attendance)
        .where(eq(attendance.classId, classId));

      const summary = attendanceRecords.reduce((acc, record) => {
        if (record.status === 'present') acc.present++;
        else if (record.status === 'absent') acc.absent++;
        else if (record.status === 'late') acc.late++;
        else if (record.status === 'excused') acc.excused++;
        acc.total++;
        return acc;
      }, { present: 0, absent: 0, late: 0, excused: 0, total: 0 });

      const attendanceRate = summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0;

      return {
        success: true,
        data: {
          ...summary,
          attendanceRate
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendance summary'
      };
    }
  }
};

// Class Service
export const DatabaseClassService = {
  async getClasses(filters: any = {}) {
    await delay(400);
    
    try {
      let query = db.select()
        .from(classes)
        .where(eq(classes.isActive, true));

      if (filters.level) {
        query = query.where(eq(classes.level, filters.level));
      }
      if (filters.academicYearId) {
        query = query.where(eq(classes.academicYearId, filters.academicYearId));
      }

      const classList = await query.limit(50);

      // Enrich with student count and teacher info
      const enrichedClasses = await Promise.all(
        classList.map(async (cls) => {
          const studentCount = await db.select({ count: count(students.id) })
            .from(students)
            .where(and(eq(students.classId, cls.id), eq(students.isActive, true)))
            .limit(1);
          
          const classTeacher = cls.classTeacherId ? await db.select()
            .from(teachers)
            .where(eq(teachers.id, cls.classTeacherId))
            .limit(1) : null;

          return {
            ...cls,
            studentCount: Number(studentCount[0]?.count || 0),
            classTeacher: classTeacher ? `${classTeacher[0].firstName} ${classTeacher[0].lastName}` : null
          };
        })
      );

      return {
        success: true,
        data: enrichedClasses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch classes'
      };
    }
  },

  async createClass(classData: any) {
    await delay(600);
    
    try {
      const [cls] = await db.insert(classes).values({
        ...classData,
        currentEnrollment: 0,
        isActive: true
      }).returning();

      return {
        success: true,
        data: cls
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create class'
      };
    }
  }
};

// Subject Service
export const DatabaseSubjectService = {
  async getSubjects(filters: any = {}) {
    await delay(400);
    
    try {
      let query = db.select()
        .from(subjects)
        .where(eq(subjects.isActive, true));

      if (filters.category) {
        query = query.where(eq(subjects.category, filters.category));
      }
      if (filters.departmentId) {
        query = query.where(eq(subjects.departmentId, filters.departmentId));
      }

      const subjectList = await query.limit(50);

      return {
        success: true,
        data: subjectList
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subjects'
      };
    }
  },

  async createSubject(subjectData: any) {
    await delay(600);
    
    try {
      const [subject] = await db.insert(subjects).values({
        ...subjectData,
        isActive: true
      }).returning();

      return {
        success: true,
        data: subject
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create subject'
      };
    }
  }
};

// Teacher Service
export const DatabaseTeacherService = {
  async getTeachers(filters: any = {}) {
    await delay(500);
    
    try {
      let query = db.select()
        .from(teachers)
        .where(eq(teachers.isActive, true));

      if (filters.departmentId) {
        query = query.where(eq(teachers.departmentId, filters.departmentId));
      }
      if (filters.search) {
        query = query.where(
          like(teachers.firstName, `%${filters.search}%`)
        );
      }

      const teacherList = await query.limit(50);

      // Enrich with department and subject information
      const enrichedTeachers = await Promise.all(
        teacherList.map(async (teacher) => ({
          ...teacher,
          department: await this.getDepartmentName(teacher.departmentId),
          subjects: await this.getSubjectNames(teacher.subjectsTeaching),
          classes: await this.getClassNames(teacher.classesAssigned)
        }))
      );

      return {
        success: true,
        data: enrichedTeachers
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch teachers'
      };
    }
  },

  async createTeacher(teacherData: any) {
    await delay(800);
    
    try {
      // Generate staff ID
      const lastTeacher = await db.select()
        .from(teachers)
        .orderBy(desc(teachers.id))
        .limit(1);
      
      const sequence = lastTeacher.length > 0 ? lastTeacher[0].id + 1 : 1;
      const staffId = `STF/${sequence.toString().padStart(4, '0')}`;

      const [teacher] = await db.insert(teachers).values({
        ...teacherData,
        staffId,
        isActive: true
      }).returning();

      return {
        success: true,
        data: teacher
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create teacher'
      };
    }
  },

  async getDepartmentName(departmentId: number) {
    const dept = await db.select().from(departments).where(eq(departments.id, departmentId)).limit(1);
    return dept.length > 0 ? dept[0].name : '';
  },

  async getSubjectNames(subjectIds: number[]) {
    if (subjectIds.length === 0) return [];
    const subjectList = await db.select()
      .from(subjects)
      .where(subjects.id.in(subjectIds));
    return subjectList.map(s => s.name);
  },

  async getClassNames(classIds: number[]) {
    if (classIds.length === 0) return [];
    const classList = await db.select()
      .from(classes)
      .where(classes.id.in(classIds));
    return classList.map(c => c.name);
  }
};

// Export all services
export default {
  Auth: DatabaseAuthService,
  Student: DatabaseStudentService,
  Result: DatabaseResultService,
  Fee: DatabaseFeeService,
  Attendance: DatabaseAttendanceService,
  Class: DatabaseClassService,
  Subject: DatabaseSubjectService,
  Teacher: DatabaseTeacherService
};
