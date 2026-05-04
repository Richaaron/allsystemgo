// Teachers - List endpoint
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

    // Get all teachers
    const { data: teachers, error } = await db
      .from('teachers')
      .select('*')
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch teachers', 500);
    }

    return successResponse({ teachers: teachers || [] });
  } catch (error: any) {
    console.error('List teachers error:', error);
    return errorResponse(error.message || 'Failed to fetch teachers', 500);
  }
});
