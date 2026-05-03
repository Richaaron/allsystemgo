import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState(user.role === 'admin' ? 'result-settings' : 'password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Admin result settings state
  const [resultSettings, setResultSettings] = useState({
    principalName: '',
    proprietressName: '',
    schoolMotto: 'Excellence in Education',
    resultHeader: 'FOLUSHO VICTORY SCHOOLS',
    resultFooter: 'Approved by the Ministry of Education',
    showGrades: true,
    showPositions: true,
    showRemarks: true
  });

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('resultSettings');
    if (savedSettings) {
      setResultSettings(JSON.parse(savedSettings));
    }
  }, []);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock password validation (in real app, this would validate against backend)
      if (passwordData.currentPassword === 'admin123' || passwordData.currentPassword === 'teacher123') {
        setSuccessMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setErrors({ currentPassword: 'Current password is incorrect' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setErrors({ general: 'Failed to change password. Please try again.' });
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage (in real app, this would save to backend)
      localStorage.setItem('resultSettings', JSON.stringify(resultSettings));
      
      setSuccessMessage('Result settings saved successfully!');
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
        <h4>Result Preview</h4>
        <div className="result-preview">
          <div className="preview-header">
            <h4>{resultSettings.resultHeader}</h4>
            <p>{resultSettings.schoolMotto}</p>
          </div>
          <div className="preview-content">
            <div className="preview-marks">
              <p>English Language: A1</p>
              <p>Mathematics: B2</p>
              <p>Science: B3</p>
            </div>
            <div className="preview-signatures">
              <div className="signature-block">
                <p>_________________________</p>
                <p><strong>{resultSettings.principalName || 'Principal Name'}</strong></p>
                <p>Principal</p>
              </div>
              <div className="signature-block">
                <p>_________________________</p>
                <p><strong>{resultSettings.proprietressName || 'Proprietress Name'}</strong></p>
                <p>Proprietress</p>
              </div>
            </div>
          </div>
          <div className="preview-footer">
            <p>{resultSettings.resultFooter}</p>
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

      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="error-message general">
          ❌ {errors.general}
        </div>
      )}

      <div className="settings-content">
        {user.role === 'admin' && activeTab === 'result-settings' && renderResultSettingsTab()}
        {activeTab === 'password' && renderPasswordTab()}
      </div>
    </div>
  );
};

export default Settings;
