// Data - Academic Years endpoint
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

    // Get all academic years
    const { data: academicYears, error } = await db
      .from('academic_years')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch academic years', 500);
    }

    return successResponse({ academicYears: academicYears || [] });
  } catch (error: any) {
    console.error('List academic years error:', error);
    return errorResponse(error.message || 'Failed to fetch academic years', 500);
  }
});
