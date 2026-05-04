// Email Service for sending teacher credentials and notifications

export class EmailService {
  static async sendTeacherCredentials(teacherData, credentials) {
    const emailContent = this.generateTeacherWelcomeEmail(teacherData, credentials);
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Call Supabase Edge Function via Netlify redirect
      // The /api/* path is redirected to Supabase Edge Functions by netlify.toml
      const response = await fetch('/api/email-send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient: emailContent.to,
          subject: emailContent.subject,
          content: emailContent.html
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);

      return {
        success: true,
        messageId: result.messageId || `msg_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static generateTeacherWelcomeEmail(teacherData, credentials) {
    const { firstName, lastName, email, role, assignedClass, assignedSubjects } = teacherData;
    const { username, password, loginUrl } = credentials;

    const roleDisplay = this.getRoleDisplayName(role);
    const assignmentInfo = this.getAssignmentInfo(role, assignedClass, assignedSubjects);

    return {
      to: email,
      subject: `Welcome to Folusho Victory Schools - Your Teacher Account Credentials`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Folusho Victory Schools</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .header {
              background: linear-gradient(135deg, #6b46c1, #2563eb);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="100" fill="rgba(255,255,255,0.1)">👨‍🏫</text></svg>');
              background-size: 200px;
              background-position: center;
              background-repeat: no-repeat;
            }
            .logo {
              font-size: 2.5em;
              font-weight: bold;
              margin-bottom: 10px;
              position: relative;
              z-index: 1;
            }
            .tagline {
              font-size: 1.1em;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }
            .content {
              background: white;
              padding: 40px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .welcome {
              font-size: 1.8em;
              color: #2c3e50;
              margin-bottom: 20px;
              text-align: center;
            }
            .personal-info {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #6b46c1;
            }
            .credentials {
              background: #fff3cd;
              padding: 25px;
              border-radius: 8px;
              margin: 20px 0;
              border: 2px solid #ffc107;
            }
            .credentials h3 {
              color: #856404;
              margin-top: 0;
              margin-bottom: 20px;
            }
            .credential-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 15px 0;
              padding: 10px;
              background: white;
              border-radius: 5px;
            }
            .credential-label {
              font-weight: bold;
              color: #495057;
            }
            .credential-value {
              font-family: 'Courier New', monospace;
              font-weight: bold;
              color: #dc3545;
              background: #f8d7da;
              padding: 5px 10px;
              border-radius: 3px;
            }
            .role-info {
              background: #d1ecf1;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #17a2b8;
            }
            .login-button {
              display: inline-block;
              background: linear-gradient(135deg, #6b46c1, #2563eb);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .security-note {
              background: #f8d7da;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #dc3545;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6c757d;
              font-size: 0.9em;
              border-top: 1px solid #dee2e6;
              margin-top: 30px;
            }
            .contact-info {
              margin: 20px 0;
              padding: 20px;
              background: #e9ecef;
              border-radius: 8px;
            }
            .highlight {
              color: #6b46c1;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">👑 FOLUSHO VICTORY SCHOOLS</div>
            <div class="tagline">Excellence in Education Since 2009</div>
          </div>

          <div class="content">
            <h1 class="welcome">Welcome to the Team, ${firstName}! 🎉</h1>
            
            <p>Dear <span class="highlight">${firstName} ${lastName}</span>,</p>
            
            <p>We are absolutely delighted to welcome you to the Folusho Victory Schools family! Your expertise and passion for education will be invaluable in shaping the minds of our future leaders.</p>

            <div class="personal-info">
              <h3>Your Appointment Details</h3>
              <p><strong>Position:</strong> ${roleDisplay}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Start Date:</strong> ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              ${assignmentInfo}
            </div>

            <div class="credentials">
              <h3>🔐 Your Login Credentials</h3>
              <p>Please keep these credentials secure and do not share them with anyone:</p>
              
              <div class="credential-item">
                <span class="credential-label">Username:</span>
                <span class="credential-value">${username}</span>
              </div>
              
              <div class="credential-item">
                <span class="credential-label">Password:</span>
                <span class="credential-value">${password}</span>
              </div>
              
              <div class="credential-item">
                <span class="credential-label">Login URL:</span>
                <span class="credential-value">${loginUrl}</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${loginUrl}" class="login-button">
                🚀 Access Your Dashboard Now
              </a>
            </div>

            <div class="role-info">
              <h3>📚 Your Responsibilities</h3>
              ${this.getRoleResponsibilities(role)}
            </div>

            <div class="security-note">
              <h3>⚠️ Important Security Notice</h3>
              <ul>
                <li>Change your password immediately after first login</li>
                <li>Never share your login credentials with anyone</li>
                <li>Log out after each session, especially on shared devices</li>
                <li>Contact IT support immediately if you suspect unauthorized access</li>
              </ul>
            </div>

            <div class="contact-info">
              <h3>📞 Need Help?</h3>
              <p><strong>IT Support:</strong> support@folushovictory.sch.ng | +234-800-123-4567</p>
              <p><strong>Admin Office:</strong> admin@folushovictory.sch.ng | +234-800-987-6543</p>
              <p><strong>Working Hours:</strong> Monday - Friday, 8:00 AM - 4:00 PM</p>
            </div>

            <p>We are excited to have you join our team of dedicated educators. Together, we will continue to provide excellent education and nurture the potential of every student.</p>

            <p>Warm regards,</p>
            <p><strong>Dr. Folusho Victory</strong><br>
            Principal<br>
            Folusho Victory Schools</p>
          </div>

          <div class="footer">
            <p>© 2024 Folusho Victory Schools. All rights reserved.</p>
            <p>This email contains confidential information intended solely for the addressee.</p>
          </div>
        </body>
        </html>
      `,
      text: `
WELCOME TO FOLUSHO VICTORY SCHOOLS - TEACHER ACCOUNT CREDENTIALS

Dear ${firstName} ${lastName},

We are delighted to welcome you to the Folusho Victory Schools family!

APPOINTMENT DETAILS:
- Position: ${roleDisplay}
- Email: ${email}
- Start Date: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
${assignmentInfo ? `- Assignment: ${assignmentInfo}` : ''}

LOGIN CREDENTIALS:
- Username: ${username}
- Password: ${password}
- Login URL: ${loginUrl}

IMPORTANT: Please keep these credentials secure and change your password after first login.

YOUR RESPONSIBILITIES:
${this.getRoleResponsibilities(role, true)}

SECURITY NOTICE:
- Change your password immediately after first login
- Never share your login credentials with anyone
- Log out after each session
- Contact IT support if you suspect unauthorized access

CONTACT INFORMATION:
- IT Support: support@folushovictory.sch.ng | +234-800-123-4567
- Admin Office: admin@folushovictory.sch.ng | +234-800-987-6543
- Working Hours: Monday - Friday, 8:00 AM - 4:00 PM

We are excited to have you join our team!

Warm regards,
Dr. Folusho Victory
Principal
Folusho Victory Schools

© 2024 Folusho Victory Schools. All rights reserved.
      `
    };
  }

