# Frontend Integration Guide - Supabase Edge Functions

This guide shows how to update your React components to use Supabase Edge Functions instead of the Express backend.

## Quick Reference

### Old (Render/Express)
```javascript
const response = await fetch('https://folusho-victory-schools-api.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### New (Supabase)
```javascript
import { authService } from 'src/services/supabaseEdgeFunctions';
const response = await authService.login(email, password);
```

---

## 📝 Component Examples

### 1. Login Component

**Before:**
```javascript
const handleLogin = async () => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    // redirect...
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

**After:**
```javascript
import { authService } from '../services/supabaseEdgeFunctions';

const handleLogin = async () => {
  try {
    const data = await authService.login(email, password);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // redirect...
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

---

### 2. Teachers List Component

**Before:**
```javascript
const loadTeachers = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/teachers', {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  setTeachers(data.teachers);
};
```

**After:**
```javascript
import { teacherService } from '../services/supabaseEdgeFunctions';

const loadTeachers = async () => {
  try {
    const { teachers } = await teacherService.list();
    setTeachers(teachers);
  } catch (error) {
    console.error('Failed to load teachers:', error.message);
  }
};
```

---

### 3. Create Teacher Component

**Before:**
```javascript
const handleCreateTeacher = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/teachers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(teacherData)
  });
  
  const newTeacher = await response.json();
  setTeachers([...teachers, newTeacher.teacher]);
};
```

**After:**
```javascript
import { teacherService } from '../services/supabaseEdgeFunctions';

const handleCreateTeacher = async () => {
  try {
    const { teacher } = await teacherService.create(teacherData);
    setTeachers([...teachers, teacher]);
    showNotification('Teacher created successfully!');
  } catch (error) {
    showError('Failed to create teacher: ' + error.message);
  }
};
```

---

### 4. Send Email Notification

**Before:**
```javascript
const sendNotification = async () => {
  const token = localStorage.getItem('authToken');
  await fetch('/api/email/send-notification', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient: 'parent@example.com',
      subject: 'Grade Update',
      content: '<h1>Your child got an A!</h1>'
    })
  });
};
```

**After:**
```javascript
import { emailService } from '../services/supabaseEdgeFunctions';

const sendNotification = async () => {
  try {
    await emailService.sendNotification(
      'parent@example.com',
      'Grade Update',
      '<h1>Your child got an A!</h1>'
    );
    showNotification('Email sent successfully!');
  } catch (error) {
    showError('Failed to send email: ' + error.message);
  }
};
```

---

### 5. Broadcast Email to Multiple Recipients

**Before:**
```javascript
const broadcastEmail = async (recipients, subject, content) => {
  const token = localStorage.getItem('authToken');
  await fetch('/api/email/broadcast', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipients, subject, content })
  });
};
```

**After:**
```javascript
import { emailService } from '../services/supabaseEdgeFunctions';

const broadcastEmail = async (recipients, subject, content) => {
  try {
    const result = await emailService.broadcast(recipients, subject, content);
    showNotification(`Email sent to ${result.results.filter(r => r.success).length} recipients`);
  } catch (error) {
    showError('Broadcast failed: ' + error.message);
  }
};
```

---

### 6. Send Result Notification to Multiple Students

**Before:**
```javascript
const notifyResults = async (studentIds, resultData) => {
  const token = localStorage.getItem('authToken');
  await fetch('/api/email/send-result-notification', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ studentIds, resultData })
  });
};
```

**After:**
```javascript
import { emailService } from '../services/supabaseEdgeFunctions';

const notifyResults = async (studentIds, resultData) => {
  try {
    const result = await emailService.sendResultNotification(studentIds, resultData);
    showNotification(`Result notifications sent to ${studentIds.length} students`);
  } catch (error) {
    showError('Failed to notify results: ' + error.message);
  }
};
```

---

### 7. Settings Management

**Before:**
```javascript
const loadSettings = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/settings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  setSettings(data.settings);
};
```

**After:**
```javascript
import { settingsService } from '../services/supabaseEdgeFunctions';

const loadSettings = async () => {
  try {
    const { settings } = await settingsService.get();
    setSettings(settings);
  } catch (error) {
    console.error('Failed to load settings:', error.message);
  }
};
```

---

## 🔐 Error Handling

All service functions throw errors on failure. Always wrap in try/catch:

```javascript
try {
  const { teachers } = await teacherService.list();
  setTeachers(teachers);
} catch (error) {
  // error.message contains the error from Edge Function
  console.error('Error:', error.message);
  showErrorNotification(error.message);
}
```

---

## 🎯 Authentication Flow

The token is automatically managed by the service layer:

```javascript
// 1. Login (token saved automatically)
const { user, token } = await authService.login(email, password);

// 2. Subsequent requests use token from localStorage
const { teachers } = await teacherService.list();
// ^ No need to pass token - service handles it

// 3. Logout
localStorage.removeItem('authToken');
```

---

## 📦 All Available Services

```javascript
import {
  authService,       // Login, changePassword
  teacherService,    // list, create, update
  studentService,    // list, create
  resultService,     // list
  emailService,      // sendNotification, sendResultNotification, sendFeeReminder, broadcast
  dataService,       // getSchools, getAcademicYears, getSchoolTerms, getClasses
  settingsService    // get, update
} from '../services/supabaseEdgeFunctions';
```

---

## 🌍 Environment Setup

Make sure your `.env.local` has:

```
REACT_APP_SUPABASE_URL=https://oscuovpwpzjqtaczsems.supabase.co
```

Or it's already hardcoded in the service file.

---

## 📋 Migration Checklist

- [ ] Update Login component to use `authService.login()`
- [ ] Update Teachers list/create to use `teacherService.*`
- [ ] Update Students list/create to use `studentService.*`
- [ ] Update Results to use `resultService.list()`
- [ ] Update email sending to use `emailService.*`
- [ ] Update Settings to use `settingsService.*`
- [ ] Test each updated component
- [ ] Remove old API fetch calls

---

## 🧪 Testing

Test a service function in browser console:

```javascript
// Import in your component and call
import { teacherService } from './services/supabaseEdgeFunctions';

// In browser console:
teacherService.list().then(data => console.log(data));

// Or async in console:
(async () => {
  const data = await teacherService.list();
  console.log(data);
})();
```

---

## 💡 Pro Tips

1. **Consistent Error Messages**: All errors from Edge Functions go through the service layer
2. **Token Expires**: After 24 hours, user must login again - handle with try/catch
3. **Loading States**: Wrap service calls with loading state
4. **Optimistic Updates**: Update UI before API response for better UX
5. **Retry Logic**: Add retry for network failures (implement in service layer if needed)

```javascript
// Example with loading state and optimistic update
const [loading, setLoading] = useState(false);

const handleCreateTeacher = async () => {
  setLoading(true);
  try {
    // Optimistically add to list
    const optimisticTeacher = { ...teacherData, id: Math.random() };
    setTeachers([...teachers, optimisticTeacher]);
    
    // Make API call
    const { teacher } = await teacherService.create(teacherData);
    
    // Update with real data
    setTeachers(teachers.map(t => t.id === optimisticTeacher.id ? teacher : t));
  } catch (error) {
    // Revert on error
    setTeachers(teachers.filter(t => t.id !== optimisticTeacher.id));
    showError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

That's it! Your app is now using Supabase Edge Functions. 🎉
