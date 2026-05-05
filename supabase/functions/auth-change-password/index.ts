// Auth - Change Password endpoint
import { getSupabaseClient, authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from '../_shared/utils.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Authenticate user
    const user = authenticateRequest(req);

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return errorResponse('Current password and new password required', 400);
    }

    const db = getSupabaseClient();

    // Get current user from database
    const { data: users, error: queryError } = await db
      .from('users')
      .select('*')
      .eq('id', user.id)
      .limit(1);

    if (queryError || !users || users.length === 0) {
      return errorResponse('User not found', 404);
    }

    const userData = users[0];

    // Verify current password
    if (userData.password !== currentPassword) {
      return errorResponse('Current password is incorrect', 401);
    }

    // Update password
    const { error: updateError } = await db
      .from('users')
      .update({ password: newPassword, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return errorResponse('Failed to update password', 500);
    }

    return successResponse({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    return errorResponse(error.message || 'Change password failed', 500);
  }
});
