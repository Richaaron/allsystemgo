// Data - School Terms endpoint
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

    // Get all school terms
    const { data: schoolTerms, error } = await db
      .from('school_terms')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch school terms', 500);
    }

    return successResponse({ schoolTerms: schoolTerms || [] });
  } catch (error: any) {
    console.error('List school terms error:', error);
    return errorResponse(error.message || 'Failed to fetch school terms', 500);
  }
});
