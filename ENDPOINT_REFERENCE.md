# API Endpoint Reference - Supabase vs Render

## Overview
Migrating from Express (Render) to Supabase Edge Functions

### Base URLs
- **Old (Render):** `https://folusho-victory-schools-api.onrender.com/api`
- **New (Supabase):** `https://oscuovpwpzjqtaczsems.supabase.co/functions/v1`

---

## Authentication Endpoints

### Login
```
OLD: POST /api/auth/login
NEW: POST /functions/v1/auth/login

Body: { "email": "user@school.com", "password": "pass" }
Response: { "user": {...}, "token": "jwt...", "message": "Login successful" }
```

### Change Password
```
OLD: POST /api/auth/change-password
NEW: POST /functions/v1/auth/change-password

Headers: { "Authorization": "Bearer TOKEN" }
Body: { "currentPassword": "old", "newPassword": "new" }
Response: { "message": "Password changed successfully" }
```

---

## Teachers Endpoints

### List All Teachers
```
OLD: GET /api/teachers
NEW: GET /functions/v1/teachers/list

Headers: { "Authorization": "Bearer TOKEN" }
Response: { "teachers": [{...}, {...}] }
```

### Create Teacher
```
OLD: POST /api/teachers
NEW: POST /functions/v1/teachers/create

Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "staff_id": "T001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@school.com",
  "phone": "+234802...",
  "title": "Mr",
  "gender": "Male",
  "date_of_birth": "1990-01-01",
  "qualification": "BSc Education",
  "department_id": 1,
  "school_id": 1
}
Response: { "teacher": {...} }

Note: Email notification sent automatically to teacher
```

### Update Teacher
```
OLD: PUT /api/teachers/:id
NEW: PUT /functions/v1/teachers/update/:id

Headers: { "Authorization": "Bearer TOKEN" }
Body: { "first_name": "Jane", ... }
Response: { "teacher": {...} }
```

---

## Students Endpoints

### List All Students
```
OLD: GET /api/students
NEW: GET /functions/v1/students/list

Headers: { "Authorization": "Bearer TOKEN" }
Response: { "students": [{...}, {...}] }
```

### Create Student
```
OLD: POST /api/students
NEW: POST /functions/v1/students/create

Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "admission_number": "ADM001",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@school.com",
  "phone": "+234803...",
  "date_of_birth": "2010-05-15",
  "gender": "Female",
  "class_id": 1,
  "school_id": 1
}
Response: { "student": {...} }
```

---

## Results Endpoints

### List All Results
```
OLD: GET /api/results
NEW: GET /functions/v1/results/list

Headers: { "Authorization": "Bearer TOKEN" }
Response: { "results": [{...}, {...}] }
```

---

## Email Endpoints

### Send Individual Notification
```
OLD: POST /api/email/send-notification
NEW: POST /functions/v1/email/send-notification

Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "recipient": "parent@example.com",
  "subject": "Grade Update",
  "content": "<h1>Your child got an A!</h1>"
}
Response: { "success": true, "messageId": "..." }
```

### Send Result Notification to Multiple Students
```
OLD: POST /api/email/send-result-notification
NEW: POST /functions/v1/email/send-result-notification

Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "studentIds": [1, 2, 3],
  "resultData": {
    "class_name": "JSS 1 A",
    "term": "TERM_1",
    "total_score": 85,
    "grade": "A"
  }
}
Response: {
  "success": true,
  "message": "Sent 3 result notifications",
  "results": [
    { "success": true, "messageId": "..." },
    ...
  ]
}
```

### Send Fee Reminder to Multiple Students
```
OLD: POST /api/email/send-fee-reminder
NEW: POST /functions/v1/email/send-fee-reminder

Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "studentIds": [1, 2, 3],
  "feeData": {
    "amount": 50000,
    "due_date": "2025-01-31",
    "balance": 10000
  }
}
Response: {
  "success": true,
  "message": "Sent 3 fee reminders",
  "results": [...]
}
```

### Broadcast Email to Multiple Recipients
```
OLD: POST /api/email/broadcast
NEW: POST /functions/v1/email/broadcast

Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "recipients": ["admin@school.com", "principal@school.com", "parent1@example.com"],
  "subject": "School Closure Notice",
  "content": "<h1>School closed due to weather</h1>"
}
Response: {
  "success": true,
  "message": "Sent broadcast to 3 recipients",
  "results": [...]
}
```

---

## Data Endpoints (Reference Data)

