// Email Notification Service
// Uses EmailJS REST API to send emails directly from the browser
// No backend server required!

// ============================================
// SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an Email Service (Gmail, Outlook, etc.)
// 3. Create an Email Template with these variables:
//    - {{to_name}}, {{to_email}}, {{username}}, {{password}}
//    - {{school_name}}, {{school_email}}, {{staff_id}}, {{department}}
// 4. Copy your Service ID, Template ID, and Public Key
// 5. Update the values below
// ============================================

const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY'
};

const isEmailConfigured = () => {
  return EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
         EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID' &&
         EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY';
};

export const emailNotificationService = {

  async sendTeacherWelcomeEmail(teacherData) {
    try {
      console.log('Preparing teacher welcome email for:', teacherData.email);

      if (!isEmailConfigured()) {
        console.warn('EmailJS not configured. Skipping email send.');
        console.warn('To enable emails, sign up at https://www.emailjs.com/');
        return {
          success: false,
          message: 'Email service not configured. Credentials shown in alert only.'
        };
      }

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: EMAILJS_CONFIG.serviceId,
          template_id: EMAILJS_CONFIG.templateId,
          user_id: EMAILJS_CONFIG.publicKey,
          template_params: {
            to_name: teacherData.firstName + ' ' + teacherData.lastName,
            to_email: teacherData.email,
            username: teacherData.username,
            password: teacherData.password,
            staff_id: teacherData.staffId,
            department: teacherData.department,
            school_name: 'Folusho Victory Schools',
            reply_to: 'folushovictoryschool@gmail.com'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('EmailJS error: ' + errorText);
      }

      console.log('Teacher welcome email sent to:', teacherData.email);
      return { success: true, message: 'Welcome email sent successfully' };

    } catch (error) {
      console.error('Failed to send teacher welcome email:', error);
      return {
        success: false,
        message: 'Failed to send email: ' + error.message
      };
    }
  },

  isConfigured() {
    return isEmailConfigured();
  },

  getSetupInstructions() {
    return {
      configured: isEmailConfigured(),
      instructions: 'Sign up at https://www.emailjs.com/ to enable email sending'
    };
  }
};

export default emailNotificationService;
