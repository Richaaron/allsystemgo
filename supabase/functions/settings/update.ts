// Settings - Update endpoint
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

    const updates = await req.json();

    if (!updates || Object.keys(updates).length === 0) {
      return errorResponse('No updates provided', 400);
    }

    const db = getSupabaseClient();
    const results = [];

    // Update each setting
    for (const [key, value] of Object.entries(updates)) {
      const { error: upsertError } = await db
        .from('settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (upsertError) {
        console.error(`Update error for ${key}:`, upsertError);
      }
      results.push({ key, success: !upsertError });
    }

    return successResponse({
      success: true,
      message: 'Settings updated successfully',
      results
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return errorResponse(error.message || 'Failed to update settings', 500);
  }
});