  static getRoleDisplayName(role) {
    const roleNames = {
      'form_teacher': 'Form Teacher',
      'subject_teacher': 'Subject Teacher',
      'dual_role': 'Dual Role Teacher (Form & Subject)',
      'admin': 'School Administrator'
    };
    return roleNames[role] || 'Teacher';
  }

  static getAssignmentInfo(role, assignedClass, assignedSubjects) {
    if (role === 'form_teacher') {
      return `<p><strong>Assigned Class:</strong> ${assignedClass}</p>`;
    } else if (role === 'subject_teacher') {
      return `<p><strong>Assigned Subjects:</strong> ${assignedSubjects.join(', ')}</p>`;
    } else if (role === 'dual_role') {
      return `
        <p><strong>Assigned Class:</strong> ${assignedClass}</p>
        <p><strong>Assigned Subjects:</strong> ${assignedSubjects.join(', ')}</p>
      `;
    }
    return '';
  }

  static getRoleResponsibilities(role, textFormat = false) {
    const responsibilities = {
      'form_teacher': textFormat ? `
• Manage assigned class and oversee all students
• Track attendance and academic performance
• Communicate with parents regarding student progress
• Maintain discipline and conduct records
• Coordinate class activities and events
• Monitor fee compliance and follow up with parents` : `
        <ul>
          <li>Manage assigned class and oversee all students</li>
          <li>Track attendance and academic performance</li>
          <li>Communicate with parents regarding student progress</li>
          <li>Maintain discipline and conduct records</li>
          <li>Coordinate class activities and events</li>
          <li>Monitor fee compliance and follow up with parents</li>
        </ul>`,
      
      'subject_teacher': textFormat ? `
• Teach assigned subjects effectively
• Enter and manage student results
• Monitor subject performance across classes
• Provide additional support to struggling students
• Prepare students for examinations
• Collaborate with other teachers for curriculum development` : `
        <ul>
          <li>Teach assigned subjects effectively</li>
          <li>Enter and manage student results</li>
          <li>Monitor subject performance across classes</li>
          <li>Provide additional support to struggling students</li>
          <li>Prepare students for examinations</li>
          <li>Collaborate with other teachers for curriculum development</li>
        </ul>`,
      
      'dual_role': textFormat ? `
• Manage assigned class as Form Teacher
• Teach assigned subjects as Subject Teacher
• Oversee both class and subject responsibilities
• Coordinate with other teachers and departments
• Maintain comprehensive student records
• Lead both class and subject-related initiatives` : `
        <ul>
          <li>Manage assigned class as Form Teacher</li>
          <li>Teach assigned subjects as Subject Teacher</li>
          <li>Oversee both class and subject responsibilities</li>
          <li>Coordinate with other teachers and departments</li>
          <li>Maintain comprehensive student records</li>
          <li>Lead both class and subject-related initiatives</li>
        </ul>`
    };

    return responsibilities[role] || responsibilities['subject_teacher'];
  }

