// @supabase-disable-jwt
// Settings endpoint - GET and PUT (no authentication required)
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

  try {
    const schoolId = 1; // Single school setup
    const db = getSupabaseClient();

    if (req.method === 'GET') {
      console.log('GET /settings - Fetching settings for school_id:', schoolId);
      
      const { data: schoolSettings, error } = await db
        .from('settings')
        .select('*')
        .eq('school_id', schoolId)
        .limit(1);

      if (error) {
        console.error('Database error:', error);
        return errorResponse('Failed to fetch settings', 500);
      }

      if (schoolSettings && schoolSettings.length > 0) {
        console.log('Settings found:', schoolSettings[0]);
        return successResponse(schoolSettings[0]);
      } else {
        console.log('No settings found, returning defaults');
        return successResponse({
          school_id: schoolId,
          principal_name: '',
          principal_title: 'Principal',
          proprietress_name: '',
          proprietress_title: 'Proprietress',
          school_motto: 'Excellence in Education Since 2009',
          result_header: 'FOLUSHO VICTORY SCHOOLS',
          result_footer: 'Approved by the Ministry of Education',
          show_grades: true,
          show_positions: true,
          show_remarks: true,
          school_email: '',
          school_phone: '',
          school_address: ''
        });
      }
    } else if (req.method === 'PUT') {
      console.log('PUT /settings - Updating settings for school_id:', schoolId);
      
      const body = await req.json();
      const {
        principal_name,
        principal_title,
        proprietress_name,
        proprietress_title,
        school_motto,
        result_header,
        result_footer,
        show_grades,
        show_positions,
        show_remarks,
        school_email,
        school_phone,
        school_address
      } = body;

      // Check if settings exist
      const { data: existingSettings, error: selectError } = await db
        .from('settings')
        .select('id')
        .eq('school_id', schoolId)
        .limit(1);

      if (selectError) {
        console.error('Select error:', selectError);
        return errorResponse('Failed to update settings', 500);
      }

      if (existingSettings && existingSettings.length > 0) {
        console.log('Updating existing settings');
        // Update existing settings
        const { error: updateError } = await db
          .from('settings')
          .update({
            principal_name,
            principal_title,
            proprietress_name,
            proprietress_title,
            school_motto,
            result_header,
            result_footer,
            show_grades,
            show_positions,
            show_remarks,
            school_email,
            school_phone,
            school_address,
            updated_at: new Date().toISOString()
          })
          .eq('school_id', schoolId);

        if (updateError) {
          console.error('Update error:', updateError);
          return errorResponse('Failed to update settings', 500);
        }
      } else {
        console.log('Creating new settings');
        // Create new settings
        const { error: insertError } = await db
          .from('settings')
          .insert({
            school_id: schoolId,
            principal_name,
            principal_title,
            proprietress_name,
            proprietress_title,
            school_motto,
            result_header,
            result_footer,
            show_grades,
            show_positions,
            show_remarks,
            school_email,
            school_phone,
            school_address,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          return errorResponse('Failed to create settings', 500);
        }
      }

      console.log('Settings updated successfully');
      return successResponse({
        success: true,
        message: 'Settings updated successfully'
      });
    } else {
      return errorResponse('Method not allowed', 405);
    }
  } catch (error: any) {
    console.error('Settings error:', error?.message, error?.stack);
    return errorResponse(error?.message || 'Failed to process request', 500);
  }
});
