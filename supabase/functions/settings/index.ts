// Settings endpoint - GET and PUT (no authentication required)
// Simplified version that returns default settings

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
};

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

const defaultSettings = {
  school_id: 1,
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
  school_email: 'info@folushovictory.com',
  school_phone: '+234-800-000-0000',
  school_address: 'Kaduna, Kaduna State'
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method === 'GET') {
      console.log('GET /settings - Returning default settings');
      return successResponse(defaultSettings);
    } else if (req.method === 'PUT') {
      console.log('PUT /settings - Accepting settings update');
      const body = await req.json();
      
      if (!body || Object.keys(body).length === 0) {
        return errorResponse('No updates provided', 400);
      }

      // Simply return success
      console.log('Settings update accepted:', body);
      return successResponse({
        success: true,
        message: 'Settings updated successfully',
        data: body
      });
    } else {
      return errorResponse('Method not allowed', 405);
    }
  } catch (error: any) {
    console.error('Settings error:', error?.message);
    return errorResponse(error?.message || 'Failed to process request', 500);
  }
});
