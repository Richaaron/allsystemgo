import React, { useState, useRef, useEffect } from 'react';
import { mockLogin } from '../services/mockApi';
import './Login.css';
import '../styles/accessibility.css';
import '../styles/royal-login.css';

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [formData, setFormData] = useState({
    email: 'admin@folushovictory.com',
    password: 'admin123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Refs for focus management
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const firstRoleRef = useRef(null);
  
  // Auto-focus first role selection on mount
  useEffect(() => {
    if (firstRoleRef.current) {
      firstRoleRef.current.focus();
    }
  }, []);

  const roleCredentials = {
    admin: { email: 'admin@folushovictory.com', password: 'admin123' },
    teacher: { email: 'teacher@folushovictory.com', password: 'teacher123' },
    parent: { email: 'parent@folushovictory.com', password: 'parent123' }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(roleCredentials[role]);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await mockLogin(formData.email, formData.password, selectedRole);
      const { token, user } = result.data;
      onLogin(user, token);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      // Focus back to first input for better UX
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="royal-login-container">
        <div className="royal-particles">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="royal-particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
        <main className="royal-login-card" id="main-content" role="main">
          <div className="royal-logo">
            <div className="royal-logo-text">FVS</div>
            <div className="royal-logo-subtitle">FOLUSHO VICTORY SCHOOLS</div>
          </div>

          <section className="royal-role-selection" aria-labelledby="role-heading">
            <h2 id="role-heading" className="royal-role-title">Select Your Role</h2>
            <div className="royal-roles-grid" role="radiogroup" aria-label="User role selection">
              {['admin', 'teacher', 'parent'].map((role, index) => (
                <div
                  key={role}
                  ref={index === 0 ? firstRoleRef : null}
                  className={`royal-role-card ${selectedRole === role ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect(role)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRoleSelect(role);
                    }
                  }}
                  role="radio"
                  aria-checked={selectedRole === role}
                  aria-label={`${role.charAt(0).toUpperCase() + role.slice(1)} role`}
                  tabIndex={selectedRole === role ? 0 : -1}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    transform: `rotateY(${selectedRole === role ? '0deg' : '180deg'})`
                  }}
                >
                  <div className="role-icon-3d" aria-hidden="true">
                    <div className="icon-front">
                      {role === 'admin' ? '👨‍💼' : role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧‍👦'}
                    </div>
                    <div className="icon-back">
                      {role === 'admin' ? 'ADMIN' : role === 'teacher' ? 'TEACHER' : 'PARENT'}
                    </div>
                  </div>
                  <div className="role-content-3d">
                    <div className="role-title-3d">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </div>
                    <div className="role-description-3d">
                      {role === 'admin' ? 'Full system access and management' :
                       role === 'teacher' ? 'Class management and student tracking' :
                       'View child progress and results'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <form className="login-form-3d" onSubmit={handleSubmit} noValidate>
            <div className="form-group-3d">
              <label htmlFor="email" className="label-3d form-label required">
                Email Address
              </label>
              <div className="input-wrapper-3d">
                <input
                  ref={emailInputRef}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  aria-required="true"
                  aria-describedby={error ? "email-error" : undefined}
                  aria-invalid={!!error}
                  className="input-3d form-input"
                  autoComplete="email"
                />
                <div className="input-icon-3d" aria-hidden="true">📧</div>
              </div>
            </div>

            <div className="form-group-3d">
              <label htmlFor="password" className="label-3d form-label required">
                Password
              </label>
              <div className="input-wrapper-3d">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  aria-required="true"
                  aria-describedby={error ? "password-error" : undefined}
                  aria-invalid={!!error}
                  className="input-3d form-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-3d"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#64748b',
                    padding: '8px',
                    borderRadius: '4px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                    minHeight: '40px'
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
                <div className="input-icon-3d" aria-hidden="true">🔒</div>
              </div>
            </div>

            
            {error && (
              <div 
                className="error-message-3d form-error" 
                role="alert" 
                aria-live="polite"
                id="login-error"
              >
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-btn-3d btn btn-primary" 
              disabled={loading}
              ref={submitButtonRef}
              aria-describedby={error ? "login-error" : undefined}
            >
              <div className="btn-content-3d">
                <span className="btn-text-3d">
                  {loading ? (
                    <>
                      <span className="loading-spinner" aria-hidden="true"></span>
                      <span>Authenticating...</span>
                    </>
                  ) : 'Access System'}
                </span>
                <div className="btn-glow-3d" aria-hidden="true"></div>
              </div>
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default Login;
