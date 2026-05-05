// Shared utilities for Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as jwt from 'https://esm.sh/jsonwebtoken@9.0.3';

const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'nigerian-school-jwt-secret-2024';

// Initialize Supabase client
export function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    // Handle mock tokens (for development)
    if (token.startsWith('mock_')) {
      console.log('Mock token detected, parsing payload');
      const payload = JSON.parse(atob(token.substring(5)));
      console.log('Mock token payload:', payload);
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }
      return payload;
    }
    
    // Handle real JWT tokens
    console.log('Verifying JWT token with secret:', JWT_SECRET ? 'set' : 'not set');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    throw new Error(`Invalid token: ${error.message}`);
  }
}

// Generate JWT token
export function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Authenticate request
export function authenticateRequest(req: Request): any {
  const authHeader = req.headers.get('authorization');
  console.log('Authorization header:', authHeader ? 'present' : 'missing');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    console.error('No token in authorization header');
    throw new Error('No token provided');
  }
  
  console.log('Token type:', token.startsWith('mock_') ? 'mock' : 'jwt', 'first 20 chars:', token.substring(0, 20));
  return verifyToken(token);
}

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
};

// Response helpers
export function successResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

export function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

// Handle CORS preflight
export function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    });
  }
}
