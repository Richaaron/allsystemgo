// Teachers - Create endpoint
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

    const teacherData = await req.json();

    if (!teacherData.email || !teacherData.first_name || !teacherData.last_name) {
      return errorResponse('Missing required fields', 400);
    }

    const db = getSupabaseClient();

    // Insert teacher
    const { data: insertedTeacher, error: insertError } = await db
      .from('teachers')
      .insert([{
        staff_id: teacherData.staff_id,
        first_name: teacherData.first_name,
        last_name: teacherData.last_name,
        email: teacherData.email,
        phone: teacherData.phone,
        title: teacherData.title,
        gender: teacherData.gender,
        date_of_birth: teacherData.date_of_birth,
        qualification: teacherData.qualification,
        department_id: teacherData.department_id,
        school_id: teacherData.school_id || 1
      }])
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return errorResponse('Failed to create teacher', 500);
    }

    const newTeacher = insertedTeacher?.[0];

    // Send welcome email
    if (newTeacher?.email) {
      const { subject, html } = emailTemplates.newTeacher(newTeacher);
      await sendEmail(newTeacher.email, subject, html);
    }

    return successResponse({ teacher: newTeacher }, 201);
  } catch (error: any) {
    console.error('Create teacher error:', error);
    return errorResponse(error.message || 'Failed to create teacher', 500);
  }
});
