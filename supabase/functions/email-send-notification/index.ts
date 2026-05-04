// Email - Send Notification endpoint
import { authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from './utils.ts';
import { sendEmail } from './email.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Authenticate user
    authenticateRequest(req);

    const { recipient, subject, content, attachments } = await req.json();

    if (!recipient || !subject || !content) {
      return errorResponse('Recipient, subject, and content required', 400);
    }

    const result = await sendEmail(recipient, subject, content);
    return successResponse(result);
  } catch (error: any) {
    console.error('Send email error:', error);
    return errorResponse(error.message || 'Failed to send email', 500);
  }
});
