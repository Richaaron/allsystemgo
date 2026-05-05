// Email - Send Teacher Welcome Email with Credentials
import { successResponse, errorResponse, handleCors } from '../_shared/utils.ts';
import { sendEmail } from '../_shared/email.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const { firstName, lastName, email, username, password, staffId, department } = await req.json();

    if (!email || !firstName || !lastName) {
      return errorResponse('First name, last name, and email are required', 400);
    }

    const subject = '🎓 Welcome to Folusho Victory Schools - Your Login Credentials';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 32px;">🎓 Folusho Victory Schools</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Welcome to Our Team!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Dear ${firstName} ${lastName},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We are delighted to welcome you to the Folusho Victory Schools family! Your teacher account has been successfully created.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">📋 Your Account Details</h3>
            <table style="width: 100%; color: #555;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Staff ID:</td>
                <td style="padding: 8px 0;">${staffId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Department:</td>
                <td style="padding: 8px 0;">${department || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #28a745;">
            <h3 style="color: #2e7d32; margin-top: 0;">🔐 Your Login Credentials</h3>
            <p style="color: #555; margin: 5px 0;"><strong>Username:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${username}</code></p>
            <p style="color: #555; margin: 5px 0;"><strong>Password:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${password}</code></p>
            <p style="color: #e65100; font-size: 14px; margin-top: 15px;">
              <strong>Important:</strong> Please change your password after your first login for security purposes.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://fvsschool.netlify.app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
              Login to Your Account
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            If you have any questions or need assistance, please contact the school administration at 
            <a href="mailto:folushovictoryschool@gmail.com" style="color: #667eea;">folushovictoryschool@gmail.com</a>.
          </p>
          
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; color: #999; font-size: 13px;">
            <p style="margin: 5px 0;">🏫 Folusho Victory Schools</p>
            <p style="margin: 5px 0;">Excellence in Education</p>
            <p style="margin: 5px 0; font-size: 11px;">This email was sent automatically. Please do not reply.</p>
          </div>
        </div>
      </div>
    `;

    const result = await sendEmail(email, subject, html);
    return successResponse(result);
  } catch (error: any) {
    console.error('Send teacher welcome email error:', error);
    return errorResponse(error.message || 'Failed to send welcome email', 500);
  }
});
