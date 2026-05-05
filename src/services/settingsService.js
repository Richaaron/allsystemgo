// Settings Service - Direct Supabase Operations
// Handles all settings CRUD operations directly with Supabase
// No backend API needed

import { supabase } from './supabaseService'

export const settingsService = {
  // Get all settings for a school
  async getSettings(schoolId = 1) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('school_id', schoolId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, return defaults
          console.log('No settings found, returning defaults')
          return {
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
          }
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  },

  // Update settings for a school
  async updateSettings(settingsData, schoolId = 1) {
    try {
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
      } = settingsData

      // First, check if settings exist
      const { data: existingSettings, error: selectError } = await supabase
        .from('settings')
        .select('id')
        .eq('school_id', schoolId)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError
      }

      let result

      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
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
          .eq('school_id', schoolId)
          .select()
          .single()

        if (error) throw error
        result = data
      } else {
        // Create new settings
        const { data, error } = await supabase
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
          })
          .select()
          .single()

        if (error) throw error
        result = data
      }

      console.log('Settings updated successfully:', result)
      return result
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  // Update result settings specifically
  async updateResultSettings(resultSettings, schoolId = 1) {
    return this.updateSettings(
      {
        principal_name: resultSettings.principalName,
        principal_title: resultSettings.principalTitle,
        proprietress_name: resultSettings.proprietressName,
        proprietress_title: resultSettings.proprietressTitle,
        school_motto: resultSettings.schoolMotto,
        result_header: resultSettings.resultHeader,
        result_footer: resultSettings.resultFooter,
        show_grades: resultSettings.showGrades,
        show_positions: resultSettings.showPositions,
        show_remarks: resultSettings.showRemarks
      },
      schoolId
    )
  },

  // Update school profile settings
  async updateSchoolProfile(schoolProfile, schoolId = 1) {
    return this.updateSettings(
      {
        school_email: schoolProfile.schoolEmail,
        school_phone: schoolProfile.schoolPhone,
        school_address: schoolProfile.schoolAddress,
        school_motto: schoolProfile.schoolMotto
      },
      schoolId
    )
  }
}
