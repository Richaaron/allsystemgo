// Email - Broadcast endpoint
import { authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from '../_shared/utils.ts';
import { sendEmail } from '../_shared/email.ts';

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

    const { recipients, subject, content } = await req.json();

    if (!recipients || recipients.length === 0 || !subject || !content) {
      return errorResponse('Recipients, subject, and content required', 400);
    }

    const results = [];

    for (const recipient of recipients) {
      const result = await sendEmail(recipient, subject, content);
      results.push(result);
    }

    return successResponse({
      success: true,
      message: `Sent broadcast to ${results.filter(r => r.success).length} recipients`,
      results
    });
  } catch (error: any) {
    console.error('Broadcast email error:', error);
    return errorResponse(error.message || 'Failed to send broadcast', 500);
  }
});
