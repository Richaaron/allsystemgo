// FOLUSHO VICTORY SCHOOLS - Environment Configuration
// Centralized configuration management for the Nigerian School Management System

// Environment variables with fallbacks
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://oscuovpwpzjqtaczsems.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const config = {
  // Supabase Configuration (Primary Backend)
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey
  },

  // API Configuration
  apiUrl: `${supabaseUrl}/rest/v1`,
  functionsUrl: `${supabaseUrl}/functions/v1`,
  apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  
  // Supabase API Key for public access
  supabaseKey: supabaseAnonKey,
  
  // Authentication
  sessionSecret: process.env.REACT_APP_SESSION_SECRET || 'nigerian-school-super-secret-key-2024-change-in-production',
  jwtSecret: process.env.REACT_APP_JWT_SECRET || 'nigerian-school-jwt-secret-2024',
  
  // OAuth Providers
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '',
  },
  
  // Email Configuration
  smtp: {
    host: process.env.REACT_APP_SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.REACT_APP_SMTP_PORT) || 587,
    secure: process.env.REACT_APP_SMTP_SECURE === 'true',
    user: process.env.REACT_APP_SMTP_USER || 'folushovictoryschool@gmail.com',
    pass: process.env.REACT_APP_SMTP_PASS || '',
  },
  
  // Bank Details for Fee Payments
  bank: {
    accountName: process.env.REACT_APP_BANK_ACCOUNT_NAME || 'Folusho Victory Schools Limited',
    accountNumber: process.env.REACT_APP_BANK_ACCOUNT_NUMBER || '0008260982',
    bankName: process.env.REACT_APP_BANK_NAME || 'Taj Bank',
    sortCode: process.env.REACT_APP_BANK_SORT_CODE || '000001',
  },
  
  // School Information
  school: {
    name: process.env.REACT_APP_SCHOOL_NAME || 'FOLUSHO VICTORY SCHOOLS',
    motto: process.env.REACT_APP_SCHOOL_MOTTO || 'Excellence in Education, Character in Service',
    address: process.env.REACT_APP_SCHOOL_ADDRESS || 'C6 Kwasau street, Barnawa, Kaduna',
    phone: process.env.REACT_APP_SCHOOL_PHONE || '+234-8063020938, +234-8138115993, +234-8138594397',
    email: process.env.REACT_APP_SCHOOL_EMAIL || 'folushovictoryschool@gmail.com',
    website: process.env.REACT_APP_SCHOOL_WEBSITE || 'www.folushovictoryschools.com',
  },
  
  // Academic Settings
  academic: {
    currentYear: process.env.REACT_APP_CURRENT_ACADEMIC_YEAR || '2024/2025',
    currentTerm: process.env.REACT_APP_CURRENT_TERM || 'TERM_2',
    gradingScale: process.env.REACT_APP_GRADING_SCALE || '5_POINT_NIGERIAN',
    currency: process.env.REACT_APP_CURRENCY || 'NGN',
    currencySymbol: process.env.REACT_APP_CURRENCY_SYMBOL || '₦',
  },
  
  // File Upload Settings
  upload: {
    maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 5000000, // 5MB
    uploadPath: process.env.REACT_APP_UPLOAD_PATH || './uploads',
    allowedTypes: process.env.REACT_APP_ALLOWED_FILE_TYPES?.split(',') || ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  },
  
  // Development Settings
  development: {
    nodeEnv: process.env.REACT_APP_NODE_ENV || 'development',
    port: parseInt(process.env.REACT_APP_PORT) || 3000,
    devMode: process.env.REACT_APP_DEV_MODE === 'true',
  },
  
  // Feature Flags
  features: {
    notifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
    smsNotifications: process.env.REACT_APP_ENABLE_SMS_NOTIFICATIONS === 'true',
    paymentGateway: process.env.REACT_APP_ENABLE_PAYMENT_GATEWAY === 'true',
    resultPdfExport: process.env.REACT_APP_ENABLE_RESULT_PDF_EXPORT === 'true',
    excelExport: process.env.REACT_APP_ENABLE_EXCEL_EXPORT === 'true',
  },
  
  // External Services
  services: {
    googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    sentryDsn: process.env.REACT_APP_SENTRY_DSN || '',
  },
  
  // Nigerian Context Settings
  nigeria: {
    country: process.env.REACT_APP_COUNTRY || 'Nigeria',
    timezone: process.env.REACT_APP_TIMEZONE || 'Africa/Lagos',
    dateFormat: process.env.REACT_APP_DATE_FORMAT || 'DD/MM/YYYY',
    locale: process.env.REACT_APP_LOCALE || 'en-NG',
  },
  
  // Examination Boards
  examBoards: {
    waec: process.env.REACT_APP_ENABLE_WAEC === 'true',
    neco: process.env.REACT_APP_ENABLE_NECO === 'true',
    jamb: process.env.REACT_APP_ENABLE_JAMB === 'true',
  },
  
  // Cache Settings
  cache: {
    enableOfflineCache: process.env.REACT_APP_ENABLE_OFFLINE_CACHE === 'true',
    duration: parseInt(process.env.REACT_APP_CACHE_DURATION) || 3600000, // 1 hour
  },
  
  // Performance Settings
  performance: {
    lazyLoading: process.env.REACT_APP_ENABLE_LAZY_LOADING === 'true',
    codeSplitting: process.env.REACT_APP_ENABLE_CODE_SPLITTING === 'true',
    serviceWorker: process.env.REACT_APP_ENABLE_SERVICE_WORKER === 'true',
  },
  
  // Security Settings
  security: {
    enableCors: process.env.REACT_APP_ENABLE_CORS === 'true',
    corsOrigin: process.env.REACT_APP_CORS_ORIGIN || 'http://localhost:3000',
    enableRateLimiting: process.env.REACT_APP_ENABLE_RATE_LIMITING === 'true',
    maxRequestsPerMinute: parseInt(process.env.REACT_APP_MAX_REQUESTS_PER_MINUTE) || 100,
  },
};

