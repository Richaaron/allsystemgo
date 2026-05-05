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
    // Authenticate user (validates token format)
    const user = authenticateRequest(req);
    console.log('Authenticated user:', user);

    const { email, currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return errorResponse('Current password and new password required', 400);
    }

    if (!email) {
      return errorResponse('Email is required', 400);
    }

    const db = getSupabaseClient();

    // Get user by email
    const { data: users, error: queryError } = await db
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (queryError) {
      console.error('Database query error:', queryError);
      return errorResponse('Database error', 500);
    }

    if (!users || users.length === 0) {
      console.error('User not found with email:', email);
      return errorResponse('User not found', 404);
    }

    const userData = users[0];
    console.log('User found:', userData.email);

    // Verify current password
    if (userData.password !== currentPassword) {
      console.error('Password mismatch');
      return errorResponse('Current password is incorrect', 401);
    }

    // Update password
    const { error: updateError } = await db
      .from('users')
      .update({ password: newPassword, updated_at: new Date().toISOString() })
      .eq('id', userData.id);

    if (updateError) {
      console.error('Password update error:', updateError);
      return errorResponse('Failed to update password', 500);
    }

    console.log('Password updated successfully for:', email);
    return successResponse({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    return errorResponse(error.message || 'Change password failed', 500);
  }
});