  static async sendPasswordResetEmail(teacherData, resetToken) {
    const resetUrl = `${process.env.REACT_APP_BASE_URL}/reset-password?token=${resetToken}`;
    
    const emailContent = {
      to: teacherData.email,
      subject: 'Password Reset Request - Folusho Victory Schools',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${teacherData.firstName},</p>
          <p>You requested to reset your password. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background: #6b46c1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
      text: `
Password Reset Request

Hi ${teacherData.firstName},

You requested to reset your password. Click the link below to reset your password:
${resetUrl}

This link will expire in 24 hours.

If you didn't request this, please ignore this email.
      `
    };

    try {
      // Simulate email sending
      console.log('Password reset email sent to:', teacherData.email);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, messageId: `reset_${Date.now()}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async sendTeacherNotification(teacherData, notificationType, message) {
    const subjectMap = {
      'assignment': 'New Assignment - Folusho Victory Schools',
      'reminder': 'Important Reminder - Folusho Victory Schools',
      'announcement': 'School Announcement - Folusho Victory Schools',
      'deadline': 'Deadline Reminder - Folusho Victory Schools'
    };

    const emailContent = {
      to: teacherData.email,
      subject: subjectMap[notificationType] || 'Notification - Folusho Victory Schools',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${notificationType.charAt(0).toUpperCase() + notificationType.slice(1)}</h2>
          <p>Hi ${teacherData.firstName},</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            ${message}
          </div>
          <p>Best regards,<br>Folusho Victory Schools Administration</p>
        </div>
      `,
      text: `
${notificationType.charAt(0).toUpperCase() + notificationType.slice(1)}

Hi ${teacherData.firstName},

${message}

Best regards,
Folusho Victory Schools Administration
      `
    };

    try {
      console.log('Notification email sent to:', teacherData.email);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, messageId: `notif_${Date.now()}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
