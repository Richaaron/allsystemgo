// Students - Create endpoint
import { getSupabaseClient, authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from '../_shared/utils.ts';

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

    const studentData = await req.json();

    if (!studentData.email || !studentData.first_name || !studentData.last_name) {
      return errorResponse('Missing required fields', 400);
    }

    const db = getSupabaseClient();

    // Insert student
    const { data: insertedStudent, error: insertError } = await db
      .from('students')
      .insert([{
        admission_number: studentData.admission_number,
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        email: studentData.email,
        phone: studentData.phone,
        date_of_birth: studentData.date_of_birth,
        gender: studentData.gender,
        class_id: studentData.class_id,
        school_id: studentData.school_id || 1
      }])
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return errorResponse('Failed to create student', 500);
    }

    return successResponse({ student: insertedStudent?.[0] }, 201);
  } catch (error: any) {
    console.error('Create student error:', error);
    return errorResponse(error.message || 'Failed to create student', 500);
  }
});
