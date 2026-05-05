// Settings - Get endpoint (no authentication required - JWT verification disabled)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
};

function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey 
    });
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

function successResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const db = getSupabaseClient();

    // Get all settings from all schools
    const { data: settings, error } = await db
      .from('system_settings')
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
