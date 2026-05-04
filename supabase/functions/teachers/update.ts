// Teachers - Update endpoint
import { getSupabaseClient, authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from '../_shared/utils.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'PUT') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Authenticate user
    authenticateRequest(req);

    // Extract ID from URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const teacherId = pathParts[pathParts.length - 1];

    if (!teacherId) {
      return errorResponse('Teacher ID required', 400);
    }

    const updateData = await req.json();
    const db = getSupabaseClient();

    // Update teacher
    const { data: updatedTeacher, error: updateError } = await db
      .from('teachers')
      .update(updateData)
      .eq('id', parseInt(teacherId))
      .select();

    if (updateError) {
      console.error('Update error:', updateError);
      return errorResponse('Failed to update teacher', 500);
    }

    return successResponse({ teacher: updatedTeacher?.[0] });
  } catch (error: any) {
    console.error('Update teacher error:', error);
    return errorResponse(error.message || 'Failed to update teacher', 500);
  }
});
