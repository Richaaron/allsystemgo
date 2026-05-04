// Auth - Login endpoint
import { getSupabaseClient, generateToken, successResponse, errorResponse, corsHeaders, handleCors } from '../_shared/utils.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse('Email and password required', 400);
    }

    const db = getSupabaseClient();

    // Query users table
    const { data: users, error: queryError } = await db
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (queryError) {
      console.error('Database error:', queryError);
      return errorResponse('Database error', 500);
    }

    if (!users || users.length === 0) {
      return errorResponse('Invalid credentials', 401);
    }

    const user = users[0];

    // Simple password check (in production, use bcrypt comparison)
    if (user.password !== password) {
      return errorResponse('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return successResponse({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse(error.message || 'Login failed', 500);
  }
});
