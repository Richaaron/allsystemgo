import React, { useState, useEffect } from 'react';
import { getAllClasses, getEarlyChildhoodClasses, NIGERIAN_SUBJECTS } from '../data/models';
import './StudentRegistration.css';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      gender: 'male',
      nationality: 'Nigerian',
      stateOfOrigin: '',
      lga: '',
      address: '',
      phone: '',
      email: '',
      admissionNumber: '',
      previousSchool: ''
    },
    academicInfo: {
      classLevel: '',
      className: '',
      stream: '', // For SSS students
      admissionDate: new Date().toISOString().split('T')[0]
    },
    parentInfo: {
      fatherName: '',
      fatherOccupation: '',
      fatherPhone: '',
      motherName: '',
      motherOccupation: '',
      motherPhone: '',
      guardianName: '',
      guardianRelationship: '',
      guardianPhone: '',
      guardianAddress: ''
    }
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nigerian states
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  // Get available subjects based on class level
  useEffect(() => {
    if (formData.academicInfo.classLevel) {
      let subjects = [];
      
      if (formData.academicInfo.classLevel.includes('Pre-Nursery') || formData.academicInfo.classLevel.includes('Nursery')) {
        subjects = NIGERIAN_SUBJECTS.EARLY_CHILDHOOD;
      } else if (formData.academicInfo.classLevel.includes('Primary')) {
        subjects = NIGERIAN_SUBJECTS.PRIMARY_SUBJECTS;
      } else if (formData.academicInfo.classLevel.includes('JSS')) {
        subjects = NIGERIAN_SUBJECTS.JSS_SUBJECTS;
      } else if (formData.academicInfo.classLevel.includes('SSS')) {
        // For SSS, show stream-specific subjects
        subjects = [
          ...NIGERIAN_SUBJECTS.SSS_SUBJECTS.SCIENCE,
          ...NIGERIAN_SUBJECTS.SSS_SUBJECTS.ART,
          ...NIGERIAN_SUBJECTS.SSS_SUBJECTS.COMMERCIAL,
          ...NIGERIAN_SUBJECTS.SSS_SUBJECTS.GENERAL
        ];
      }
      
      setAvailableSubjects(subjects);
    }
  }, [formData.academicInfo.classLevel]);

  // Generate admission number
  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FVS/${year}/${random}`;
  };

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
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  // Validate form
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Personal info validation
      if (!formData.personalInfo.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.personalInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.personalInfo.gender) newErrors.gender = 'Gender is required';
      if (!formData.personalInfo.stateOfOrigin) newErrors.stateOfOrigin = 'State of origin is required';
      if (!formData.personalInfo.address.trim()) newErrors.address = 'Address is required';
      if (!formData.personalInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    } else if (step === 2) {
      // Academic info validation
      if (!formData.academicInfo.classLevel) newErrors.classLevel = 'Class level is required';
      if (!formData.academicInfo.className) newErrors.className = 'Class name is required';
      if (formData.academicInfo.classLevel.includes('SSS') && !formData.academicInfo.stream) {
        newErrors.stream = 'Stream is required for SSS students';
      }
    } else if (step === 3) {
      // Parent info validation
      if (!formData.parentInfo.fatherName.trim() && !formData.parentInfo.guardianName.trim()) {
        newErrors.parentName = 'Father name or guardian name is required';
      }
      if (!formData.parentInfo.fatherPhone.trim() && !formData.parentInfo.guardianPhone.trim()) {
        newErrors.parentPhone = 'Father phone or guardian phone is required';
      }
    } else if (step === 4) {
      // Subject selection validation
      if (selectedSubjects.length === 0) {
        newErrors.subjects = 'At least one subject must be selected';
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
    
    if (!validateStep(4)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate admission number if not provided
      const admissionNumber = formData.personalInfo.admissionNumber || generateAdmissionNumber();
      
      const studentData = {
        ...formData.personalInfo,
        ...formData.academicInfo,
        ...formData.parentInfo,
        admissionNumber,
        assignedSubjects: selectedSubjects,
        registrationDate: new Date().toISOString(),
        status: 'active'
      };
      
      // Here you would normally save to database
      console.log('Student Registration Data:', studentData);
      
      // Show success message
      alert(`Student ${formData.personalInfo.firstName} ${formData.personalInfo.lastName} registered successfully!\nAdmission Number: ${admissionNumber}`);
      
      // Reset form
      setFormData({
        personalInfo: {
          firstName: '',
          lastName: '',
          middleName: '',
          dateOfBirth: '',
          gender: 'male',
          nationality: 'Nigerian',
          stateOfOrigin: '',
          lga: '',
          address: '',
          phone: '',
          email: '',
          admissionNumber: '',
          previousSchool: ''
        },
        academicInfo: {
          classLevel: '',
          className: '',
          stream: '',
          admissionDate: new Date().toISOString().split('T')[0]
        },
        parentInfo: {
          fatherName: '',
          fatherOccupation: '',
          fatherPhone: '',
          motherName: '',
          motherOccupation: '',
          motherPhone: '',
          guardianName: '',
          guardianRelationship: '',
          guardianPhone: '',
          guardianAddress: ''
        }
      });
      setSelectedSubjects([]);
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get class options based on level
  const getClassOptions = () => {
    switch (formData.academicInfo.classLevel) {
      case 'Pre-Nursery':
        return ['Pre-Nursery 1', 'Pre-Nursery 2'];
      case 'Nursery':
        return ['Nursery 1', 'Nursery 2', 'Nursery 3'];
      case 'Primary':
        return ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
      case 'JSS':
        return ['JSS 1', 'JSS 2', 'JSS 3'];
      case 'SSS':
        return ['SSS 1', 'SSS 2', 'SSS 3'];
      default:
        return [];
    }
  };

  return (
    <div className="student-registration">
      <div className="registration-header">
        <h1>Student Registration</h1>
        <p>Register a new student and assign subjects</p>
      </div>

      <div className="progress-bar">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>Personal Info</div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>Academic Info</div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>Parent Info</div>
        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>Subject Selection</div>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
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
                <label>Date of Birth *</label>
                <input
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
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

              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  value={formData.personalInfo.address}
                  onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                  className={errors.address ? 'error' : ''}
                  rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
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
                <label>Email</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Admission Number</label>
                <input
                  type="text"
                  value={formData.personalInfo.admissionNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'admissionNumber', e.target.value)}
                  placeholder="Leave blank to auto-generate"
                />
              </div>

              <div className="form-group full-width">
                <label>Previous School</label>
                <input
                  type="text"
                  value={formData.personalInfo.previousSchool}
                  onChange={(e) => handleInputChange('personalInfo', 'previousSchool', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Academic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Class Level *</label>
                <select
                  value={formData.academicInfo.classLevel}
                  onChange={(e) => handleInputChange('academicInfo', 'classLevel', e.target.value)}
                  className={errors.classLevel ? 'error' : ''}
                >
                  <option value="">Select Class Level</option>
                  <option value="Pre-Nursery">Pre-Nursery</option>
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="JSS">Junior Secondary School</option>
                  <option value="SSS">Senior Secondary School</option>
                </select>
                {errors.classLevel && <span className="error-message">{errors.classLevel}</span>}
              </div>

              <div className="form-group">
                <label>Class Name *</label>
                <select
                  value={formData.academicInfo.className}
                  onChange={(e) => handleInputChange('academicInfo', 'className', e.target.value)}
                  className={errors.className ? 'error' : ''}
                  disabled={!formData.academicInfo.classLevel}
                >
                  <option value="">Select Class</option>
                  {getClassOptions().map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                {errors.className && <span className="error-message">{errors.className}</span>}
              </div>

              {formData.academicInfo.classLevel === 'SSS' && (
                <div className="form-group">
                  <label>Stream *</label>
                  <select
                    value={formData.academicInfo.stream}
                    onChange={(e) => handleInputChange('academicInfo', 'stream', e.target.value)}
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

              <div className="form-group">
                <label>Admission Date</label>
                <input
                  type="date"
                  value={formData.academicInfo.admissionDate}
                  onChange={(e) => handleInputChange('academicInfo', 'admissionDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Parent/Guardian Information */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Parent/Guardian Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Father's Name</label>
                <input
                  type="text"
                  value={formData.parentInfo.fatherName}
                  onChange={(e) => handleInputChange('parentInfo', 'fatherName', e.target.value)}
                  className={errors.parentName ? 'error' : ''}
                />
              </div>

              <div className="form-group">
                <label>Father's Occupation</label>
                <input
                  type="text"
                  value={formData.parentInfo.fatherOccupation}
                  onChange={(e) => handleInputChange('parentInfo', 'fatherOccupation', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Father's Phone</label>
                <input
                  type="tel"
                  value={formData.parentInfo.fatherPhone}
                  onChange={(e) => handleInputChange('parentInfo', 'fatherPhone', e.target.value)}
                  className={errors.parentPhone ? 'error' : ''}
                />
              </div>

              <div className="form-group">
                <label>Mother's Name</label>
                <input
                  type="text"
                  value={formData.parentInfo.motherName}
                  onChange={(e) => handleInputChange('parentInfo', 'motherName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Mother's Occupation</label>
                <input
                  type="text"
                  value={formData.parentInfo.motherOccupation}
                  onChange={(e) => handleInputChange('parentInfo', 'motherOccupation', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Mother's Phone</label>
                <input
                  type="tel"
                  value={formData.parentInfo.motherPhone}
                  onChange={(e) => handleInputChange('parentInfo', 'motherPhone', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Guardian's Name</label>
                <input
                  type="text"
                  value={formData.parentInfo.guardianName}
                  onChange={(e) => handleInputChange('parentInfo', 'guardianName', e.target.value)}
                  className={errors.parentName && !formData.parentInfo.fatherName ? 'error' : ''}
                />
              </div>

              <div className="form-group">
                <label>Guardian's Relationship</label>
                <input
                  type="text"
                  value={formData.parentInfo.guardianRelationship}
                  onChange={(e) => handleInputChange('parentInfo', 'guardianRelationship', e.target.value)}
                  placeholder="e.g., Uncle, Aunt, Grandmother"
                />
              </div>

              <div className="form-group">
                <label>Guardian's Phone</label>
                <input
                  type="tel"
                  value={formData.parentInfo.guardianPhone}
                  onChange={(e) => handleInputChange('parentInfo', 'guardianPhone', e.target.value)}
                  className={errors.parentPhone && !formData.parentInfo.fatherPhone ? 'error' : ''}
                />
              </div>

              <div className="form-group full-width">
                <label>Guardian's Address</label>
                <textarea
                  value={formData.parentInfo.guardianAddress}
                  onChange={(e) => handleInputChange('parentInfo', 'guardianAddress', e.target.value)}
                  rows="3"
                />
              </div>

              {(errors.parentName || errors.parentPhone) && (
                <div className="form-group full-width">
                  <span className="error-message">
                    {errors.parentName || errors.parentPhone}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Subject Selection */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2>Subject Selection</h2>
            <div className="subject-selection">
              {formData.academicInfo.classLevel === 'SSS' && formData.academicInfo.stream && (
                <div className="stream-info">
                  <h3>Selected Stream: {formData.academicInfo.stream}</h3>
                  <p>Core subjects for this stream are automatically included.</p>
                </div>
              )}

              <div className="subjects-grid">
                {availableSubjects.map(subject => (
                  <div key={subject} className="subject-item">
                    <label className="subject-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                      />
                      <span className="subject-name">{subject}</span>
                    </label>
                  </div>
                ))}
              </div>

              {errors.subjects && (
                <div className="error-message">{errors.subjects}</div>
              )}

              <div className="selected-subjects">
                <h4>Selected Subjects ({selectedSubjects.length})</h4>
                <div className="selected-list">
                  {selectedSubjects.map(subject => (
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
              {isSubmitting ? 'Registering...' : 'Register Student'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentRegistration;
