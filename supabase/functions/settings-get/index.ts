// Settings - Get endpoint
import { getSupabaseClient, authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from './utils.ts';

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

    // Get all settings
    const { data: settings, error } = await db
      .from('settings')
      .select('*');

    if (error) {
      console.error('Database error:', error);
      return errorResponse('Failed to fetch settings', 500);
    }

    // Convert array to object for easier frontend access
    const settingsObj: any = {};
    settings?.forEach((setting: any) => {
      settingsObj[setting.key] = setting.value;
    });

    return successResponse({ settings: settingsObj });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return errorResponse(error.message || 'Failed to fetch settings', 500);
  }
});
