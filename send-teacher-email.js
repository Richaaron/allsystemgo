const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oscuovpwpzjqtaczsems.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3VvdnB3cHpqcXRhY3pzZW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NDA0ODcsImV4cCI6MjA5MzQxNjQ4N30.pgofT26v04XScBHOi_yihTHox4L5lPEUYCGDGb0cltY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const email = 'richaaronseun2020@gmail.com';
  
  // 1. Get user for password
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
    
  if (userError) {
    console.error('Error fetching user:', userError);
    return;
  }
  
  console.log('User found:', users);
  
  // 2. Get teacher details
  const { data: teachers, error: teacherError } = await supabase
    .from('teachers')
    .select('*')
    .eq('email', email)
    .single();
    
  if (teacherError) {
    console.error('Error fetching teacher:', teacherError);
    return;
  }
  
  console.log('Teacher found:', teachers);
  
  // 3. Send email using Edge Function
  const payload = {
    recipient: email,
    subject: 'Welcome to Folusho Victory Schools - Your Teacher Account Credentials',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6b46c1 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <div style="font-size: 2.5em; font-weight: bold; margin-bottom: 10px;">👑 FOLUSHO VICTORY SCHOOLS</div>
          <div style="font-size: 1.1em; opacity: 0.9;">Excellence in Education Since 2009</div>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 1.8em; color: #2c3e50; margin-bottom: 20px; text-align: center;">Welcome to the Team, ${teachers.first_name}! 🎉</h1>
          
          <p>Dear <strong style="color: #6b46c1;">${teachers.first_name} ${teachers.last_name}</strong>,</p>
          
          <p>We are absolutely delighted to welcome you to the Folusho Victory Schools family! Your expertise and passion for education will be invaluable in shaping the minds of our future leaders.</p>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b46c1;">
            <h3 style="margin-top: 0;">Your Appointment Details</h3>
            <p style="margin: 5px 0;"><strong>Position:</strong> ${teachers.title || 'Teacher'}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${teachers.email}</p>
          </div>

          <div style="background: #fff3cd; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0; margin-bottom: 20px;">🔐 Your Login Credentials</h3>
            <p style="margin-top: 0;">Please keep these credentials secure and do not share them with anyone:</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
              <span style="font-weight: bold; color: #495057;">Username:</span>
              <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">${teachers.email}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
              <span style="font-weight: bold; color: #495057;">Password:</span>
              <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">${users.password}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: white; border-radius: 5px;">
              <span style="font-weight: bold; color: #495057;">Login URL:</span>
              <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #dc3545; background: #f8d7da; padding: 5px 10px; border-radius: 3px;">https://fvsschool.netlify.app</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="https://fvsschool.netlify.app" style="display: inline-block; background: linear-gradient(135deg, #6b46c1, #2563eb); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
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
  };
  
  const response = await fetch(`${supabaseUrl}/functions/v1/email-send-notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    },
    body: JSON.stringify(payload)
  });
  
  const resData = await response.text();
  console.log('Email response:', resData);
}

main();
