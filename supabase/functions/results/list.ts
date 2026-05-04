// Results - List endpoint
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

    // Get all results
    const { data: results, error } = await db
      .from('results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch results', 500);
    }

    return successResponse({ results: results || [] });
  } catch (error: any) {
    console.error('List results error:', error);
    return errorResponse(error.message || 'Failed to fetch results', 500);
  }
});
