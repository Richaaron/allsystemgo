// Email service using SMTP (Gmail or any SMTP provider)
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const SCHOOL_EMAIL = Deno.env.get('SMTP_USER') || 'folushovictoryschool@gmail.com';
const SMTP_HOST = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587');
const SMTP_USER = Deno.env.get('SMTP_USER') || 'folushovictoryschool@gmail.com';
const SMTP_PASS = Deno.env.get('SMTP_PASS') || '';

export async function sendEmail(to: string, subject: string, html: string) {
  // Allow failing gracefully if email not configured
  if (!SMTP_PASS) {
    console.warn('⚠️ Email credentials not configured. Email not sent to:', to);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const client = new SMTPClient({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USER,
      password: SMTP_PASS,
      tls: true
    });

    await client.connect();

    await client.send({
      from: `Folusho Victory Schools <${SCHOOL_EMAIL}>`,
      to: to,
      subject: subject,
      content: html,
      mimeType: 'text/html'
    });

    await client.close();

    console.log(`📧 Email sent to ${to}: ${subject}`);
    return { success: true, messageId: `email-${Date.now()}` };
  } catch (error: any) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
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
  })
};
