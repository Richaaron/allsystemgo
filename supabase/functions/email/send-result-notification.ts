// Email - Send Result Notification endpoint
import { getSupabaseClient, authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from '../_shared/utils.ts';
import { sendEmail, emailTemplates } from '../_shared/email.ts';

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

    const { studentIds, resultData } = await req.json();

    if (!studentIds || studentIds.length === 0) {
      return errorResponse('Student IDs required', 400);
    }

    const db = getSupabaseClient();
    const results = [];

    for (const studentId of studentIds) {
      // Get student info
      const { data: students } = await db
        .from('students')
        .select('*')
        .eq('id', studentId)
        .limit(1);

      if (students && students.length > 0) {
        const student = students[0];
        const { subject, html } = emailTemplates.resultNotification(student, resultData);
        const result = await sendEmail(student.email, subject, html);
        results.push(result);
      }
    }

    return successResponse({
      success: true,
      message: `Sent ${results.filter(r => r.success).length} result notifications`,
      results
    });
  } catch (error: any) {
    console.error('Send result notification error:', error);
    return errorResponse(error.message || 'Failed to send notifications', 500);
  }
});
