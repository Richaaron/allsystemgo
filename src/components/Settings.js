import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState(user.role === 'admin' ? 'result-settings' : 'password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // School profile state
  const [schoolProfile, setSchoolProfile] = useState({
    schoolName: 'Folusho Victory Schools',
    schoolEmail: 'info@folushovictory.com',
    schoolPhone: '+234-800-000-0000',
    schoolAddress: 'Kaduna, Kaduna State',
    schoolMotto: 'Excellence in Education Since 2009'
  });

  // Admin result settings state
  const [resultSettings, setResultSettings] = useState({
    principalName: '',
    principalTitle: 'Principal',
    proprietressName: '',
    proprietressTitle: 'Proprietress',
    schoolMotto: 'Excellence in Education',
    resultHeader: 'FOLUSHO VICTORY SCHOOLS',
    resultFooter: 'Approved by the Ministry of Education',
    showGrades: true,
    showPositions: true,
    showRemarks: true
  });

  // Load saved settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Convert snake_case from API to camelCase for state
        setResultSettings({
          principalName: data.principal_name || '',
          principalTitle: data.principal_title || 'Principal',
          proprietressName: data.proprietress_name || '',
          proprietressTitle: data.proprietress_title || 'Proprietress',
          schoolMotto: data.school_motto || 'Excellence in Education Since 2009',
          resultHeader: data.result_header || 'FOLUSHO VICTORY SCHOOLS',
          resultFooter: data.result_footer || 'Approved by the Ministry of Education',
          showGrades: data.show_grades !== false,
          showPositions: data.show_positions !== false,
          showRemarks: data.show_remarks !== false
        });

        setSchoolProfile({
          schoolName: 'Folusho Victory Schools',
          schoolEmail: data.school_email || 'info@folushovictory.com',
          schoolPhone: data.school_phone || '+234-800-000-0000',
          schoolAddress: data.school_address || 'Kaduna, Kaduna State',
          schoolMotto: data.school_motto || 'Excellence in Education Since 2009'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Fall back to localStorage if API fails
      const savedSettings = localStorage.getItem('resultSettings');
      if (savedSettings) {
        setResultSettings(JSON.parse(savedSettings));
      }
      const savedProfile = localStorage.getItem('schoolProfile');
      if (savedProfile) {
        setSchoolProfile(JSON.parse(savedProfile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validation
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ currentPassword: data.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setErrors({ general: 'Failed to change password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchoolProfileSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          school_email: schoolProfile.schoolEmail,
          school_phone: schoolProfile.schoolPhone,
          school_address: schoolProfile.schoolAddress,
          school_motto: schoolProfile.schoolMotto
        })
      });

      if (response.ok) {
        // Also save to localStorage for offline access
        localStorage.setItem('schoolProfile', JSON.stringify(schoolProfile));
        
        setSuccessMessage('School profile saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ general: 'Failed to save school profile. Please try again.' });
      }
    } catch (error) {
      console.error('School profile save error:', error);
      setErrors({ general: 'Failed to save school profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResultSettingsSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validation
    const newErrors = {};
    if (!resultSettings.principalName.trim()) {
      newErrors.principalName = 'Principal name is required';
    }
    if (!resultSettings.proprietressName.trim()) {
      newErrors.proprietressName = 'Proprietress name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          principal_name: resultSettings.principalName,
          principal_title: resultSettings.principalTitle,
          proprietress_name: resultSettings.proprietressName,
          proprietress_title: resultSettings.proprietressTitle,
          school_motto: resultSettings.schoolMotto,
          result_header: resultSettings.resultHeader,
          result_footer: resultSettings.resultFooter,
          show_grades: resultSettings.showGrades,
          show_positions: resultSettings.showPositions,
          show_remarks: resultSettings.showRemarks
        })
      });

      if (response.ok) {
        // Also save to localStorage for offline access
        localStorage.setItem('resultSettings', JSON.stringify(resultSettings));
        
        setSuccessMessage('Result settings saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ general: 'Failed to save settings. Please try again.' });
      }
    } catch (error) {
      console.error('Settings save error:', error);
      setErrors({ general: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSettingsInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResultSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSchoolProfileInputChange = (e) => {
    const { name, value } = e.target;
    setSchoolProfile(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderPasswordTab = () => (
    <div className="settings-section">
      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange} className="settings-form">
        <div className="form-group">
          <label>Current Password *</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            className={errors.currentPassword ? 'error' : ''}
            placeholder="Enter current password"
          />
          {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
        </div>

        <div className="form-group">
          <label>New Password *</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            className={errors.newPassword ? 'error' : ''}
            placeholder="Enter new password (min 6 characters)"
          />
          {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
        </div>

        <div className="form-group">
          <label>Confirm New Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
            className={errors.confirmPassword ? 'error' : ''}
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderResultSettingsTab = () => (
    <div className="settings-section">
      <h3>Result Customization Settings</h3>
      <p className="section-description">
        Configure how student results will appear on printed reports and certificates.
      </p>
      
      <form onSubmit={handleResultSettingsSave} className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label>Principal Name *</label>
            <input
              type="text"
              name="principalName"
              value={resultSettings.principalName}
              onChange={handleSettingsInputChange}
              className={errors.principalName ? 'error' : ''}
              placeholder="e.g., Dr. Adebayo Johnson"
            />
            {errors.principalName && <span className="error-message">{errors.principalName}</span>}
            <small>This name will appear as signature on result documents</small>
          </div>

          <div className="form-group">
            <label>Proprietress Name *</label>
            <input
              type="text"
              name="proprietressName"
              value={resultSettings.proprietressName}
              onChange={handleSettingsInputChange}
              className={errors.proprietressName ? 'error' : ''}
              placeholder="e.g., Mrs. Funke Adebayo"
            />
            {errors.proprietressName && <span className="error-message">{errors.proprietressName}</span>}
            <small>This name will appear as signature on result documents</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>School Motto</label>
            <input
              type="text"
              name="schoolMotto"
              value={resultSettings.schoolMotto}
              onChange={handleSettingsInputChange}
              placeholder="Enter school motto"
            />
          </div>

          <div className="form-group">
            <label>Result Header</label>
            <input
              type="text"
              name="resultHeader"
              value={resultSettings.resultHeader}
              onChange={handleSettingsInputChange}
              placeholder="Result document header"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Result Footer</label>
          <input
            type="text"
            name="resultFooter"
            value={resultSettings.resultFooter}
            onChange={handleSettingsInputChange}
            placeholder="Result document footer"
          />
        </div>

        <div className="checkbox-group">
          <h4>Display Options</h4>
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showGrades"
                checked={resultSettings.showGrades}
                onChange={handleSettingsInputChange}
              />
              <span>Show Grades</span>
            </label>
          </div>
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showPositions"
                checked={resultSettings.showPositions}
                onChange={handleSettingsInputChange}
              />
              <span>Show Class Positions</span>
            </label>
          </div>
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showRemarks"
                checked={resultSettings.showRemarks}
                onChange={handleSettingsInputChange}
              />
              <span>Show Teacher Remarks</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving Settings...' : 'Save Settings'}
          </button>
        </div>
      </form>

      <div className="preview-section">
        <h4>Result Signature Preview</h4>
        <div className="result-preview">
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Principal Signature Preview */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                border: '2px dashed #1f2937',
                borderRadius: '8px',
                padding: '20px 15px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))'
              }}>
                <div style={{
                  borderTop: '3px solid #1f2937',
                  width: '120px',
                  margin: '0 auto 12px',
                  paddingTop: '8px'
                }}>
                  <div style={{
                    fontSize: '22px',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontFamily: 'Brush Script MT, cursive, serif'
                  }}>
                    {resultSettings.principalName ? resultSettings.principalName.split(' ')[0] : 'Sig'}
                  </div>
                </div>
                <p style={{ margin: '6px 0 3px 0', fontWeight: 'bold', fontSize: '12px', color: '#1f2937' }}>
                  {resultSettings.principalName || 'Principal Name'}
                </p>
                <p style={{ margin: '0px', fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Principal
                </p>
              </div>
            </div>

            {/* Proprietress Signature Preview */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                border: '2px dashed #1f2937',
                borderRadius: '8px',
                padding: '20px 15px',
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(168, 85, 247, 0.05))'
              }}>
                <div style={{
                  borderTop: '3px solid #1f2937',
                  width: '120px',
                  margin: '0 auto 12px',
                  paddingTop: '8px'
                }}>
                  <div style={{
                    fontSize: '22px',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontFamily: 'Brush Script MT, cursive, serif'
                  }}>
                    {resultSettings.proprietressName ? resultSettings.proprietressName.split(' ')[0] : 'Sig'}
                  </div>
                </div>
                <p style={{ margin: '6px 0 3px 0', fontWeight: 'bold', fontSize: '12px', color: '#1f2937' }}>
                  {resultSettings.proprietressName || 'Proprietress Name'}
                </p>
                <p style={{ margin: '0px', fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Proprietress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>Settings</h2>
        <div className="tabs">
          {user.role === 'admin' && (
            <>
              <button
                className={`tab-btn ${activeTab === 'result-settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('result-settings')}
              >
                Result Settings
              </button>
              <button
                className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Password
              </button>
            </>
          )}
          {user.role !== 'admin' && (
            <button
              className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading settings...</p>
        </div>
      )}

      {successMessage && !isLoading && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      {errors.general && !isLoading && (
        <div className="error-message general">
          ❌ {errors.general}
        </div>
      )}

      {!isLoading && (
        <div className="settings-content">
          {user.role === 'admin' && activeTab === 'result-settings' && renderResultSettingsTab()}
          {activeTab === 'password' && renderPasswordTab()}
        </div>
      )}
    </div>
  );
};

export default Settings;
