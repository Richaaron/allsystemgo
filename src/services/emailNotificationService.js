// Email Notification Service
// Now uses Supabase Edge Functions with Gmail SMTP

import { emailService } from './supabaseEdgeFunctions';

export const emailNotificationService = {

  async sendTeacherWelcomeEmail(teacherData) {
    try {
      console.log('Preparing teacher welcome email via Supabase Edge Function for:', teacherData.email);

      const subject = 'Welcome to Folusho Victory Schools - Your Teacher Account Credentials';
      const loginUrl = window.location.origin + '/login';
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6b46c1 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <div style="font-size: 2.5em; font-weight: bold; margin-bottom: 10px;">👑 FOLUSHO VICTORY SCHOOLS</div>
            <div style="font-size: 1.1em; opacity: 0.9;">Excellence in Education Since 2009</div>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="font-size: 1.8em; color: #2c3e50; margin-bottom: 20px; text-align: center;">Welcome to the Team, ${teacherData.firstName}! 🎉</h1>
            
            <p>Dear <strong style="color: #6b46c1;">${teacherData.firstName} ${teacherData.lastName}</strong>,</p>
            
            <p>We are absolutely delighted to welcome you to the Folusho Victory Schools family! Your expertise and passion for education will be invaluable in shaping the minds of our future leaders.</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b46c1;">
              <h3 style="margin-top: 0;">Your Appointment Details</h3>
              <p style="margin: 5px 0;"><strong>Staff ID:</strong> ${teacherData.staffId || 'Pending'}</p>
              <p style="margin: 5px 0;"><strong>Department:</strong> ${teacherData.department}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${teacherData.email}</p>
            </div>

            <div style="background: #fff3cd; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #ffc107;">
              <h3 style="color: #856404; margin-top: 0; margin-bottom: 20px;">🔐 Your Login Credentials</h3>
              <p style="margin-top: 0;">Please keep these credentials secure and do not share them with anyone:</p>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
                <span style="font-weight: bold; color: #495057;">Username:</span>
                <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">${teacherData.username}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
                <span style="font-weight: bold; color: #495057;">Password:</span>
                <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">${teacherData.password}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
                <span style="font-weight: bold; color: #495057;">Login URL:</span>
                <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">${loginUrl}</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #6b46c1, #2563eb); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
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
      `;

      // Call the Supabase Edge Function to send the email using Gmail SMTP
      const result = await emailService.sendNotification(teacherData.email, subject, htmlContent);

      if (!result) {
        throw new Error('Supabase Edge Function failed to send the email.');
      }

      console.log('✅ Teacher welcome email sent successfully via Supabase to:', teacherData.email);
      return { success: true, message: 'Welcome email sent successfully' };

    } catch (error) {
      console.error('❌ Failed to send teacher welcome email:', error);
      return {
        success: false,
        message: 'Failed to send email: ' + error.message
      };
    }
  },

  async sendStudentResultEmail(studentName, parentEmail, term, overallGrade, average) {
    try {
      console.log(`Preparing result email for ${studentName} to parent email: ${parentEmail || 'placeholder@example.com'}`);
      
      const subject = `Academic Result for ${studentName} - ${term}`;
      const portalUrl = window.location.origin + '/login';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #d97706; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <div style="font-size: 2em; font-weight: bold; margin-bottom: 10px; font-family: 'Playfair Display', serif;">FOLUSHO VICTORY SCHOOLS</div>
            <div style="font-size: 1.1em; color: white;">Official Academic Report</div>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
            <p>Dear Parent/Guardian,</p>
            
            <p>We are pleased to inform you that the academic results for <strong>${studentName}</strong> for the <strong>${term}</strong> have been compiled and are now available.</p>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e3a8a;">
              <h3 style="margin-top: 0; color: #1e3a8a;">Performance Summary</h3>
              <p style="margin: 5px 0;"><strong>Overall Average:</strong> ${average}%</p>
              <p style="margin: 5px 0;"><strong>Overall Grade:</strong> <span style="color: #d97706; font-weight: bold;">${overallGrade}</span></p>
            </div>

            <p>To view the full detailed result sheet, including subject breakdowns and teacher remarks, please log in to the parent portal.</p>

            <div style="text-align: center;">
              <a href="${portalUrl}" style="display: inline-block; background: #1e3a8a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
                View Full Result Sheet
              </a>
            </div>

            <p>Thank you for partnering with us in your child's education.</p>
            
            <p>Warm regards,<br>
            <strong>Folusho Victory Schools Administration</strong></p>
          </div>
        </div>
      `;

      // Use a mock email if none provided for demonstration
      const targetEmail = parentEmail || 'parent@example.com';
      
      const result = await emailService.sendNotification(targetEmail, subject, htmlContent);

      if (!result) {
        throw new Error('Supabase Edge Function failed to send the email.');
      }

      console.log('✅ Result email sent successfully to:', targetEmail);
      return { success: true, message: 'Result email sent successfully' };

    } catch (error) {
      console.error('❌ Failed to send result email:', error);
      return {
        success: false,
        message: 'Failed to send email: ' + error.message
      };
    }
  },

  isConfigured() {
    // We are using Supabase backend now, which is assumed to be configured
    return true; 
  },

  getSetupInstructions() {
    return {
      configured: true,
      instructions: 'Email sending is securely handled by the Supabase backend via Gmail SMTP.'
    };
  }
};

export default emailNotificationService;
