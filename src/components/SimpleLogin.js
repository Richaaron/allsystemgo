import React, { useState } from 'react';
import './SimpleLogin.css';

// Helper functions for role management
const getRoleDisplayName = (role) => {
  switch (role) {
    case 'admin':
      return 'School Administrator';
    case 'form_teacher':
      return 'Form Teacher';
    case 'subject_teacher':
      return 'Subject Teacher';
    case 'dual_role':
      return 'Dual Role Teacher';
    case 'parent':
      return 'Parent';
    default:
      return 'User';
  }
};

const getRoleDepartment = (role) => {
  switch (role) {
    case 'admin':
      return 'Administration';
    case 'form_teacher':
      return 'Class Management';
    case 'subject_teacher':
      return 'Academic';
    case 'dual_role':
      return 'Class & Academic';
    case 'parent':
      return 'Parent Portal';
    default:
      return 'General';
  }
};

const getRolePermissions = (role) => {
  switch (role) {
    case 'admin':
      return [
        'manage_teachers', 'manage_students', 'manage_classes', 
        'manage_results', 'manage_fees', 'manage_attendance',
        'view_reports', 'system_settings'
      ];
    case 'form_teacher':
      return [
        'view_assigned_class_students', 'manage_class_attendance',
        'view_class_results', 'add_class_remarks', 'manage_class_discipline',
        'communicate_with_parents'
      ];
    case 'subject_teacher':
      return [
        'view_assigned_subject_students', 'enter_subject_results',
        'manage_subject_attendance', 'add_subject_remarks',
        'view_subject_performance'
      ];
    case 'dual_role':
      return [
        'view_assigned_class_students', 'manage_class_attendance',
        'view_class_results', 'add_class_remarks', 'manage_class_discipline',
        'communicate_with_parents', 'view_assigned_subject_students',
        'enter_subject_results', 'manage_subject_attendance',
        'add_subject_remarks', 'view_subject_performance'
      ];
    case 'parent':
      return [
        'view_children_results', 'view_children_attendance',
        'view_children_fees', 'communicate_with_teachers'
      ];
    default:
      return [];
  }
};

const SimpleLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - accept any credentials for demo
      const userData = {
        id: 1,
        username: formData.username,
        name: getRoleDisplayName(formData.role),
        role: formData.role,
        email: formData.username + '@folushovictory.sch.ng',
        department: getRoleDepartment(formData.role),
        permissions: getRolePermissions(formData.role)
      };
      
      onLogin(userData, 'mock-token-' + Date.now());
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="simple-login">
      <div className="login-container">
        <div className="login-header">
          <div className="school-logo">
          <h1 className="graduation-cap">🎓</h1>
          <h2>FOLUSHO VICTORY SCHOOLS</h2>
          <p>Excellence in Education Since 2009</p>
        </div>
        </div>

        <div className="login-form">
          <h3>Staff Login Portal</h3>
          <p>Enter your credentials to access the system</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                style={{ paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '38px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#64748b',
                  padding: '5px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#3b82f6';
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#64748b';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Login As</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="admin">Administrator</option>
                <option value="form_teacher">Form Teacher</option>
                <option value="subject_teacher">Subject Teacher</option>
                <option value="dual_role">Dual Role Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            {errors.general && (
              <div className="error-message general">{errors.general}</div>
            )}

            <button type="submit" disabled={isSubmitting} className="login-btn">
              {isSubmitting ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

                  </div>

        <div className="login-footer">
          <p>© 2024 Folusho Victory Schools. All rights reserved.</p>
          <p>Nigerian School Management System</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
