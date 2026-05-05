// Settings - Update endpoint (no authentication required - JWT verification disabled)
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

  if (req.method !== 'PUT') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const updates = await req.json();

    if (!updates || Object.keys(updates).length === 0) {
      return errorResponse('No updates provided', 400);
    }

    const db = getSupabaseClient();
    const schoolId = 1; // Single school setup
    
    // Update settings for the school
    const { error: updateError } = await db
      .from('system_settings')
      .update({
        principal_name: updates.principal_name,
        principal_title: updates.principal_title,
        proprietress_name: updates.proprietress_name,
        proprietress_title: updates.proprietress_title,
        school_motto: updates.school_motto,
        result_header: updates.result_header,
        result_footer: updates.result_footer,
        show_grades: updates.show_grades !== false,
        show_positions: updates.show_positions !== false,
        show_remarks: updates.show_remarks !== false,
        school_email: updates.school_email,
        school_phone: updates.school_phone,
        school_address: updates.school_address,
        updated_at: new Date().toISOString()
      })
      .eq('school_id', schoolId);

    if (updateError) {
      console.error('Update error:', updateError);
      return errorResponse('Failed to update settings', 500);
    }

    return successResponse({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return errorResponse(error.message || 'Failed to update settings', 500);
  }
});
