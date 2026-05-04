// Students - List endpoint
import { getSupabaseClient, authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from '../_shared/utils.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Authenticate user
    authenticateRequest(req);

    const db = getSupabaseClient();

    // Get all students
    const { data: students, error } = await db
      .from('students')
      .select('*')
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch students', 500);
    }

    return successResponse({ students: students || [] });
  } catch (error: any) {
    console.error('List students error:', error);
    return errorResponse(error.message || 'Failed to fetch students', 500);
  }
});
