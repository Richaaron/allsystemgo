// FOLUSHO VICTORY SCHOOLS - API Service
// Connects frontend to backend API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password, role) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Schools
  async getSchoolInfo() {
    return await this.request('/schools');
  }

  // Teachers
  async getTeachers() {
    return await this.request('/teachers');
  }

  async createTeacher(teacherData) {
    return await this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  }

  async updateTeacher(id, teacherData) {
    return await this.request(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData),
    });
  }

  async deleteTeacher(id) {
    return await this.request(`/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  // Students
  async getStudents() {
    return await this.request('/students');
  }

  async createStudent(studentData) {
    return await this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id, studentData) {
    return await this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(id) {
    return await this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Classes
  async getClasses() {
    return await this.request('/classes');
  }

  async createClass(classData) {
    return await this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async updateClass(id, classData) {
    return await this.request(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  }

  async deleteClass(id) {
    return await this.request(`/classes/${id}`, {
      method: 'DELETE',
    });
  }

  // Results
  async getResults() {
    return await this.request('/results');
  }

  async createResult(resultData) {
    return await this.request('/results', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  }

  async updateResult(id, resultData) {
    return await this.request(`/results/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resultData),
    });
  }

  // Academic Years
  async getAcademicYears() {
    return await this.request('/academic-years');
  }

  // School Terms
  async getSchoolTerms() {
    return await this.request('/school-terms');
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
