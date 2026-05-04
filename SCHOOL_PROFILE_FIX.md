# 🔧 School Profile Fix
# Folusho Victory Schools - Fix School Profile Saving

## 🚨 **Issue Identified**
The "Failed to save school profile" error indicates issues with:
1. **Database schema mismatch** - schools table structure
2. **Missing school record** - No school with ID=1
3. **Field mapping issues** - Incorrect field names
4. **Permission issues** - Supabase RLS policies

---

## 🛠️ **Step-by-Step Fix**

### **Step 1: Verify Schools Table Structure**
Run this in Supabase SQL Editor:

```sql
-- Check schools table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'schools' 
ORDER BY ordinal_position;

-- Check if school record exists
SELECT * FROM schools WHERE id = 1;

-- Check all schools
SELECT COUNT(*) as total_schools FROM schools;
```

### **Step 2: Create/Update Schools Table**
```sql
-- Drop and recreate schools table with correct structure
DROP TABLE IF EXISTS schools;

CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address_street TEXT,
  address_city VARCHAR(100),
  address_state VARCHAR(100),
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_schools_active ON schools(is_active);
CREATE INDEX idx_schools_name ON schools(name);
```

### **Step 3: Insert Default School**
```sql
-- Insert default school record
INSERT INTO schools (
  id, 
  name, 
  email, 
  phone, 
  address_city, 
  address_state,
  is_active,
  created_at, 
  updated_at
) VALUES (
  1,
  'Folusho Victory Schools',
  'info@folushovictory.com',
  '+234-800-000-0000',
  'Lagos',
  'Lagos State',
  true,
  NOW(),
  NOW()
);

-- Verify insertion
SELECT * FROM schools WHERE id = 1;
```

### **Step 4: Update School Config Service**
Replace the content of `src/services/schoolConfigService.js`:

```javascript
// School Configuration Service
// For updating school details in Supabase database

import { supabase } from './supabaseService'

export const schoolConfigService = {
  // Get current school information
  async getSchoolInfo() {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', 1)
        .single()

      if (error) {
        console.error('Error getting school info:', error)
        throw new Error('Failed to fetch school information')
      }

      return data
    } catch (error) {
      console.error('School info fetch error:', error)
      throw error
    }
  },

  // Update school information
  async updateSchoolInfo(schoolData) {
    try {
      console.log('Updating school info:', schoolData)

      const updateData = {
        name: schoolData.name || 'Folusho Victory Schools',
        email: schoolData.email || 'info@folushovictory.com',
        phone: schoolData.phone || '+234-800-000-0000',
        address_street: schoolData.addressStreet || '',
        address_city: schoolData.addressCity || 'Lagos',
        address_state: schoolData.addressState || 'Lagos State',
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('schools')
        .update(updateData)
        .eq('id', 1)
        .select()
        .single()

      if (error) {
        console.error('Error updating school info:', error)
        throw new Error('Failed to update school information')
      }

      console.log('School info updated successfully:', data)
      return data
    } catch (error) {
      console.error('School info update error:', error)
      throw error
    }
  },

  // Update school logo
  async updateSchoolLogo(logoUrl) {
    try {
      console.log('Updating school logo:', logoUrl)

      const { data, error } = await supabase
        .from('schools')
        .update({
          logo_url: logoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)
        .select()
        .single()

      if (error) {
        console.error('Error updating school logo:', error)
        throw new Error('Failed to update school logo')
      }

      console.log('School logo updated successfully:', data)
      return data
    } catch (error) {
      console.error('School logo update error:', error)
      throw error
    }
  },

  // Update school settings
  async updateSchoolSettings(settings) {
    try {
      console.log('Updating school settings:', settings)

      const { data, error } = await supabase
        .from('schools')
        .update({
          settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)
        .select()
        .single()

      if (error) {
        console.error('Error updating school settings:', error)
        throw new Error('Failed to update school settings')
      }

      console.log('School settings updated successfully:', data)
      return data
    } catch (error) {
      console.error('School settings update error:', error)
      throw error
    }
  },

  // Get school settings
  async getSchoolSettings() {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('settings')
        .eq('id', 1)
        .single()

      if (error) {
        console.error('Error getting school settings:', error)
        return {}
      }

      return data?.settings || {}
    } catch (error) {
      console.error('School settings fetch error:', error)
      return {}
    }
  },

  // Add school to database (for multi-school support)
  async addSchool(schoolData) {
    try {
      console.log('Adding new school:', schoolData)

      const { data, error } = await supabase
        .from('schools')
        .insert({
          name: schoolData.name,
          email: schoolData.email,
          phone: schoolData.phone,
          address_street: schoolData.addressStreet,
          address_city: schoolData.addressCity,
          address_state: schoolData.addressState,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding school:', error)
        throw new Error('Failed to add school')
      }

      console.log('School added successfully:', data)
      return data
    } catch (error) {
      console.error('School addition error:', error)
      throw error
    }
  },

  // Delete school
  async deleteSchool(schoolId) {
    try {
      console.log('Deleting school:', schoolId)

      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', schoolId)

      if (error) {
        console.error('Error deleting school:', error)
        throw new Error('Failed to delete school')
      }

      console.log('School deleted successfully')
      return true
    } catch (error) {
      console.error('School deletion error:', error)
      throw error
    }
  }
}

export default schoolConfigService
```

### **Step 5: Update Settings Component**
Find and update the settings component that handles school profile:

```javascript
// Example update for Settings.js
const handleSaveProfile = async (formData) => {
  try {
    setIsLoading(true)
    setError('')
    
    console.log('Saving school profile:', formData)
    
    const result = await schoolConfigService.updateSchoolInfo(formData)
    
    console.log('Profile saved successfully:', result)
    setSuccess('School profile updated successfully!')
    
    // Refresh school data
    await loadSchoolData()
    
  } catch (error) {
    console.error('Error saving school profile:', error)
    setError(error.message || 'Failed to save school profile')
  } finally {
    setIsLoading(false)
  }
}
```

---

## 🎯 **Quick Test Commands**

### **Test Database Connection:**
```sql
-- Test basic schools table access
SELECT * FROM schools LIMIT 1;

-- Test update operation
UPDATE schools 
SET name = 'Test Update', updated_at = NOW() 
WHERE id = 1;

-- Verify update
SELECT * FROM schools WHERE id = 1;
```

### **Test in Browser Console:**
```javascript
// Test school service
import { schoolConfigService } from './src/services/schoolConfigService.js';

// Test get school info
schoolConfigService.getSchoolInfo()
  .then(data => console.log('School data:', data))
  .catch(error => console.error('Error:', error));

// Test update school info
schoolConfigService.updateSchoolInfo({
  name: 'Folusho Victory Schools',
  email: 'info@folushovictory.com',
  phone: '+234-800-000-0000',
  addressCity: 'Lagos',
  addressState: 'Lagos State'
})
  .then(data => console.log('Update successful:', data))
  .catch(error => console.error('Update error:', error));
```

---

## ✅ **Expected Results**

After implementing fixes:
- ✅ **Schools table exists** with correct structure
- ✅ **Default school record** with ID=1
- ✅ **School profile saves** without errors
- ✅ **Error handling** with clear messages
- ✅ **Console logging** for debugging

---

## 🚀 **Implementation Steps**

1. **Run SQL commands** to fix database
2. **Update schoolConfigService.js** with enhanced error handling
3. **Test school profile functionality** in browser
4. **Verify all operations** work correctly

**This will fix the "Failed to save school profile" error!** 🎓
