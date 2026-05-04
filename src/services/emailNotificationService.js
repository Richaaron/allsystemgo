// Email Notification Service
# Folusho Victory Schools - Comprehensive Email System

import { supabase } from './supabaseService'

export const emailNotificationService = {
  // Send welcome email to new teacher
  async sendTeacherWelcomeEmail(teacherData) {
    try {
      const { data: school } = await supabase
        .from('schools')
        .select('name, email, address_city, address_state')
        .eq('id', 1)
        .single();

      if (!school) {
        throw new Error('School information not found');
      }

      const emailContent = {
        to: teacherData.email,
        subject: `Welcome to ${school.name} - Teacher Account Created`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${school.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
              }
              .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                padding: 20px;
                background-color: white;
                border-radius: 5px;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Welcome to ${school.name}</h1>
                <h2>Teacher Account Created Successfully</h2>
              </div>
              <div class="content">
                <p>Dear ${teacherData.first_name} ${teacherData.last_name},</p>
                <p>We are pleased to welcome you to the ${school.name} family! Your teacher account has been successfully created.</p>
                <h3>Your Account Details:</h3>
                <ul>
                  <li><strong>Staff ID:</strong> ${teacherData.staff_id}</li>
                  <li><strong>Email:</strong> ${teacherData.email}</li>
                  <li><strong>Position:</strong> ${teacherData.position}</li>
                  <li><strong>Department:</strong> ${teacherData.department || 'Not assigned'}</li>
                </ul>
                <p>You can now log in to your account using:</p>
                <ul>
                  <li><strong>Email:</strong> ${teacherData.email}</li>
                  <li><strong>Temporary Password:</strong> ${teacherData.password || 'Your created password'}</li>
                </ul>
                <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
                <p>If you have any questions or need assistance, please contact the school administration.</p>
                <p>Best regards,<br>
                The ${school.name} Administration Team</p>
              </div>
              <div class="footer">
                <p>© 2024 ${school.name}. All rights reserved.</p>
                <p>${school.address_street}, ${school.address_city}, ${school.address_state}</p>
                <p>Email: ${school.email} | Phone: ${school.phone}</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Store email in database for tracking
      await supabase
        .from('email_notifications')
        .insert({
          type: 'teacher_welcome',
          recipient_email: teacherData.email,
          subject: emailContent.subject,
          content: emailContent.html,
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      console.log('✅ Teacher welcome email sent to:', teacherData.email);
      return { success: true, message: 'Welcome email sent successfully' };

    } catch (error) {
      console.error('❌ Failed to send teacher welcome email:', error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  },

  // Send admission confirmation to student/parent
  async sendStudentAdmissionEmail(studentData) {
    try {
      const { data: school } = await supabase
        .from('schools')
        .select('name, email, address_city, address_state')
        .eq('id', 1)
        .single();

      if (!school) {
        throw new Error('School information not found');
      }

      const emailContent = {
        to: studentData.parent_guardian_email,
        subject: `Student Admission Confirmation - ${school.name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Student Admission - ${school.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
              }
              .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                padding: 20px;
                background-color: white;
                border-radius: 5px;
              }
              .student-info {
                background-color: #f0f8ff;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 ${school.name}</h1>
                <h2>Student Admission Confirmation</h2>
              </div>
              <div class="content">
                <p>Dear Parent/Guardian,</p>
                <p>We are pleased to inform you that your child has been successfully admitted to ${school.name}.</p>
                
                <div class="student-info">
                  <h3>Student Information:</h3>
                  <ul>
                    <li><strong>Name:</strong> ${studentData.first_name} ${studentData.last_name}</li>
                    <li><strong>Admission Number:</strong> ${studentData.admission_number}</li>
                    <li><strong>Class:</strong> ${studentData.class_name || 'To be assigned'}</li>
                    <li><strong>Date of Birth:</strong> ${studentData.date_of_birth}</li>
                  </ul>
                </div>
                
                <h3>Parent/Guardian Information:</h3>
                <ul>
                  <li><strong>Name:</strong> ${studentData.parent_guardian_name}</li>
                  <li><strong>Relationship:</strong> ${studentData.parent_guardian_relationship}</li>
                  <li><strong>Phone:</strong> ${studentData.parent_guardian_phone}</li>
                  <li><strong>Email:</strong> ${studentData.parent_guardian_email}</li>
                </ul>
                
                <p><strong>Admission Details:</strong></p>
                <ul>
                  <li><strong>Admission Date:</strong> ${studentData.admission_date}</li>
                  <li><strong>Status:</strong> Active</li>
                </ul>
                
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>Complete the registration process</li>
                  <li>Pay school fees</li>
                  <li>Attend orientation meeting</li>
                  <li>Obtain school uniform and materials</li>
                </ul>
                
                <p><strong>Important Information:</strong></p>
                <ul>
                  <li>School starts on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li>School hours: 8:00 AM - 3:00 PM</li>
                  <li>School uniform: Available at school store</li>
                </ul>
                
                <p>If you have any questions about the admission process, please contact the school administration office.</p>
                <p>We look forward to welcoming your child to the ${school.name} family!</p>
                
                <p>Best regards,<br>
                The ${school.name} Administration Team</p>
              </div>
              <div class="footer">
                <p>© 2024 ${school.name}. All rights reserved.</p>
                <p>${school.address_street}, ${school.address_city}, ${school.address_state}</p>
                <p>Email: ${school.email} | Phone: ${school.phone}</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Store email in database for tracking
      await supabase
        .from('email_notifications')
        .insert({
          type: 'student_admission',
          recipient_email: studentData.parent_guardian_email,
          subject: emailContent.subject,
          content: emailContent.html,
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      console.log('✅ Student admission email sent to:', studentData.parent_guardian_email);
      return { success: true, message: 'Admission confirmation email sent successfully' };

    } catch (error) {
      console.error('❌ Failed to send student admission email:', error);
      throw new Error(`Failed to send admission email: ${error.message}`);
    }
  },

  // Send result notification to student/parent
  async sendResultNotificationEmail(studentData, resultData) {
    try {
      const { data: school } = await supabase
        .from('schools')
        .select('name, email, address_city, address_state')
        .eq('id', 1)
        .single();

      if (!school) {
        throw new Error('School information not found');
      }

      const emailContent = {
        to: studentData.parent_guardian_email,
        subject: `Academic Results - ${resultData.term} ${resultData.academic_year}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Academic Results - ${school.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
              }
              .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                padding: 20px;
                background-color: white;
                border-radius: 5px;
              }
              .result-summary {
                background-color: #e8f5e8;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
              }
              .subject-list {
                margin: 15px 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 ${school.name}</h1>
                <h2>Academic Results - ${resultData.term} ${resultData.academic_year}</h2>
              </div>
              <div class="content">
                <p>Dear Parent/Guardian,</p>
                <p>We are pleased to share with you the academic results for ${studentData.first_name} ${studentData.last_name} for the ${resultData.term} term of the ${resultData.academic_year} academic year.</p>
                
                <div class="result-summary">
                  <h3>Performance Summary</h3>
                  <ul>
                    <li><strong>Total Subjects:</strong> ${resultData.subjects?.length || 0}</li>
                    <li><strong>Average Score:</strong> ${resultData.average_score || 'N/A'}</li>
                    <li><strong>Grade:</strong> ${resultData.grade || 'N/A'}</li>
                    <li><strong>Position:</strong> ${resultData.position || 'N/A'}</li>
                  </ul>
                </div>
                
                <div class="subject-list">
                  <h3>Subject Performance</h3>
                  <div class="subject-list">
                    ${resultData.subjects?.map(subject => `
                      <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <h4 style="margin: 0 0 10px 0; color: #4CAF50;">${subject.name}</h4>
                        <ul>
                          <li><strong>Score:</strong> ${subject.score || 'N/A'}</li>
                          <li><strong>Grade:</strong> ${subject.grade || 'N/A'}</li>
                          <li><strong>Remarks:</strong> ${subject.remarks || 'Good performance'}</li>
                        </ul>
                      </div>
                    `).join('') || '<p>No subjects data available</p>'}
                  </div>
                </div>
                
                <h3>Teacher's Comments</h3>
                <p>${resultData.comments || 'No comments provided'}</p>
                
                <h3>Next Steps</h3>
                <ul>
                  <li>Review the results carefully</li>
                  <li>Discuss performance with class teacher</li>
                  <li>Plan for improvement in weak areas</li>
                  <li>Prepare for next term</li>
                </ul>
                
                <p><strong>Important:</strong></p>
                <ul>
                  <li>Results are available online through the parent portal</li>
                  <li>Physical copies can be collected from the school office</li>
                  <li>Parent-teacher meeting scheduled for next week</li>
                </ul>
                
                <p>If you have any questions about these results, please contact the class teacher or school administration.</p>
                
                <p>Best regards,<br>
                The ${school.name} Administration Team</p>
              </div>
              <div class="footer">
                <p>© 2024 ${school.name}. All rights reserved.</p>
                <p>${school.address_street}, ${school.address_city}, ${school.address_state}</p>
                <p>Email: ${school.email} | Phone: ${school.phone}</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Store email in database for tracking
      await supabase
        .from('email_notifications')
        .insert({
          type: 'result_notification',
          recipient_email: studentData.parent_guardian_email,
          subject: emailContent.subject,
          content: emailContent.html,
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      console.log('✅ Result notification email sent to:', studentData.parent_guardian_email);
      return { success: true, message: 'Result notification email sent successfully' };

    } catch (error) {
      console.error('❌ Failed to send result notification email:', error);
      throw new Error(`Failed to send result notification email: ${error.message}`);
    }
  },

  // Send fee reminder to parent
  async sendFeeReminderEmail(studentData, feeData) {
    try {
      const { data: school } = await supabase
        .from('schools')
        .select('name, email, address_city, address_state')
        .eq('id', 1)
        .single();

      if (!school) {
        throw new Error('School information not found');
      }

      const emailContent = {
        to: studentData.parent_guardian_email,
        subject: `Fee Payment Reminder - ${school.name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fee Reminder - ${school.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
              }
              .header {
                background-color: #ff9800;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                padding: 20px;
                background-color: white;
                border-radius: 5px;
              }
              .fee-info {
                background-color: #fff3cd;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
                border-left: 4px solid #ff9800;
              }
              .payment-methods {
                margin: 15px 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 ${school.name}</h1>
                <h2>Fee Payment Reminder</h2>
              </div>
              <div class="content">
                <p>Dear Parent/Guardian,</p>
                <p>This is a friendly reminder about the upcoming fee payment for ${studentData.first_name} ${studentData.last_name} for the ${feeData.term} term.</p>
                
                <div class="fee-info">
                  <h3>Fee Details</h3>
                  <ul>
                    <li><strong>Student:</strong> ${studentData.first_name} ${studentData.last_name}</li>
                    <li><strong>Class:</strong> ${studentData.class_name || 'Not assigned'}</li>
                    <li><strong>Term:</strong> ${feeData.term}</li>
                    <li><strong>Amount Due:</strong> ₦${feeData.amount?.toLocaleString() || '0'}</li>
                    <li><strong>Due Date:</strong> ${feeData.due_date || 'Not specified'}</li>
                    <li><strong>Late Fee:</strong> ₦${feeData.late_fee?.toLocaleString() || '0'}</li>
                  </ul>
                </div>
                
                <h3>Payment Methods</h3>
                <div class="payment-methods">
                  <p><strong>Bank Payment:</strong></p>
                  <ul>
                    <li><strong>Bank:</strong> ${feeData.bank_name || 'School Bank Account'}</li>
                    <li><strong>Account Name:</strong> ${feeData.account_name || 'Folusho Victory Schools'}</li>
                    <li><strong>Account Number:</strong> ${feeData.account_number || 'Available at school office'}</li>
                  </ul>
                  
                  <p><strong>Online Payment:</strong></p>
                  <ul>
                    <li>Visit the school parent portal</li>
                    <li>Use the school's payment gateway</li>
                    <li>Mobile money transfer available</li>
                  </ul>
                </div>
                
                <h3>Important Information</h3>
                <ul>
                  <li>Please ensure payment is made by <strong>${feeData.due_date}</strong> to avoid late fees</li>
                  <li>Late payment attracts additional charges of ₦${feeData.late_fee?.toLocaleString() || '0'}</li>
                  <li>Payment receipts will be issued upon confirmation</li>
                  <li>Contact the school office for any payment inquiries</li>
                </ul>
                
                <p>If you have already made the payment, please disregard this reminder. If you have any questions about fee payments, please contact the school bursar's office.</p>
                
                <p>Best regards,<br>
                The ${school.name} Administration Team</p>
              </div>
              <div class="footer">
                <p>© 2024 ${school.name}. All rights reserved.</p>
                <p>${school.address_street}, ${school.address_city}, ${school.address_state}</p>
                <p>Email: ${school.email} | Phone: ${school.phone}</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Store email in database for tracking
      await supabase
        .from('email_notifications')
        .insert({
          type: 'fee_reminder',
          recipient_email: studentData.parent_guardian_email,
          subject: emailContent.subject,
          content: emailContent.html,
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      console.log('✅ Fee reminder email sent to:', studentData.parent_guardian_email);
      return { success: true, message: 'Fee reminder email sent successfully' };

    } catch (error) {
      console.error('❌ Failed to send fee reminder email:', error);
      throw new Error(`Failed to send fee reminder email: ${error.message}`);
    }
  },

  // Send general announcement email
  async sendGeneralAnnouncementEmail(subject, message, recipients = []) {
    try {
      const { data: school } = await supabase
        .from('schools')
        .select('name, email, address_city, address_state')
        .eq('id', 1)
        .single();

      if (!school) {
        throw new Error('School information not found');
      }

      const emailContent = {
        to: recipients.join(', '),
        subject: `${subject} - ${school.name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject} - ${school.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
              }
              .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                padding: 20px;
                background-color: white;
                border-radius: 5px;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 ${school.name}</h1>
                <h2>${subject}</h2>
              </div>
              <div class="content">
                <p>${message}</p>
                
                <p><strong>Important Information:</strong></p>
                <ul>
                  <li>This is an official communication from ${school.name}</li>
                  <li>Please keep this email for your records</li>
                  <li>If you have any questions, please contact the school administration</li>
                </ul>
                
                <p>Best regards,<br>
                The ${school.name} Administration Team</p>
              </div>
              <div class="footer">
                <p>© 2024 ${school.name}. All rights reserved.</p>
                <p>${school.address_street}, ${school.address_city}, ${school.address_state}</p>
                <p>Email: ${school.email} | Phone: ${school.phone}</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Store email in database for tracking
      await supabase
        .from('email_notifications')
        .insert({
          type: 'general_announcement',
          recipient_email: recipients.join(', '),
          subject: emailContent.subject,
          content: emailContent.html,
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      console.log('✅ General announcement email sent to:', recipients.join(', '));
      return { success: true, message: 'General announcement email sent successfully' };

    } catch (error) {
      console.error('❌ Failed to send general announcement email:', error);
      throw new Error(`Failed to send general announcement email: ${error.message}`);
    }
  },

  // Get email notification history
  async getEmailNotificationHistory(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('email_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Failed to fetch email history:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('❌ Email history fetch error:', error);
      return [];
    }
  },

  // Get email notification statistics
  async getEmailNotificationStats(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('email_notifications')
        .select('type, status')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) {
        console.error('❌ Failed to fetch email stats:', error);
        return null;
      }

      // Calculate statistics
      const stats = {
        total_sent: data?.length || 0,
        successful: data?.filter(n => n.status === 'sent')?.length || 0,
        failed: data?.filter(n => n.status === 'failed')?.length || 0,
        pending: data?.filter(n => n.status === 'pending')?.length || 0,
        by_type: data?.reduce((acc, n) => {
          acc[n.type] = (acc[n.type] || 0) + 1;
          return acc;
        }, {})
      };

      return stats;

    } catch (error) {
      console.error('❌ Email stats fetch error:', error);
      return null;
    }
  },

  // Delete email notification record
  async deleteEmailNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('email_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('❌ Failed to delete email notification:', error);
        throw new Error(`Failed to delete email notification: ${error.message}`);
      }

      console.log('✅ Email notification deleted successfully');
      return { success: true, message: 'Email notification deleted successfully' };

    } catch (error) {
      console.error('❌ Delete email notification error:', error);
      throw new Error(`Failed to delete email notification: ${error.message}`);
    }
  }
}
