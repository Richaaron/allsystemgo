// Settings endpoint - GET and PUT
import { getSupabaseClient, authenticateRequest, successResponse, errorResponse, corsHeaders, handleCors } from './utils.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Authenticate user
    const user = authenticateRequest(req);
    const schoolId = user.school_id || 1;

    const db = getSupabaseClient();

    if (req.method === 'GET') {
      // Get settings for school
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
        return successResponse(schoolSettings[0]);
      } else {
        // Return default settings if none exist
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
      // Update settings
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

      return successResponse({
        success: true,
        message: 'Settings updated successfully'
      });
    } else {
      return errorResponse('Method not allowed', 405);
    }
  } catch (error: any) {
    console.error('Settings error:', error);
    return errorResponse(error.message || 'Failed to process request', 500);
  }
});