// Utility functions for common operations
export const formatCurrency = (amount) => {
  const { currency, currencySymbol } = config.academic;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  const { dateFormat } = config.nigeria;
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    timeZone: config.nigeria.timezone
  };
  
  if (dateFormat === 'DD/MM/YYYY') {
    return new Date(date).toLocaleDateString('en-GB', options);
  }
  return new Date(date).toLocaleDateString('en-US', options);
};

export const getSchoolInfo = () => config.school;

export const getBankInfo = () => config.bank;

export const getAcademicSettings = () => config.academic;

export const isFeatureEnabled = (feature) => {
  return config.features[feature] || false;
};

export const isDevelopment = () => {
  return config.development.nodeEnv === 'development';
};

export const getApiUrl = (endpoint) => {
  return `${config.apiUrl}${endpoint}`;
};

// Nigerian specific utilities
export const getNigerianStates = () => [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
  'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'FCT - Abuja'
];

export const getNigerianLGAs = (state) => {
  // Simplified LGA mapping - in production, this would be comprehensive
  const lgaMap = {
    'Lagos': ['Ikeja', 'Badagry', 'Epe', 'Ikorodu', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Oshodi-Isolo'],
    'Kaduna': ['Kaduna North', 'Kaduna South', 'Chikun', 'Giwa', 'Igabi', 'Kajuru', 'Kaura', 'Kauru'],
    'Abuja': ['Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'],
  };
  return lgaMap[state] || [];
};

export const getNigerianSubjects = () => [
  // Core Subjects (WAEC/NECO)
  'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics',
  'Civic Education', 'One Nigerian Language', 'Economics', 'Geography',
  'Government', 'History', 'Literature in English', 'Christian Religious Studies',
  'Islamic Religious Studies', 'French',
  
  // Elective Subjects
  'Further Mathematics', 'Technical Drawing', 'Agricultural Science', 'Home Economics',
  'Visual Art', 'Music', 'Physical and Health Education', 'Computer Studies',
  
  // Primary School Subjects
  'Basic Science', 'Social Studies', 'Creative Arts', 'Quantitative Reasoning',
  'Verbal Reasoning', 'Handwriting', 'Phonics'
];

export const getNigerianGradingScale = () => ({
  A: { score: 70, points: 5.0, grade: 'Excellent', remark: 'Excellent Performance' },
  B: { score: 60, points: 4.0, grade: 'Very Good', remark: 'Very Good Performance' },
  C: { score: 50, points: 3.0, grade: 'Good', remark: 'Good Performance' },
  D: { score: 45, points: 2.0, grade: 'Credit', remark: 'Credit Performance' },
  E: { score: 40, points: 1.0, grade: 'Pass', remark: 'Pass Performance' },
  F: { score: 0, points: 0.0, grade: 'Fail', remark: 'Fail - Needs Improvement' }
});

export const getNigerianClassLevels = () => ({
  PRIMARY: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
  JUNIOR_SECONDARY: ['JSS 1', 'JSS 2', 'JSS 3'],
  SENIOR_SECONDARY: ['SSS 1', 'SSS 2', 'SSS 3']
});

export const getSchoolTerms = () => ({
  TERM_1: { name: 'First Term', start: 'September', end: 'December', duration: 3 },
  TERM_2: { name: 'Second Term', start: 'January', end: 'April', duration: 4 },
  TERM_3: { name: 'Third Term', start: 'May', end: 'July', duration: 3 }
});

export default config;
