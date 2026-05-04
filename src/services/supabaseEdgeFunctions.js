// API Service for Supabase Edge Functions
// Replace your current API calls with these functions

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://oscuovpwpzjqtaczsems.supabase.co';
const API_BASE = `${SUPABASE_URL}/functions/v1`;

// Get token from localStorage or sessionStorage
const getToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Make authenticated request
const authenticatedRequest = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Authentication
export const authService = {
  login: async (email, password) => {
    const response = await authenticatedRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  changePassword: async (currentPassword, newPassword) => {
    return authenticatedRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

// Teachers
export const teacherService = {
  list: async () => {
    return authenticatedRequest('/teachers/list');
  },

  create: async (teacherData) => {
    return authenticatedRequest('/teachers/create', {
      method: 'POST',
      body: JSON.stringify(teacherData)
    });
  },

  update: async (id, teacherData) => {
    return authenticatedRequest(`/teachers/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData)
    });
  }
};

// Students
export const studentService = {
  list: async () => {
    return authenticatedRequest('/students/list');
  },

  create: async (studentData) => {
    return authenticatedRequest('/students/create', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  }
};

// Results
export const resultService = {
  list: async () => {
    return authenticatedRequest('/results/list');
  }
};

// Email
export const emailService = {
  sendNotification: async (recipient, subject, content) => {
    return authenticatedRequest('/email/send-notification', {
      method: 'POST',
      body: JSON.stringify({ recipient, subject, content })
    });
  },

  sendResultNotification: async (studentIds, resultData) => {
    return authenticatedRequest('/email/send-result-notification', {
      method: 'POST',
      body: JSON.stringify({ studentIds, resultData })
    });
  },

  sendFeeReminder: async (studentIds, feeData) => {
    return authenticatedRequest('/email/send-fee-reminder', {
      method: 'POST',
      body: JSON.stringify({ studentIds, feeData })
    });
  },

  broadcast: async (recipients, subject, content) => {
    return authenticatedRequest('/email/broadcast', {
      method: 'POST',
      body: JSON.stringify({ recipients, subject, content })
    });
  }
};

// Data (public endpoints - no auth required)
export const dataService = {
  getSchools: async () => {
    return fetch(`${API_BASE}/data/schools`).then(r => r.json());
  },

  getAcademicYears: async () => {
    return authenticatedRequest('/data/academic-years');
  },

  getSchoolTerms: async () => {
    return authenticatedRequest('/data/school-terms');
  },

  getClasses: async () => {
    return authenticatedRequest('/data/classes');
  }
};

// Settings
export const settingsService = {
  get: async () => {
    return authenticatedRequest('/settings/get');
  },

  update: async (settings) => {
    return authenticatedRequest('/settings/update', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }
};

export default {
  authService,
  teacherService,
  studentService,
  resultService,
  emailService,
  dataService,
  settingsService
};
