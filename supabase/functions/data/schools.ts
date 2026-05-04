// Data - Schools endpoint
import { getSupabaseClient, successResponse, errorResponse, corsHeaders, handleCors } from '../_shared/utils.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const db = getSupabaseClient();

    // Get all schools
    const { data: schools, error } = await db
      .from('schools')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch schools', 500);
    }

    return successResponse({ schools: schools || [] });
  } catch (error: any) {
    console.error('List schools error:', error);
    return errorResponse(error.message || 'Failed to fetch schools', 500);
  }
});