### Get All Schools
```
OLD: GET /api/schools
NEW: GET /functions/v1/data/schools

No Auth Required (public endpoint)
Response: { "schools": [{...}, {...}] }
```

### Get Academic Years
```
OLD: GET /api/academic-years
NEW: GET /functions/v1/data/academic-years

Headers: { "Authorization": "Bearer TOKEN" }
Response: { "academicYears": [{...}, {...}] }
```

### Get School Terms
```
OLD: GET /api/school-terms
NEW: GET /functions/v1/data/school-terms

Headers: { "Authorization": "Bearer TOKEN" }
Response: { "schoolTerms": [{...}, {...}] }
```

### Get Classes
```
OLD: GET /api/classes
NEW: GET /functions/v1/data/classes

Headers: { "Authorization": "Bearer TOKEN" }
Response: { "classes": [{...}, {...}] }
```

---

## Settings Endpoints

### Get Settings
```
OLD: GET /api/settings
NEW: GET /functions/v1/settings/get

Headers: { "Authorization": "Bearer TOKEN" }
Response: { "settings": { "school_name": "Folusho Victory Schools", ... } }
```

### Update Settings
```
OLD: PUT /api/settings
NEW: PUT /functions/v1/settings/update

Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "school_name": "New Name",
  "phone": "+234802..."
}
Response: {
  "success": true,
  "message": "Settings updated successfully",
  "results": [
    { "key": "school_name", "success": true },
    { "key": "phone", "success": true }
  ]
}
```

---

## HTTP Methods & Status Codes

### Methods
- `GET` - Retrieve data
- `POST` - Create data / Send emails
- `PUT` - Update data
- `DELETE` - Not yet implemented (but can be added)
- `OPTIONS` - CORS preflight (handled automatically)

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request (missing fields, invalid data)
- `401` - Unauthorized (invalid credentials, missing token)
- `403` - Forbidden (expired token)
- `404` - Not found
- `405` - Method not allowed
- `500` - Server error

### Error Response
```json
{ "error": "Error message describing what went wrong" }
```

---

## CORS Support

All endpoints support CORS:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

No need to configure CORS on frontend for these endpoints.

---

## Authentication

All endpoints except `/data/schools` require JWT authentication:

```
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Token obtained from login endpoint:
```javascript
const { token } = await fetch(...login endpoint...).json();
localStorage.setItem('authToken', token);
```

Token expires in 24 hours. After expiration, user must login again.

---

## Rate Limiting

Supabase Free Tier:
- **500,000 function invocations/month**
- ~16,500 per day
- ~0.19 per second

Most school management systems use much less.

---

## Migration Checklist

Update these endpoints in your code:

- [ ] `/api/auth/login` → `/functions/v1/auth/login`
- [ ] `/api/auth/change-password` → `/functions/v1/auth/change-password`
- [ ] `/api/teachers` (GET) → `/functions/v1/teachers/list`
- [ ] `/api/teachers` (POST) → `/functions/v1/teachers/create`
- [ ] `/api/teachers/:id` (PUT) → `/functions/v1/teachers/update/:id`
- [ ] `/api/students` (GET) → `/functions/v1/students/list`
- [ ] `/api/students` (POST) → `/functions/v1/students/create`
- [ ] `/api/results` → `/functions/v1/results/list`
- [ ] `/api/schools` → `/functions/v1/data/schools`
- [ ] `/api/academic-years` → `/functions/v1/data/academic-years`
- [ ] `/api/school-terms` → `/functions/v1/data/school-terms`
- [ ] `/api/classes` → `/functions/v1/data/classes`
- [ ] `/api/email/send-notification` → `/functions/v1/email/send-notification`
- [ ] `/api/email/send-result-notification` → `/functions/v1/email/send-result-notification`
- [ ] `/api/email/send-fee-reminder` → `/functions/v1/email/send-fee-reminder`
- [ ] `/api/email/broadcast` → `/functions/v1/email/broadcast`
- [ ] `/api/settings` (GET) → `/functions/v1/settings/get`
- [ ] `/api/settings` (PUT) → `/functions/v1/settings/update`

---

## Quick Replace

Find & Replace in your code:
```
Find:    https://folusho-victory-schools-api.onrender.com/api
Replace: https://oscuovpwpzjqtaczsems.supabase.co/functions/v1
```

Or use the provided service layer:
```javascript
import { authService, teacherService, ... } from './services/supabaseEdgeFunctions';
```

---

That's all the endpoint mappings! 🚀
