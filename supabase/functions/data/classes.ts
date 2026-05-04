// Data - Classes endpoint
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

    // Get all classes
    const { data: classes, error } = await db
      .from('classes')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch classes', 500);
    }

    return successResponse({ classes: classes || [] });
  } catch (error: any) {
    console.error('List classes error:', error);
    return errorResponse(error.message || 'Failed to fetch classes', 500);
  }
});
