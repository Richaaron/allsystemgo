import React, { useState, useEffect } from 'react';
import { TeacherAssignmentService, TEACHER_ROLES } from '../data/teacherModels';
import { EmailService } from '../services/emailService';
import { CredentialService } from '../services/credentialService';
import './AdminTeacherCreation.css';

const AdminTeacherCreation = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      gender: 'male',
      nationality: 'Nigerian',
      stateOfOrigin: '',
      lga: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: ''
    },
    professionalInfo: {
      role: TEACHER_ROLES.SUBJECT_TEACHER,
      department: '',
      specialization: '',
      experience: '',
      previousSchool: '',
      employmentType: 'full-time',
      salary: ''
    },
    assignments: {
      assignedClass: '',
      assignedSubjects: [],
      stream: '' // For SSS classes
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdTeacher, setCreatedTeacher] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);

  // Nigerian states
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  // Available subjects
  const availableSubjects = [
    'English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry',
    'Government', 'Literature in English', 'Account', 'Commerce', 'Economics',
    'Religious Studies', 'ICT', 'Civic Education', 'Marketing', 'Geography',
    'Agricultural Science', 'National Values', 'Business Studies', 'Home Economics',
    'Physical & Health Education', 'Basic Science', 'Basic Technology', 'Fine Arts',
    'Computer Studies', 'Hausa', 'Yoruba Language', 'Igbo Language', 'Social Studies',
    'Creative Arts', 'Verbal Reasoning', 'Quantitative Reasoning', 'Handwriting', 'Phonics'
  ];

  // Available classes
  const availableClasses = [
    'Pre-Nursery 1', 'Pre-Nursery 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  // Departments
  const departments = [
    'Sciences', 'Mathematics', 'Languages', 'Social Sciences', 'Vocational Studies',
    'Physical Education', 'Primary Education', 'Early Childhood Education', 'Administration'
  ];

  // Handle form field changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle subject selection
  const handleSubjectToggle = (subject) => {
    setFormData(prev => {
      const subjects = prev.assignments.assignedSubjects;
      if (subjects.includes(subject)) {
        return {
          ...prev,
          assignments: {
            ...prev.assignments,
            assignedSubjects: subjects.filter(s => s !== subject)
          }
        };
      } else {
        return {
          ...prev,
          assignments: {
            ...prev.assignments,
            assignedSubjects: [...subjects, subject]
          }
        };
      }
    });
  };

  // Validate form step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Personal info validation
      if (!formData.personalInfo.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.personalInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.personalInfo.email.trim()) newErrors.email = 'Email is required';
      if (!formData.personalInfo.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.personalInfo.gender) newErrors.gender = 'Gender is required';
      if (!formData.personalInfo.stateOfOrigin) newErrors.stateOfOrigin = 'State of origin is required';
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.personalInfo.email && !emailRegex.test(formData.personalInfo.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Phone validation
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (formData.personalInfo.phone && !phoneRegex.test(formData.personalInfo.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    } else if (step === 2) {
      // Professional info validation
      if (!formData.professionalInfo.role) newErrors.role = 'Role is required';
      if (!formData.professionalInfo.department) newErrors.department = 'Department is required';
      if (!formData.professionalInfo.experience) newErrors.experience = 'Experience is required';
      
      // Salary validation for full-time
      if (formData.professionalInfo.employmentType === 'full-time' && !formData.professionalInfo.salary) {
        newErrors.salary = 'Salary is required for full-time employment';
      }
    } else if (step === 3) {
      // Assignment validation
      if (formData.professionalInfo.role === TEACHER_ROLES.FORM_TEACHER && !formData.assignments.assignedClass) {
        newErrors.assignedClass = 'Class assignment is required for Form Teacher';
      }
      
      if (formData.professionalInfo.role === TEACHER_ROLES.SUBJECT_TEACHER && formData.assignments.assignedSubjects.length === 0) {
        newErrors.assignedSubjects = 'At least one subject assignment is required for Subject Teacher';
      }
      
      if (formData.professionalInfo.role === TEACHER_ROLES.DUAL_ROLE) {
        if (!formData.assignments.assignedClass) {
          newErrors.assignedClass = 'Class assignment is required for Dual Role Teacher';
        }
        if (formData.assignments.assignedSubjects.length === 0) {
          newErrors.assignedSubjects = 'At least one subject assignment is required for Dual Role Teacher';
        }
      }
      
      // Stream validation for SSS classes
      if (formData.assignments.assignedClass && formData.assignments.assignedClass.includes('SSS')) {
        if (!formData.assignments.stream) {
          newErrors.stream = 'Stream assignment is required for SSS classes';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get existing staff IDs to avoid duplicates
      const existingStaffIds = TeacherAssignmentService.MOCK_TEACHERS.map(t => t.staffId);
      
      // Generate credentials
      const credentials = CredentialService.generateTeacherCredentials(formData.personalInfo, existingStaffIds);
      
      // Create teacher object
      const teacherData = {
        ...formData.personalInfo,
        ...formData.professionalInfo,
        ...formData.assignments,
        ...credentials,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      // Send email with credentials
      setEmailStatus('sending');
      const emailResult = await EmailService.sendTeacherCredentials(teacherData, credentials);
      
      if (emailResult.success) {
        setEmailStatus('sent');
        setCreatedTeacher(teacherData);
        setSubmitSuccess(true);
        
        // In a real application, you would save to database here
        console.log('Teacher created successfully:', teacherData);
        console.log('Credentials sent via email:', emailResult);
      } else {
        setEmailStatus('failed');
        throw new Error('Failed to send credentials email');
      }
      
    } catch (error) {
      console.error('Teacher creation error:', error);
      setEmailStatus('failed');
      alert('Teacher creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setFormData({
      personalInfo: {
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phone: '',
        gender: 'male',
        nationality: 'Nigerian',
        stateOfOrigin: '',
        lga: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: ''
      },
      professionalInfo: {
        role: TEACHER_ROLES.SUBJECT_TEACHER,
        department: '',
        specialization: '',
        experience: '',
        previousSchool: '',
        employmentType: 'full-time',
        salary: ''
      },
      assignments: {
        assignedClass: '',
        assignedSubjects: [],
        stream: ''
      }
    });
    setCurrentStep(1);
    setErrors({});
    setSubmitSuccess(false);
    setCreatedTeacher(null);
    setEmailStatus(null);
  };

  // Get available classes based on role
  const getAvailableClasses = () => {
    if (formData.professionalInfo.role === TEACHER_ROLES.FORM_TEACHER || 
        formData.professionalInfo.role === TEACHER_ROLES.DUAL_ROLE) {
      return availableClasses;
    }
    return [];
  };

  // Get available subjects based on role
  const getAvailableSubjects = () => {
    if (formData.professionalInfo.role === TEACHER_ROLES.SUBJECT_TEACHER || 
        formData.professionalInfo.role === TEACHER_ROLES.DUAL_ROLE) {
      return availableSubjects;
    }
    return [];
  };

  if (submitSuccess && createdTeacher) {
    return (
      <div className="admin-teacher-creation">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>Teacher Created Successfully!</h2>
          <div className="success-details">
            <h3>{createdTeacher.firstName} {createdTeacher.lastName}</h3>
            <p><strong>Staff ID:</strong> {createdTeacher.staffId}</p>
            <p><strong>Email:</strong> {createdTeacher.email}</p>
            <p><strong>Role:</strong> {TeacherAssignmentService.TEACHER_ROLE_DESCRIPTIONS[createdTeacher.role].title}</p>
            <p><strong>Department:</strong> {createdTeacher.department}</p>
            
            {createdTeacher.assignedClass && (
              <p><strong>Assigned Class:</strong> {createdTeacher.assignedClass}</p>
            )}
            
            {createdTeacher.assignedSubjects.length > 0 && (
              <p><strong>Assigned Subjects:</strong> {createdTeacher.assignedSubjects.join(', ')}</p>
            )}
            
            <div className="email-status">
              <h4>Credentials Delivery Status:</h4>
              <div className={`status-badge ${emailStatus}`}>
                {emailStatus === 'sent' && '✅ Email sent successfully'}
                {emailStatus === 'sending' && '⏳ Sending email...'}
                {emailStatus === 'failed' && '❌ Email failed to send'}
              </div>
              {emailStatus === 'sent' && (
                <p>Login credentials have been sent to <strong>{createdTeacher.email}</strong></p>
              )}
            </div>
          </div>
          
          <div className="success-actions">
            <button onClick={handleResetForm} className="btn-primary">
              Create Another Teacher
            </button>
            <button onClick={() => window.history.back()} className="btn-secondary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-teacher-creation">
      <div className="creation-header">
        <h1>Create New Teacher Account</h1>
        <p>Add a new teacher to the system and automatically send login credentials</p>
      </div>

      <div className="progress-bar">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>Personal Info</div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>Professional Info</div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>Assignments</div>
        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>Review & Create</div>
      </div>

      <form onSubmit={handleSubmit} className="creation-form">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label>Middle Name</label>
                <input
                  type="text"
                  value={formData.personalInfo.middleName}
                  onChange={(e) => handleInputChange('personalInfo', 'middleName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>



              <div className="form-group">
                <label>Gender *</label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label>Nationality</label>
                <input
                  type="text"
                  value={formData.personalInfo.nationality}
                  onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>State of Origin *</label>
                <select
                  value={formData.personalInfo.stateOfOrigin}
                  onChange={(e) => handleInputChange('personalInfo', 'stateOfOrigin', e.target.value)}
                  className={errors.stateOfOrigin ? 'error' : ''}
                >
                  <option value="">Select State</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.stateOfOrigin && <span className="error-message">{errors.stateOfOrigin}</span>}
              </div>

              <div className="form-group">
                <label>LGA</label>
                <input
                  type="text"
                  value={formData.personalInfo.lga}
                  onChange={(e) => handleInputChange('personalInfo', 'lga', e.target.value)}
                />
              </div>



              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.personalInfo.emergencyContactName}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContactName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={formData.personalInfo.emergencyContactPhone}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContactPhone', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Emergency Contact Relationship</label>
                <input
                  type="text"
                  value={formData.personalInfo.emergencyContactRelationship}
                  onChange={(e) => handleInputChange('personalInfo', 'emergencyContactRelationship', e.target.value)}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Professional Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Teacher Role *</label>
                <select
                  value={formData.professionalInfo.role}
                  onChange={(e) => handleInputChange('professionalInfo', 'role', e.target.value)}
                  className={errors.role ? 'error' : ''}
                >
                  <option value="">Select Role</option>
                  <option value={TEACHER_ROLES.FORM_TEACHER}>Form Teacher</option>
                  <option value={TEACHER_ROLES.SUBJECT_TEACHER}>Subject Teacher</option>
                  <option value={TEACHER_ROLES.DUAL_ROLE}>Dual Role Teacher</option>
                </select>
                {errors.role && <span className="error-message">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  value={formData.professionalInfo.department}
                  onChange={(e) => handleInputChange('professionalInfo', 'department', e.target.value)}
                  className={errors.department ? 'error' : ''}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
              </div>



              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  value={formData.professionalInfo.specialization}
                  onChange={(e) => handleInputChange('professionalInfo', 'specialization', e.target.value)}
                  placeholder="e.g., Mathematics Education, English Literature"
                />
              </div>

              <div className="form-group">
                <label>Years of Experience *</label>
                <select
                  value={formData.professionalInfo.experience}
                  onChange={(e) => handleInputChange('professionalInfo', 'experience', e.target.value)}
                  className={errors.experience ? 'error' : ''}
                >
                  <option value="">Select Experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="16-20">16-20 years</option>
                  <option value="20+">20+ years</option>
                </select>
                {errors.experience && <span className="error-message">{errors.experience}</span>}
              </div>

              <div className="form-group">
                <label>Previous School</label>
                <input
                  type="text"
                  value={formData.professionalInfo.previousSchool}
                  onChange={(e) => handleInputChange('professionalInfo', 'previousSchool', e.target.value)}
                />
              </div>



              <div className="form-group">
                <label>Employment Type</label>
                <select
                  value={formData.professionalInfo.employmentType}
                  onChange={(e) => handleInputChange('professionalInfo', 'employmentType', e.target.value)}
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
              </div>

              <div className="form-group">
                <label>Monthly Salary (₦)</label>
                <input
                  type="number"
                  value={formData.professionalInfo.salary}
                  onChange={(e) => handleInputChange('professionalInfo', 'salary', e.target.value)}
                  className={errors.salary ? 'error' : ''}
                  placeholder="e.g., 150000"
                />
                {errors.salary && <span className="error-message">{errors.salary}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Assignments */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Assignments</h2>
            
            {/* Class Assignment */}
            {(formData.professionalInfo.role === TEACHER_ROLES.FORM_TEACHER || 
              formData.professionalInfo.role === TEACHER_ROLES.DUAL_ROLE) && (
              <div className="assignment-section">
                <h3>Class Assignment</h3>
                <div className="form-group">
                  <label>Assigned Class *</label>
                  <select
                    value={formData.assignments.assignedClass}
                    onChange={(e) => handleInputChange('assignments', 'assignedClass', e.target.value)}
                    className={errors.assignedClass ? 'error' : ''}
                  >
                    <option value="">Select Class</option>
                    {getAvailableClasses().map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  {errors.assignedClass && <span className="error-message">{errors.assignedClass}</span>}
                </div>

                {/* Stream selection for SSS */}
                {formData.assignments.assignedClass && formData.assignments.assignedClass.includes('SSS') && (
                  <div className="form-group">
                    <label>Stream *</label>
                    <select
                      value={formData.assignments.stream}
                      onChange={(e) => handleInputChange('assignments', 'stream', e.target.value)}
                      className={errors.stream ? 'error' : ''}
                    >
                      <option value="">Select Stream</option>
                      <option value="Science">Science</option>
                      <option value="Art">Art</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                    {errors.stream && <span className="error-message">{errors.stream}</span>}
                  </div>
                )}
              </div>
            )}

            {/* Subject Assignment */}
            {(formData.professionalInfo.role === TEACHER_ROLES.SUBJECT_TEACHER || 
              formData.professionalInfo.role === TEACHER_ROLES.DUAL_ROLE) && (
              <div className="assignment-section">
                <h3>Subject Assignment</h3>
                <div className="subjects-grid">
                  {getAvailableSubjects().map(subject => (
                    <div key={subject} className="subject-item">
                      <label className="subject-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.assignments.assignedSubjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                        />
                        <span className="subject-name">{subject}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.assignedSubjects && <span className="error-message">{errors.assignedSubjects}</span>}
                
                <div className="selected-subjects">
                  <h4>Selected Subjects ({formData.assignments.assignedSubjects.length})</h4>
                  <div className="selected-list">
                    {formData.assignments.assignedSubjects.map(subject => (
                      <span key={subject} className="selected-subject">
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleSubjectToggle(subject)}
                          className="remove-subject"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review & Create */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2>Review & Create Teacher</h2>
            <div className="review-section">
              <div className="review-card">
                <h3>Personal Information</h3>
                <div className="review-grid">
                  <div className="review-item">
                    <span className="label">Name:</span>
                    <span className="value">
                      {formData.personalInfo.firstName} {formData.personalInfo.middleName} {formData.personalInfo.lastName}
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="label">Email:</span>
                    <span className="value">{formData.personalInfo.email}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Phone:</span>
                    <span className="value">{formData.personalInfo.phone}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Gender:</span>
                    <span className="value">{formData.personalInfo.gender.charAt(0).toUpperCase() + formData.personalInfo.gender.slice(1)}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">State of Origin:</span>
                    <span className="value">{formData.personalInfo.stateOfOrigin}</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <h3>Professional Information</h3>
                <div className="review-grid">
                  <div className="review-item">
                    <span className="label">Role:</span>
                    <span className="value">{TeacherAssignmentService.TEACHER_ROLE_DESCRIPTIONS[formData.professionalInfo.role].title}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Department:</span>
                    <span className="value">{formData.professionalInfo.department}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Qualification:</span>
                    <span className="value">{formData.professionalInfo.qualification}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Experience:</span>
                    <span className="value">{formData.professionalInfo.experience}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Employment Type:</span>
                    <span className="value">{formData.professionalInfo.employmentType.replace('-', ' ')}</span>
                  </div>
                  {formData.professionalInfo.salary && (
                    <div className="review-item">
                      <span className="label">Monthly Salary:</span>
                      <span className="value">₦{parseInt(formData.professionalInfo.salary).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="review-card">
                <h3>Assignments</h3>
                <div className="review-grid">
                  {formData.assignments.assignedClass && (
                    <div className="review-item">
                      <span className="label">Assigned Class:</span>
                      <span className="value">{formData.assignments.assignedClass}</span>
                    </div>
                  )}
                  {formData.assignments.stream && (
                    <div className="review-item">
                      <span className="label">Stream:</span>
                      <span className="value">{formData.assignments.stream}</span>
                    </div>
                  )}
                  {formData.assignments.assignedSubjects.length > 0 && (
                    <div className="review-item full-width">
                      <span className="label">Assigned Subjects:</span>
                      <span className="value">{formData.assignments.assignedSubjects.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="review-card">
                <h3>📧 Email Notification</h3>
                <div className="email-preview">
                  <p>✅ Login credentials will be automatically sent to:</p>
                  <p><strong>{formData.personalInfo.email}</strong></p>
                  <p>The email will contain:</p>
                  <ul>
                    <li>Username and password</li>
                    <li>Login URL</li>
                    <li>Welcome message and role information</li>
                    <li>Security guidelines</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={handlePrevious} className="btn-secondary">
              Previous
            </button>
          )}

          {currentStep < 4 ? (
            <button type="button" onClick={handleNext} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Creating Teacher...' : 'Create Teacher & Send Credentials'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminTeacherCreation;
