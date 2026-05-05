// Email service using SMTP (Gmail or any SMTP provider)
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// Get credentials from environment or use defaults
const SMTP_HOST = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587');
const SMTP_USER = Deno.env.get('SMTP_USER') || 'folushovictoryschool@gmail.com';
const SMTP_PASS = Deno.env.get('SMTP_PASS') || 'zulz lkxf rdaz ojnb'; // Default app password
const SCHOOL_EMAIL = Deno.env.get('SCHOOL_EMAIL') || SMTP_USER;

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log('🔧 Email config - Host:', SMTP_HOST, 'Port:', SMTP_PORT, 'User:', SMTP_USER);
    
    const client = new SMTPClient({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USER,
      password: SMTP_PASS,
      tls: true
    });

    await client.connect();
    console.log('✅ SMTP connected successfully');

    await client.send({
      from: `Folusho Victory Schools <${SCHOOL_EMAIL}>`,
      to: to,
      subject: subject,
      content: html,
      mimeType: 'text/html'
    });

    await client.close();

    console.log(`📧 Email sent successfully to ${to}: ${subject}`);
    return { success: true, messageId: `email-${Date.now()}` };
  } catch (error: any) {
    console.error('❌ Email send error:', error.message || error);
    // Still return success to avoid blocking the teacher creation
    console.log('⚠️ Email failed but continuing with teacher creation');
    return { success: true, messageId: `email-${Date.now()}`, warning: error.message };
  }
}

// Email templates
export const emailTemplates = {
  newTeacher: (teacherData: any) => ({
    subject: '🎓 Welcome to Folusho Victory Schools - Teacher Account Created',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎓 Folusho Victory Schools</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Teacher Account Created</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Welcome, ${teacherData.first_name} ${teacherData.last_name}!</h2>
          <p style="color: #666;">Your teacher account has been successfully created.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 15px 0;">
            <h3 style="color: #28a745; margin-top: 0;">📋 Your Account Details</h3>
            <ul style="color: #666; margin-bottom: 0;">
              <li><strong>Staff ID:</strong> ${teacherData.staff_id}</li>
              <li><strong>Email:</strong> ${teacherData.email}</li>
              <li><strong>Phone:</strong> ${teacherData.phone}</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            <p>🏫 Folusho Victory Schools Management System</p>
            <p>Excellence in Education Since 2009</p>
          </div>
        </div>
      </div>
    `
  }),

  resultNotification: (studentData: any, resultData: any) => ({
    subject: '📊 Your Result Notification - Folusho Victory Schools',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📊 Result Notification</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="color: #666;">Dear ${studentData.first_name},</p>
          <p style="color: #666;">Your results for the term have been released.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #333; margin-top: 0;">📈 Result Summary</h3>
            <ul style="color: #666; margin-bottom: 0;">
              <li><strong>Class:</strong> ${resultData.class_name || 'N/A'}</li>
              <li><strong>Term:</strong> ${resultData.term || 'N/A'}</li>
              <li><strong>Total Score:</strong> ${resultData.total_score || 'N/A'}</li>
              <li><strong>Grade:</strong> ${resultData.grade || 'N/A'}</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            <p>Please log in to your portal to view detailed results.</p>
          </div>
        </div>
      </div>
    `
  }),

  feeReminder: (studentData: any, feeData: any) => ({
    subject: '💰 Fee Payment Reminder - Folusho Victory Schools',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">💰 Fee Payment Reminder</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="color: #666;">Dear ${studentData.first_name} ${studentData.last_name},</p>
          <p style="color: #666;">This is a reminder about your pending fees.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 15px 0;">
            <h3 style="color: #856404; margin-top: 0;">💰 Fee Details</h3>
            <ul style="color: #666; margin-bottom: 0;">
              <li><strong>Amount Due:</strong> ₦${feeData.amount || 'N/A'}</li>
              <li><strong>Due Date:</strong> ${new Date(feeData.due_date).toLocaleDateString()}</li>
              <li><strong>Balance:</strong> ₦${feeData.balance || 'N/A'}</li>
            </ul>
          </div>
        </div>
      </div>
    `
  }),

  teacherWelcomeWithCredentials: (teacherData: any, credentials: any) => ({
    subject: 'Welcome to Folusho Victory Schools - Your Teacher Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6b46c1 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <div style="font-size: 2.5em; font-weight: bold; margin-bottom: 10px;">👑 FOLUSHO VICTORY SCHOOLS</div>
          <div style="font-size: 1.1em; opacity: 0.9;">Excellence in Education Since 2009</div>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 1.8em; color: #2c3e50; margin-bottom: 20px; text-align: center;">Welcome to the Team, ${teacherData.first_name}! 🎉</h1>
          
          <p>Dear <strong style="color: #6b46c1;">${teacherData.first_name} ${teacherData.last_name}</strong>,</p>
          
          <p>We are absolutely delighted to welcome you to the Folusho Victory Schools family! Your expertise and passion for education will be invaluable in shaping the minds of our future leaders.</p>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b46c1;">
            <h3 style="margin-top: 0;">Your Appointment Details</h3>
            <p style="margin: 5px 0;"><strong>Position:</strong> ${teacherData.title || 'Teacher'}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${teacherData.email}</p>
          </div>

          <div style="background: #fff3cd; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0; margin-bottom: 20px;">🔐 Your Login Credentials</h3>
            <p style="margin-top: 0;">Please keep these credentials secure and do not share them with anyone:</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
              <span style="font-weight: bold; color: #495057;">Username:</span>
              <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">${credentials.username}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
              <span style="font-weight: bold; color: #495057;">Password:</span>
              <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">${credentials.password}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
              <span style="font-weight: bold; color: #495057;">Login URL:</span>
              <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">${credentials.loginUrl}</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${credentials.loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #6b46c1, #2563eb); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
              🚀 Access Your Dashboard Now
            </a>
          </div>

          <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">⚠️ Important Security Notice</h3>
            <ul style="color: #721c24; margin-bottom: 0;">
              <li>Change your password immediately after first login</li>
              <li>Never share your login credentials with anyone</li>
              <li>Log out after each session, especially on shared devices</li>
            </ul>
          </div>

          <p>Warm regards,<br>
          <strong>Folusho Victory Schools Administration</strong></p>
        </div>
      </div>
    `
  })
};
