// FOLUSHO VICTORY SCHOOLS - Backend Server
// Simple Express server to connect React app to PostgreSQL database

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { eq, and, desc, asc } = require('drizzle-orm');
const nodemailer = require('nodemailer').default || require('nodemailer');

// Import database schema
const schema = require('./src/lib/db/schema.js');
const {
  schools,
  academicYears,
  schoolTerms,
  departments,
  subjects,
  classes,
  teachers,
  students,
  results,
  users,
  settings
} = schema;

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/postgres';
const client = postgres(connectionString);
const db = drizzle(client, { schema });

// Email configuration
const emailConfig = {
  host: process.env.REACT_APP_SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.REACT_APP_SMTP_PORT) || 587,
  secure: process.env.REACT_APP_SMTP_SECURE === 'true',
  auth: {
    user: process.env.REACT_APP_SMTP_USER || 'folushovictoryschool@gmail.com',
    pass: process.env.REACT_APP_SMTP_PASS || 'zulz lkxf rdaz ojnb'
  }
};

// Create email transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Email helper functions
const sendEmailNotification = async (recipient, subject, content, attachments = []) => {
  try {
    const mailOptions = {
      from: `"Folusho Victory Schools" <${emailConfig.auth.user}>`,
      to: recipient,
      subject: subject,
      html: content,
      attachments: attachments
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${recipient}: ${subject}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  newTeacher: (teacherData) => ({
    subject: '🎓 Welcome to Folusho Victory Schools - Teacher Account Created',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎓 Folusho Victory Schools</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Teacher Account Created</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Welcome, ${teacherData.firstName} ${teacherData.lastName}!</h2>
          <p style="color: #666;">Your teacher account has been successfully created in the Folusho Victory Schools Management System.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 15px 0;">
            <h3 style="color: #28a745; margin-top: 0;">📋 Your Account Details</h3>
            <ul style="color: #666; margin-bottom: 0;">
              <li><strong>Staff ID:</strong> ${teacherData.staffId}</li>
              <li><strong>Position:</strong> ${teacherData.position}</li>
              <li><strong>Department:</strong> ${teacherData.department || 'To be assigned'}</li>
              <li><strong>Email:</strong> ${teacherData.email}</li>
              <li><strong>Phone:</strong> ${teacherData.phone}</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">🔐 Login Information</h3>
            <p style="color: #666; margin-bottom: 0;">You can now access the system using your email address. Please contact the administrator for your initial password.</p>
          </div>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>🏫 Folusho Victory Schools Management System</p>
          <p>Excellence in Education Since 2009</p>
        </div>
      </div>
    `
  }),
  
  newStudent: (studentData) => ({
    subject: '🎓 Welcome to Folusho Victory Schools - Student Admission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎓 Folusho Victory Schools</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Student Admission Confirmed</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Congratulations, ${studentData.firstName} ${studentData.lastName}!</h2>
          <p style="color: #666;">Your admission to Folusho Victory Schools has been confirmed. We are delighted to welcome you to our school community.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 15px 0;">
            <h3 style="color: #28a745; margin-top: 0;">📋 Admission Details</h3>
            <ul style="color: #666; margin-bottom: 0;">
              <li><strong>Admission Number:</strong> ${studentData.admissionNumber}</li>
              <li><strong>Class:</strong> ${studentData.className || 'To be assigned'}</li>
              <li><strong>Admission Date:</strong> ${new Date(studentData.admissionDate).toLocaleDateString()}</li>
              <li><strong>Parent/Guardian:</strong> ${studentData.parentGuardianName}</li>
              <li><strong>Contact:</strong> ${studentData.parentGuardianPhone}</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #856404; margin-top: 0;">📚 Important Information</h3>
            <p style="color: #856404; margin-bottom: 0;">Please ensure you complete all required documentation and attend the orientation session. The school office will contact you with further details.</p>
          </div>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>🏫 Folusho Victory Schools Management System</p>
          <p>Excellence in Education Since 2009</p>
        </div>
      </div>
    `
  }),
  
  resultPublished: (studentData, resultData) => ({
    subject: '📊 Academic Results Published - Folusho Victory Schools',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎓 Folusho Victory Schools</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Academic Results Published</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Results for ${studentData.firstName} ${studentData.lastName}</h2>
          <p style="color: #666;">We are pleased to inform you that the academic results for the recent term have been published.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; margin: 15px 0;">
            <h3 style="color: #007bff; margin-top: 0;">📊 Result Summary</h3>
            <ul style="color: #666; margin-bottom: 0;">
              <li><strong>Admission Number:</strong> ${studentData.admissionNumber}</li>
              <li><strong>Class:</strong> ${studentData.className || 'N/A'}</li>
              <li><strong>Term:</strong> ${resultData.term || 'N/A'}</li>
              <li><strong>Academic Year:</strong> ${resultData.academicYear || 'N/A'}</li>
              <li><strong>Total Subjects:</strong> ${resultData.totalSubjects || 'N/A'}</li>
              <li><strong>Average Score:</strong> ${resultData.average || 'N/A'}</li>
            </ul>
          </div>
          
          <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #155724; margin-top: 0;">📋 Next Steps</h3>
            <p style="color: #155724; margin-bottom: 0;">Please log in to the school management system to view the detailed results. You can also collect the printed result card from the school office.</p>
          </div>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>🏫 Folusho Victory Schools Management System</p>
          <p>Excellence in Education Since 2009</p>
        </div>
      </div>
    `
  }),
  
  feeReminder: (studentData, feeData) => ({
    subject: '💰 Fee Payment Reminder - Folusho Victory Schools',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎓 Folusho Victory Schools</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Fee Payment Reminder</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Fee Payment Reminder for ${studentData.firstName} ${studentData.lastName}</h2>
          <p style="color: #666;">This is a friendly reminder about the upcoming fee payment for the current term.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 15px 0;">
            <h3 style="color: #856404; margin-top: 0;">💰 Fee Details</h3>
            <ul style="color: #666; margin-bottom: 0;">
              <li><strong>Student:</strong> ${studentData.firstName} ${studentData.lastName}</li>
              <li><strong>Admission Number:</strong> ${studentData.admissionNumber}</li>
              <li><strong>Class:</strong> ${studentData.className || 'N/A'}</li>
              <li><strong>Term:</strong> ${feeData.term || 'N/A'}</li>
              <li><strong>Due Date:</strong> ${new Date(feeData.dueDate).toLocaleDateString()}</li>
              <li><strong>Amount Due:</strong> ₦${feeData.amount || 'N/A'}</li>
              <li><strong>Balance:</strong> ₦${feeData.balance || 'N/A'}</li>
            </ul>
          </div>
          
          <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #721c24; margin-top: 0;">⏰ Payment Options</h3>
            <p style="color: #721c24; margin-bottom: 0;">Please ensure payment is made before the due date to avoid late fees. Payment can be made at the school office or through bank transfer.</p>
          </div>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>🏫 Folusho Victory Schools Management System</p>
          <p>Excellence in Education Since 2009</p>
        </div>
      </div>
    `
  })
};

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'nigerian-school-jwt-secret-2024';

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, school_id: user.school_id },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user in database
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user || user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const userData = user[0];
    
    // Simple password check (in production, use bcrypt)
    if (userData.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(userData);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = userData;
    
    res.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Schools
app.get('/api/schools', async (req, res) => {
  try {
    const schoolData = await db.select().from(schools).limit(1);
    res.json(schoolData[0] || {});
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Failed to fetch school data' });
  }
});

// Teachers
app.get('/api/teachers', authenticateToken, async (req, res) => {
  try {
    const teacherData = await db.select({
      id: teachers.id,
      staffId: teachers.staffId,
      firstName: teachers.first_name,
      lastName: teachers.last_name,
      email: teachers.email,
      phone: teachers.phone,
      gender: teachers.gender,
      qualification: teachers.qualification,
      specialization: teachers.specialization,
      subjectsTeaching: teachers.subjects_teaching,
      classesAssigned: teachers.classes_assigned,
      departmentId: teachers.department_id,
      position: teachers.position,
      employmentDate: teachers.employment_date,
      status: teachers.is_active,
      dateOfBirth: teachers.date_of_birth,
      address: teachers.address
    }).from(teachers);
    
    res.json(teacherData);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

app.post('/api/teachers', authenticateToken, async (req, res) => {
  try {
    const teacherData = req.body;
    
    // Generate staff ID
    const staffId = 'STF' + Date.now().toString().slice(-6);
    
    const newTeacher = await db.insert(teachers).values({
      staff_id: staffId,
      first_name: teacherData.firstName,
      last_name: teacherData.lastName,
      email: teacherData.email,
      phone: teacherData.phone,
      gender: teacherData.gender,
      date_of_birth: teacherData.dateOfBirth,
      address: teacherData.address,
      qualification: teacherData.qualification,
      specialization: teacherData.specialization,
      subjects_teaching: teacherData.subjectsTeaching,
      classes_assigned: teacherData.classesAssigned,
      department_id: teacherData.departmentId,
      position: teacherData.position,
      employment_date: teacherData.employmentDate,
      is_active: true,
      school_id: 1 // Default school ID
    }).returning();
    
    // Send welcome email to teacher
    const emailTemplate = emailTemplates.newTeacher({
      ...newTeacher[0],
      staffId: staffId,
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      email: teacherData.email,
      phone: teacherData.phone,
      position: teacherData.position
    });
    
    await sendEmailNotification(teacherData.email, emailTemplate.subject, emailTemplate.html);
    
    res.json(newTeacher[0]);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

app.put('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const teacherData = req.body;
    
    const updatedTeacher = await db.update(teachers)
      .set({
        first_name: teacherData.firstName,
        last_name: teacherData.lastName,
        email: teacherData.email,
        phone: teacherData.phone,
        gender: teacherData.gender,
        date_of_birth: teacherData.dateOfBirth,
        address: teacherData.address,
        qualification: teacherData.qualification,
        specialization: teacherData.specialization,
        subjects_teaching: teacherData.subjectsTeaching,
        classes_assigned: teacherData.classesAssigned,
        department_id: teacherData.departmentId,
        position: teacherData.position,
        employment_date: teacherData.employmentDate
      })
      .where(eq(teachers.id, id))
      .returning();
    
    res.json(updatedTeacher[0]);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// Students
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const studentData = await db.select({
      id: students.id,
      admissionNumber: students.admission_number,
      firstName: students.first_name,
      lastName: students.last_name,
      email: students.email,
      phone: students.phone,
      gender: students.gender,
      stateOfOrigin: students.state_of_origin,
      address: students.address,
      parentGuardianName: students.parent_guardian_name,
      parentGuardianPhone: students.parent_guardian_phone,
      classId: students.class_id,
      admissionDate: students.admission_date,
      status: students.status,
      dateOfBirth: students.date_of_birth
    }).from(students);
    
    res.json(studentData);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const studentData = req.body;
    
    // Generate admission number
    const admissionNumber = 'ADM' + Date.now().toString().slice(-6);
    
    const newStudent = await db.insert(students).values({
      admission_number: admissionNumber,
      first_name: studentData.firstName,
      last_name: studentData.lastName,
      email: studentData.email,
      phone: studentData.phone,
      gender: studentData.gender,
      state_of_origin: studentData.stateOfOrigin,
      address: studentData.address,
      parent_guardian_name: studentData.parentGuardianName,
      parent_guardian_relationship: studentData.parentGuardianRelationship,
      parent_guardian_phone: studentData.parentGuardianPhone,
      class_id: studentData.classId,
      admission_date: studentData.admissionDate,
      date_of_birth: studentData.dateOfBirth,
      is_active: true,
      school_id: 1 // Default school ID
    }).returning();
    
    // Send admission confirmation email to parent
    const emailTemplate = emailTemplates.newStudent({
      ...newStudent[0],
      admissionNumber: admissionNumber,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      parentGuardianName: studentData.parentGuardianName,
      parentGuardianPhone: studentData.parentGuardianPhone,
      admissionDate: studentData.admissionDate
    });
    
    await sendEmailNotification(studentData.parentGuardianPhone, emailTemplate.subject, emailTemplate.html);
    
    res.json(newStudent[0]);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Classes
app.get('/api/classes', authenticateToken, async (req, res) => {
  try {
    const classData = await db.select({
      id: classes.id,
      name: classes.name,
      level: classes.level,
      arm: classes.arm,
      capacity: classes.capacity,
      currentEnrollment: classes.current_enrollment,
      room: classes.room,
      academicYearId: classes.academic_year_id,
      termId: classes.term_id
    }).from(classes);
    
    res.json(classData);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Results
app.get('/api/results', authenticateToken, async (req, res) => {
  try {
    const resultData = await db.select().from(results);
    res.json(resultData);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Academic Years and Terms
app.get('/api/academic-years', authenticateToken, async (req, res) => {
  try {
    const academicData = await db.select().from(academicYears);
    res.json(academicData);
  } catch (error) {
    console.error('Error fetching academic years:', error);
    res.status(500).json({ error: 'Failed to fetch academic years' });
  }
});

app.get('/api/school-terms', authenticateToken, async (req, res) => {
  try {
    const termData = await db.select().from(schoolTerms);
    res.json(termData);
  } catch (error) {
    console.error('Error fetching school terms:', error);
    res.status(500).json({ error: 'Failed to fetch school terms' });
  }
});

// Email endpoints
app.post('/api/email/send-notification', authenticateToken, async (req, res) => {
  try {
    const { recipient, subject, content, attachments } = req.body;
    
    const result = await sendEmailNotification(recipient, subject, content, attachments);
    
    if (result.success) {
      res.json({ 
        success: true, 
        messageId: result.messageId,
        message: 'Email sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.post('/api/email/send-result-notification', authenticateToken, async (req, res) => {
  try {
    const { studentId, resultData } = req.body;
    
    // Get student details
    const studentRecords = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    
    if (!studentRecords || studentRecords.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const student = studentRecords[0];
    
    // Send result notification
    const emailTemplate = emailTemplates.resultPublished(
      {
        firstName: student.first_name,
        lastName: student.last_name,
        admissionNumber: student.admission_number,
        className: resultData.className
      },
      resultData
    );
    
    const result = await sendEmailNotification(
      student.parent_guardian_phone, 
      emailTemplate.subject, 
      emailTemplate.html
    );
    
    if (result.success) {
      res.json({ 
        success: true, 
        messageId: result.messageId,
        message: 'Result notification sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error sending result notification:', error);
    res.status(500).json({ error: 'Failed to send result notification' });
  }
});

app.post('/api/email/send-fee-reminder', authenticateToken, async (req, res) => {
  try {
    const { studentId, feeData } = req.body;
    
    // Get student details
    const studentRecords = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    
    if (!studentRecords || studentRecords.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const student = studentRecords[0];
    
    // Send fee reminder
    const emailTemplate = emailTemplates.feeReminder(
      {
        firstName: student.first_name,
        lastName: student.last_name,
        admissionNumber: student.admission_number,
        className: feeData.className
      },
      feeData
    );
    
    const result = await sendEmailNotification(
      student.parent_guardian_phone, 
      emailTemplate.subject, 
      emailTemplate.html
    );
    
    if (result.success) {
      res.json({ 
        success: true, 
        messageId: result.messageId,
        message: 'Fee reminder sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error sending fee reminder:', error);
    res.status(500).json({ error: 'Failed to send fee reminder' });
  }
});

app.post('/api/email/broadcast', authenticateToken, async (req, res) => {
  try {
    const { recipients, subject, content, attachments } = req.body;
    
    const results = [];
    
    for (const recipient of recipients) {
      const result = await sendEmailNotification(recipient, subject, content, attachments);
      results.push({
        recipient,
        success: result.success,
        messageId: result.success ? result.messageId : null,
        error: result.success ? null : result.error
      });
    }
    
    const successCount = results.filter(r => r.success).length;
    
    res.json({ 
      success: true, 
      totalSent: successCount,
      totalFailed: recipients.length - successCount,
      results: results,
      message: `Email broadcast completed: ${successCount}/${recipients.length} sent successfully` 
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ error: 'Failed to send broadcast' });
  }
});

// ==================== Settings & Profile Endpoints ====================

// Change password endpoint
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user from database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare current password
    const passwordMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get school settings endpoint
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.school_id || 1;

    const schoolSettings = await db.select().from(settings)
      .where(eq(settings.school_id, schoolId))
      .limit(1);

    if (schoolSettings && schoolSettings.length > 0) {
      res.json(schoolSettings[0]);
    } else {
      // Return default settings if none exist
      res.json({
        school_id: schoolId,
        principal_name: '',
        principal_title: 'Principal',
        proprietress_name: '',
        proprietress_title: 'Proprietress',
        school_motto: 'Excellence in Education Since 2009',
        result_header: 'FOLUSHO VICTORY SCHOOLS',
        result_footer: 'Approved by the Ministry of Education',
        show_grades: true,
        show_positions: true,
        show_remarks: true
      });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update school settings endpoint
app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.school_id || 1;
    console.log('Updating settings for school_id:', schoolId);
    const {
      principal_name,
      principal_title,
      proprietress_name,
      proprietress_title,
      school_motto,
      result_header,
      result_footer,
      show_grades,
      show_positions,
      show_remarks,
      school_email,
      school_phone,
      school_address
    } = req.body;

    // Build update object with only defined fields
    const updateData = {};
    if (principal_name !== undefined) updateData.principal_name = principal_name;
    if (principal_title !== undefined) updateData.principal_title = principal_title;
    if (proprietress_name !== undefined) updateData.proprietress_name = proprietress_name;
    if (proprietress_title !== undefined) updateData.proprietress_title = proprietress_title;
    if (school_motto !== undefined) updateData.school_motto = school_motto;
    if (result_header !== undefined) updateData.result_header = result_header;
    if (result_footer !== undefined) updateData.result_footer = result_footer;
    if (show_grades !== undefined) updateData.show_grades = show_grades;
    if (show_positions !== undefined) updateData.show_positions = show_positions;
    if (show_remarks !== undefined) updateData.show_remarks = show_remarks;
    if (school_email !== undefined) updateData.school_email = school_email;
    if (school_phone !== undefined) updateData.school_phone = school_phone;
    if (school_address !== undefined) updateData.school_address = school_address;
    
    updateData.updated_at = new Date();

    // Check if settings exist
    const existingSettings = await db.select().from(settings)
      .where(eq(settings.school_id, schoolId))
      .limit(1);

    console.log('Existing settings found:', existingSettings?.length || 0);

    if (existingSettings && existingSettings.length > 0) {
      // Update existing settings
      console.log('Updating existing settings record');
      await db.update(settings)
        .set(updateData)
        .where(eq(settings.school_id, schoolId));
    } else {
      // Create new settings with required fields
      console.log('Creating new settings record');
      const insertData = {
        school_id: schoolId,
        ...updateData
      };
      await db.insert(settings).values(insertData);
    }

    console.log('Settings save completed successfully');
    res.json({ 
      success: true, 
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Settings update error:', error);
    console.error('Error details:', error.message, error.code);
    res.status(500).json({ error: `Failed to update settings: ${error.message}` });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Folusho Victory Schools API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Trust proxy for Render
app.set('trust proxy', true);

// Handle Render-specific headers
app.use((req, res, next) => {
  // Allow Render host
  if (req.headers.host && req.headers.host.includes('.onrender.com')) {
    next();
  } else {
    next();
  }
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🏫 Folusho Victory Schools API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
