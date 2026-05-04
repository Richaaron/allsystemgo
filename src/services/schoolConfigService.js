// School Configuration Service
// For updating school details in Supabase database

import { supabase } from './supabaseService'

export const schoolConfigService = {
  // Get current school information
  async getSchoolInfo() {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .single()

    if (error) throw error
    return data
  },

  // Update school information
  async updateSchoolInfo(schoolData) {
    const { data, error } = await supabase
      .from('schools')
      .update({
        name: schoolData.name,
        email: schoolData.email,
        address_street: schoolData.addressStreet,
        address_city: schoolData.addressCity,
        address_state: schoolData.addressState,
        phone: schoolData.phone,
        is_active: schoolData.isActive !== undefined ? schoolData.isActive : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1) // Assuming first school
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update school logo
  async updateSchoolLogo(logoUrl) {
    const { data, error } = await supabase
      .from('schools')
      .update({
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update school settings
  async updateSchoolSettings(settings) {
    const { data, error } = await supabase
      .from('schools')
      .update({
        settings: settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get school settings
  async getSchoolSettings() {
    const { data, error } = await supabase
      .from('schools')
      .select('settings')
      .eq('id', 1)
      .single()

    if (error) throw error
    return data?.settings || {}
  },

  // Add school to database (for multi-school support)
  async addSchool(schoolData) {
    const { data, error } = await supabase
      .from('schools')
      .insert({
        name: schoolData.name,
        email: schoolData.email,
        address_street: schoolData.addressStreet,
        address_city: schoolData.addressCity,
        address_state: schoolData.addressState,
        phone: schoolData.phone,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete school
  async deleteSchool(schoolId) {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', schoolId)

    if (error) throw error
    return true
  }
}
