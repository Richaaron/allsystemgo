import React, { useState, useEffect } from 'react';
import './Settings.css';
import config from '../config/envConfig';
import { supabase } from '../services/supabaseService';

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState(user.role === 'admin' ? 'school-profile' : 'password');
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
    // Force Netlify redeploy with simplified settings function
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      console.log('Loading settings from Supabase Edge Function...');
      console.log('Function URL:', config.functionsUrl);
      console.log('Supabase Key available:', !!config.supabaseKey);
      console.log('Supabase Key length:', config.supabaseKey?.length || 0);
      
      // Call Supabase Edge Function (JWT verification disabled - no auth headers needed)
      const response = await fetch(`${config.functionsUrl}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data) {
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
      // Get current user from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) {
        setErrors({ general: 'Session expired. Please login again.' });
        setIsSubmitting(false);
        return;
      }

      console.log('🔐 Changing password for user:', userData.email);

      // Step 1: Verify current password by fetching user
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, email, password')
        .eq('id', userData.id)
        .single();

      if (fetchError) {
        console.error('❌ Failed to fetch user:', fetchError);
        setErrors({ general: 'Failed to verify current password. Please try again.' });
        setIsSubmitting(false);
        return;
      }

      if (!existingUser) {
        console.error('❌ User not found');
        setErrors({ general: 'User not found. Please login again.' });
        setIsSubmitting(false);
        return;
      }

      // Step 2: Verify current password matches
      if (existingUser.password !== passwordData.currentPassword) {
        console.error('❌ Current password does not match');
        setErrors({ currentPassword: 'Current password is incorrect' });
        setIsSubmitting(false);
        return;
      }

      // Step 3: Update password directly in database
      const { data, error } = await supabase
        .from('users')
        .update({
          password: passwordData.newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to update password:', error);
        setErrors({ general: 'Failed to update password: ' + error.message });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Password changed successfully for:', data.email);
      setSuccessMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('❌ Password change error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchoolProfileSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validation
    const newErrors = {};
    if (!schoolProfile.schoolEmail.trim()) {
      newErrors.schoolEmail = 'School email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolProfile.schoolEmail)) {
      newErrors.schoolEmail = 'Please enter a valid email address';
    }
    if (!schoolProfile.schoolPhone.trim()) {
      newErrors.schoolPhone = 'School phone number is required';
    }
    if (!schoolProfile.schoolAddress.trim()) {
      newErrors.schoolAddress = 'School address is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📝 Saving school profile to database...');

      // Update school in Supabase database
      const { data, error } = await supabase
        .from('schools')
        .update({
          name: schoolProfile.schoolName || 'Folusho Victory Schools',
          email: schoolProfile.schoolEmail,
          phone: schoolProfile.schoolPhone,
          address_city: schoolProfile.schoolAddress,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to save school profile:', error);
        setErrors({ general: 'Failed to save school profile: ' + error.message });
        setIsSubmitting(false);
        return;
      }

      // Also save to localStorage for offline access
      localStorage.setItem('schoolProfile', JSON.stringify(schoolProfile));

      console.log('✅ School profile saved successfully:', data);
      setSuccessMessage('School profile saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ School profile save error:', error);
      setErrors({ general: error.message || 'Failed to save school profile. Please try again.' });
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
      console.log('Saving result settings to Supabase Edge Function...');

      // Call Supabase Edge Function to update settings (JWT verification disabled)
      const response = await fetch(`${config.functionsUrl}/settings`, {
        method: 'PUT',
        headers: {
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

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error response:', errorData);
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      // Also save to localStorage for offline access
      localStorage.setItem('resultSettings', JSON.stringify(resultSettings));
      
      setSuccessMessage('Result settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Settings save error:', error);
      setErrors({ general: error.message || 'Failed to save settings. Please try again.' });
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

  const renderSchoolProfileTab = () => (
    <div className="settings-section">
      <h3>School Profile</h3>
      <p className="section-description">
        Manage your school's contact information and details. These will be displayed on reports and correspondence.
      </p>
      
      <form onSubmit={handleSchoolProfileSave} className="settings-form">
        <div className="form-group">
          <label>School Email *</label>
          <input
            type="email"
            name="schoolEmail"
            value={schoolProfile.schoolEmail}
            onChange={handleSchoolProfileInputChange}
            className={errors.schoolEmail ? 'error' : ''}
            placeholder="e.g., info@folushovictory.com"
          />
          {errors.schoolEmail && <span className="error-message">{errors.schoolEmail}</span>}
          <small>Official school email address for contact and correspondence</small>
        </div>

        <div className="form-group">
          <label>School Phone Number *</label>
          <input
            type="tel"
            name="schoolPhone"
            value={schoolProfile.schoolPhone}
            onChange={handleSchoolProfileInputChange}
            className={errors.schoolPhone ? 'error' : ''}
            placeholder="e.g., +234-800-000-0000"
          />
          {errors.schoolPhone && <span className="error-message">{errors.schoolPhone}</span>}
          <small>Primary contact phone number for the school</small>
        </div>

        <div className="form-group">
          <label>School Address *</label>
          <input
            type="text"
            name="schoolAddress"
            value={schoolProfile.schoolAddress}
            onChange={handleSchoolProfileInputChange}
            className={errors.schoolAddress ? 'error' : ''}
            placeholder="e.g., 123 School Street, Kaduna, Kaduna State"
          />
          {errors.schoolAddress && <span className="error-message">{errors.schoolAddress}</span>}
          <small>Complete physical address of the school</small>
        </div>

        <div className="form-group">
          <label>School Motto</label>
          <input
            type="text"
            name="schoolMotto"
            value={schoolProfile.schoolMotto}
            onChange={handleSchoolProfileInputChange}
            placeholder="e.g., Excellence in Education Since 2009"
          />
          <small>School motto or tagline</small>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving Profile...' : 'Save School Profile'}
          </button>
        </div>
      </form>
    </div>
  );

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
                className={`tab-btn ${activeTab === 'school-profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('school-profile')}
              >
                School Profile
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
          {user.role === 'admin' && activeTab === 'school-profile' && renderSchoolProfileTab()}
          {activeTab === 'password' && renderPasswordTab()}
        </div>
      )}
    </div>
  );
};

export default Settings;
