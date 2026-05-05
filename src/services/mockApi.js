// Mock API service for FOLUSHO VICTORY SCHOOLS demo
// This simulates backend authentication and data responses
import config from '../config/envConfig';
import jwt from 'jsonwebtoken';

const mockUsers = {
  admin: {
    id: 1,
    email: 'admin@folushovictory.com',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
    firstName: 'System',
    lastName: 'Administrator',
    department: 'IT Administration',
    phone: '+234-800-000-0001'
  },
  teacher: {
    id: 2,
    email: 'teacher@folushovictory.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Mrs. Adekunle',
    firstName: 'Funke',
    lastName: 'Adekunle',
    department: 'Mathematics',
    phone: '+234-800-000-0002',
    classes: ['JSS 1A', 'JSS 2B', 'SSS 3C'],
    subjects: ['Mathematics', 'Further Mathematics']
  },
  parent: {
    id: 3,
    email: 'parent@folushovictory.com',
    password: 'parent123',
    role: 'parent',
    name: 'Mr. Johnson',
    firstName: 'Tunde',
    lastName: 'Johnson',
    phone: '+234-800-000-0003',
    children: [
      { name: 'Johnson Junior', class: 'JSS 1A', id: 'STU001' },
      { name: 'Johnson Mary', class: 'SSS 2B', id: 'STU002' }
    ]
  }
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// JWT Secret - must match Supabase Edge Functions
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || 'nigerian-school-jwt-secret-2024';

// Generate proper JWT token
const generateJWTToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Mock authentication
export const mockLogin = async (email, password, role) => {
  await delay(1500); // Simulate network request
  
  const user = mockUsers[role];
  
  if (!user) {
    throw new Error('Invalid role specified');
  }
  
  if (user.email !== email || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  // Generate proper JWT token
  const token = generateJWTToken(user);
  
  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        phone: user.phone,
        ...(user.classes && { classes: user.classes }),
        ...(user.subjects && { subjects: user.subjects }),
        ...(user.children && { children: user.children })
      },
      school: {
        id: 'school-001',
        name: config.getSchoolInfo().name,
        motto: config.getSchoolInfo().motto,
        vision: 'To be a leading institution in academic excellence and moral development',
        mission: 'To provide quality education that develops the total child',
        address: {
          street: config.getSchoolInfo().address,
          city: config.getSchoolInfo().address.includes(',') ? config.getSchoolInfo().address.split(',')[1]?.trim() : 'Kaduna',
          state: config.getSchoolInfo().address.includes(',') ? 'Kaduna' : 'Kaduna',
          lga: 'Barnawa',
          postalCode: '800001',
          phone: config.getSchoolInfo().phone,
          email: config.getSchoolInfo().email,
          website: config.getSchoolInfo().website
        },
        establishment: {
          date: '1995-09-15',
          founder: 'Mrs. Folusho Johnson',
          firstPrincipal: 'Mr. Adebayo Williams',
          approvalNumber: 'LASG/ED/1995/042',
          ministry: 'Kaduna State Ministry of Education'
        },
        statistics: {
          totalStudents: 1250,
          totalTeachers: 85,
          totalClasses: 42,
          averageClassSize: 30,
          studentTeacherRatio: 15
        }
      }
    }
  };
};

// Mock dashboard data
export const getDashboardData = async (role) => {
  await delay(800);
  
  const dashboardData = {
    admin: {
      stats: {
        totalStudents: 1250,
        totalTeachers: 85,
        totalClasses: 42,
        totalParents: 980,
        attendanceRate: 92.5,
        averagePerformance: 78.3
      },
      recentActivities: [
        { id: 1, action: 'New student registration', time: '2 hours ago', user: 'Admin' },
        { id: 2, action: 'Teacher assignment updated', time: '4 hours ago', user: 'Admin' },
        { id: 3, action: 'System backup completed', time: '6 hours ago', user: 'System' }
      ],
      notifications: [
        { id: 1, title: 'Parent Meeting Tomorrow', message: 'SSS 3 parent meeting scheduled for 10 AM', type: 'info' },
        { id: 2, title: 'System Update', message: 'New features available in student portal', type: 'success' },
        { id: 3, title: 'Fee Payment Reminder', message: '15 students have outstanding fees', type: 'warning' }
      ]
    },
    teacher: {
      stats: {
        totalStudents: 120,
        classesTeaching: 3,
        subjectsTeaching: 2,
        averageAttendance: 88.2,
        assignmentCompletion: 95.6
      },
      todaySchedule: [
        { time: '8:00 AM', subject: 'Mathematics', class: 'JSS 1A', room: 'Room 12' },
        { time: '10:00 AM', subject: 'Mathematics', class: 'JSS 2B', room: 'Room 15' },
        { time: '2:00 PM', subject: 'Further Mathematics', class: 'SSS 3C', room: 'Room 8' }
      ],
      assignments: [
        { id: 1, title: 'Algebra Homework', class: 'JSS 1A', dueDate: '2024-05-05', submitted: 45, total: 50 },
        { id: 2, title: 'Geometry Project', class: 'JSS 2B', dueDate: '2024-05-08', submitted: 38, total: 42 }
      ]
    },
    parent: {
      children: [
        {
          name: 'Johnson Junior',
          class: 'JSS 1A',
          attendance: { present: 18, absent: 2, percentage: 90 },
          grades: [
            { subject: 'Mathematics', score: 85, grade: 'A' },
            { subject: 'English', score: 78, grade: 'B' },
            { subject: 'Science', score: 92, grade: 'A' }
          ],
          fees: { paid: 45000, outstanding: 15000, dueDate: '2024-05-15' }
        },
        {
          name: 'Johnson Mary',
          class: 'SSS 2B',
          attendance: { present: 20, absent: 0, percentage: 100 },
          grades: [
            { subject: 'Mathematics', score: 88, grade: 'A' },
            { subject: 'English', score: 91, grade: 'A' },
            { subject: 'Physics', score: 76, grade: 'B' }
          ],
          fees: { paid: 60000, outstanding: 0, dueDate: '2024-05-01' }
        }
      ],
      notifications: [
        { id: 1, title: 'PTA Meeting', message: 'Next PTA meeting on May 10, 2024', type: 'info' },
        { id: 2, title: 'Outstanding Fees', message: 'Johnson Junior has outstanding fees', type: 'warning' }
      ]
    }
  };
  
  return {
    success: true,
    data: dashboardData[role] || {}
  };
};

// Mock API interceptor for axios
export const setupMockApi = () => {
  // Store original axios methods
  const originalPost = window.axios?.post;
  const originalGet = window.axios?.get;
  
  // Mock axios post for login
  if (window.axios) {
    window.axios.post = async (url, data) => {
      if (url === '/api/auth/login') {
        try {
          const result = await mockLogin(data.email, data.password, data.role);
          return { data: result.data };
        } catch (error) {
          throw {
            response: {
              data: { error: error.message }
            }
          };
        }
      }
      // Call original post for other URLs
      return originalPost ? originalPost.call(window.axios, url, data) : {};
    };
    
    // Mock axios get for dashboard data
    window.axios.get = async (url) => {
      if (url.includes('/dashboard')) {
        const result = await getDashboardData('admin'); // Default to admin for demo
        return { data: result.data };
      }
      // Call original get for other URLs
      return originalGet ? originalGet.call(window.axios, url) : {};
    };
  }
};

export default { mockLogin, getDashboardData, setupMockApi };
