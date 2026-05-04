# 🏫 School Configuration Guide
# Folusho Victory Schools - Admin Panel

## 🎯 Overview

This guide shows you how to customize school details, update settings, and manage your school information directly through the database.

---

## 📋 What You Can Customize

### **🏫 Basic School Information:**
- School name and address
- Contact information (email, phone)
- School logo and branding
- School settings and preferences

### **📊 Academic Configuration:**
- Academic years and terms
- Class structure and levels
- Grading system and policies
- School calendar and holidays

### **👥 Staff Management:**
- Teacher information and qualifications
- Department structure
- Staff roles and permissions
- Employment details and contracts

### **👨‍🎓 Student Management:**
- Student enrollment and records
- Parent/guardian information
- Class assignments and schedules
- Attendance and performance tracking

---

## 🛠️ How to Update School Details

### **Method 1: Through Admin Panel (Recommended)**

Once your system is deployed, you'll have an admin panel where you can:

1. **Go to School Settings**
2. **Edit Basic Information:**
   ```
   School Name: Folusho Victory Schools
   Email: info@folushovictory.sch.ng
   Phone: +234-800-000-0000
   Address: 123 Education Road, Kaduna, Kaduna, Nigeria
   ```

3. **Upload School Logo**
4. **Update School Calendar**
5. **Set Academic Terms**
6. **Configure Grading System**

### **Method 2: Direct Database Updates**

For advanced customization, you can update the database directly:

```sql
-- Update school information
UPDATE schools 
SET 
    name = 'Your Custom School Name',
    email = 'your-email@school.com',
    address_street = 'Your Street Address',
    address_city = 'Your City',
    address_state = 'Your State',
    phone = '+234-your-phone-number'
WHERE id = 1;

-- Add new academic year
INSERT INTO academic_years (year, start_date, end_date)
VALUES ('2025/2026', '2025-09-01', '2026-07-31')
ON CONFLICT (year) DO NOTHING;

-- Update school terms
UPDATE school_terms 
SET 
    start_date = '2025-01-06',
    end_date = '2025-03-28'
WHERE academic_year_id = 1 AND term = 'Second';
```

---

## 🎨 Customization Examples

### **Example 1: Update School Name**
```sql
UPDATE schools 
SET name = 'Victory International Academy'
WHERE id = 1;
```

### **Example 2: Add School Logo**
```sql
UPDATE schools 
SET logo_url = 'https://your-domain.com/logo.png'
WHERE id = 1;
```

### **Example 3: Update Contact Information**
```sql
UPDATE schools 
SET 
    email = 'admin@victoryacademy.edu.ng',
    phone = '+234-800-123-4567',
    address_street = '456 Education Boulevard',
    address_city = 'Abuja',
    address_state = 'FCT'
WHERE id = 1;
```

### **Example 4: Add New Academic Year**
```sql
INSERT INTO academic_years (year, start_date, end_date)
VALUES ('2025/2026', '2025-09-01', '2026-07-31');
```

### **Example 5: Update School Settings**
```sql
UPDATE schools 
SET 
    settings = '{
        "gradingScale": "A-F",
        "passMark": 50,
        "classSize": 30,
        "schoolHours": "8:00 AM - 3:00 PM"
    }'
WHERE id = 1;
```

---

## 📱 Using the School Configuration Service

I've created a `schoolConfigService.js` file that provides functions to:

- **Get school information**
- **Update school details**
- **Manage school settings**
- **Add multiple schools** (for multi-school support)

### **Example Usage:**
```javascript
import { schoolConfigService } from '../services/schoolConfigService';

// Update school name
await schoolConfigService.updateSchoolInfo({
    name: 'Victory International Academy',
    email: 'admin@victoryacademy.edu.ng',
    phone: '+234-800-123-4567'
});

// Update school logo
await schoolConfigService.updateSchoolLogo('https://your-domain.com/logo.png');

// Get current school info
const schoolInfo = await schoolConfigService.getSchoolInfo();
console.log(schoolInfo);
```

---

## 🔧 Frontend Integration

You can create an admin panel component that uses this service:

```javascript
import React, { useState, useEffect } from 'react';
import { schoolConfigService } from '../services/schoolConfigService';

function SchoolSettings() {
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSchoolInfo();
    }, []);

    const loadSchoolInfo = async () => {
        setLoading(true);
        try {
            const info = await schoolConfigService.getSchoolInfo();
            setSchoolInfo(info);
        } catch (error) {
            console.error('Failed to load school info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (field, value) => {
        try {
            await schoolConfigService.updateSchoolInfo({ [field]: value });
            setSchoolInfo(prev => ({ ...prev, [field]: value }));
        } catch (error) {
            console.error('Failed to update school info:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="school-settings">
            <h2>School Configuration</h2>
            
            <div className="setting-group">
                <label>School Name:</label>
                <input
                    type="text"
                    value={schoolInfo?.name || ''}
                    onChange={(e) => handleUpdate('name', e.target.value)}
                />
            </div>

            <div className="setting-group">
                <label>Email:</label>
                <input
                    type="email"
                    value={schoolInfo?.email || ''}
                    onChange={(e) => handleUpdate('email', e.target.value)}
                />
            </div>

            <div className="setting-group">
                <label>Phone:</label>
                <input
                    type="tel"
                    value={schoolInfo?.phone || ''}
                    onChange={(e) => handleUpdate('phone', e.target.value)}
                />
            </div>

            <div className="setting-group">
                <label>Address:</label>
                <textarea
                    value={schoolInfo?.address_street || ''}
                    onChange={(e) => handleUpdate('address_street', e.target.value)}
                />
            </div>
        </div>
    );
}

export default SchoolSettings;
```

---

## ✅ Benefits of Customization

- **🎨 Professional appearance** - Your school branding
- **📊 Accurate information** - Up-to-date school details
- **🔧 Flexible configuration** - Adapt to your needs
- **📱 Easy management** - Admin panel for updates
- **🌐 Multi-language support** - Can add multiple languages

---

## 🎯 Next Steps

1. **Deploy your system** to Netlify + Supabase
2. **Set up school database** with your custom details
3. **Create admin panel** using the school configuration service
4. **Customize appearance** with your school logo and colors
5. **Test all features** to ensure everything works

**Your Folusho Victory Schools Management System will be fully customized to your needs!** 🎓
