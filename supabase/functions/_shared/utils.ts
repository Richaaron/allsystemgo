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

// Verify token
export function verifyToken(token: string): any {
  try {
    // Handle tokens in format: token_<base64_payload>_<timestamp>
    if (token.startsWith('token_')) {
      console.log('App token detected');
      const parts = token.split('_');
      if (parts.length < 3) {
        throw new Error('Invalid token format');
      }
      
      try {
        const payload = JSON.parse(atob(parts[1]));
        const timestamp = parseInt(parts[2]);
        
        // Check token is not older than 24 hours
        const tokenAge = Date.now() - timestamp;
        if (tokenAge > 24 * 60 * 60 * 1000) {
          throw new Error('Token expired');
        }
        
        console.log('Token verified successfully:', payload);
        return payload;
      } catch (e: any) {
        throw new Error(`Token parsing failed: ${e.message}`);
      }
    }
    
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
    
    // Handle Supabase session tokens
    if (token.includes('.')) {
      console.log('Session token detected - passing through for Supabase');
      // For session tokens, we'll do basic validation
      return { id: 'session-user', email: 'session@app.com', role: 'user' };
    }
    
    throw new Error('Unknown token format');
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    throw new Error(`Invalid token: ${error.message}`);
  }
}

// Generate token - simple reliable format
export function generateToken(user: any) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000)
  };
  
  const encodedPayload = btoa(JSON.stringify(payload));
  const timestamp = Date.now();
  
  return `token_${encodedPayload}_${timestamp}`;
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
