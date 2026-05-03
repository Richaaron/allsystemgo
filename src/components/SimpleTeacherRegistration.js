import React, { useState } from 'react';
import { CredentialService } from '../services/credentialService';
import { EmailService } from '../services/emailService';
import './SimpleTeacherRegistration.css';

const SimpleTeacherRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'subject_teacher',
    department: '',
    qualification: '',
    assignedClass: '',
    assignedSubjects: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdTeacher, setCreatedTeacher] = useState(null);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'form_teacher', label: 'Form Teacher' },
    { value: 'subject_teacher', label: 'Subject Teacher' },
    { value: 'dual_role', label: 'Dual Role Teacher' }
  ];

  const departments = [
    'Pre Nursery', 'Nursery', 'Primary', 'Secondary'
  ];

  const qualifications = [
    'B.Ed', 'B.Sc Education', 'M.Ed', 'PhD', 'NCE', 'PGDE'
  ];

  const classes = [
    'Pre-Nursery 1', 'Pre-Nursery 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  const subjects = [
    // Early Childhood Subjects
    'Number Work', 'Letter Work', 'Rhymes and Songs', 'Story Telling', 
    'Creative Play', 'Physical Development', 'Social Development', 
    'Health Habits', 'Sensorial Activities', 'Practical Life', 
    'Cultural Activities', 'Art and Craft',
    
    // Core Subjects
    'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics',
    'Civic Education', 'One Nigerian Language',
    
    // JSS Subjects
    'Mathematics', 'English Language', 'National Values', 'Business Studies',
    'Home Economics', 'Physical & Health Education', 'Agricultural Science',
    'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies',
    'Computer Studies', 'Hausa',
    
    // SSS Subjects
    'Physics', 'Chemistry', 'Government', 'Literature in English',
    'Account', 'Commerce', 'Economics', 'Religious Studies', 'ICT',
    'Civic Education', 'Marketing', 'Geography', 'Agricultural Science', 'Biology',
    
    // Elective Subjects
    'Further Mathematics', 'Technical Drawing', 'Geography', 'Economics',
    'Government', 'History', 'Literature in English', 
    'Christian Religious Studies', 'Islamic Religious Studies', 'French',
    'Computer Studies', 'Physical and Health Education', 'Visual Art', 'Music',
    
    // Primary Subjects
    'English Language', 'Mathematics', 'Basic Science', 'Social Studies',
    'Civic Education', 'Computer Studies', 'Physical and Health Education',
    'Creative Arts', 'Nigerian Language', 'Religious Education', 'Agriculture',
    'Home Economics'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => {
      const subjects = prev.assignedSubjects;
      if (subjects.includes(subject)) {
        return { ...prev, assignedSubjects: subjects.filter(s => s !== subject) };
      } else {
        return { ...prev, assignedSubjects: [...subjects, subject] };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    
    // Role-specific validation
    if (formData.role === 'form_teacher' && !formData.assignedClass) {
      newErrors.assignedClass = 'Class assignment is required for Form Teacher';
    }
    
    if ((formData.role === 'subject_teacher' || formData.role === 'dual_role') && 
        formData.assignedSubjects.length === 0) {
      newErrors.assignedSubjects = 'At least one subject is required';
    }
    
    if (formData.role === 'dual_role' && (!formData.assignedClass || formData.assignedSubjects.length === 0)) {
      if (!formData.assignedClass) newErrors.assignedClass = 'Class assignment is required for Dual Role';
      if (formData.assignedSubjects.length === 0) newErrors.assignedSubjects = 'Subjects are required for Dual Role';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
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
      // Generate credentials
      const credentials = CredentialService.generateTeacherCredentials(formData.personalInfo || formData);
      
      // Create teacher object
      const teacherData = {
        ...formData,
        ...credentials,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      // Send email with credentials
      const emailResult = await EmailService.sendTeacherCredentials(teacherData, credentials);
      
      if (emailResult.success) {
        setCreatedTeacher(teacherData);
        setSubmitSuccess(true);
      } else {
        throw new Error('Failed to send credentials email');
      }
      
    } catch (error) {
      console.error('Teacher creation error:', error);
      alert('Teacher creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'subject_teacher',
      department: '',
      qualification: '',
      assignedClass: '',
      assignedSubjects: []
    });
    setSubmitSuccess(false);
    setCreatedTeacher(null);
    setErrors({});
  };

  if (submitSuccess && createdTeacher) {
    return (
      <div className="simple-teacher-registration">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>Teacher Created Successfully!</h2>
          <div className="success-details">
            <p><strong>Name:</strong> {createdTeacher.firstName} {createdTeacher.lastName}</p>
            <p><strong>Email:</strong> {createdTeacher.email}</p>
            <p><strong>Role:</strong> {roles.find(r => r.value === createdTeacher.role)?.label}</p>
            <p><strong>Department:</strong> {createdTeacher.department}</p>
            <p><strong>Staff ID:</strong> {createdTeacher.staffId}</p>
            {createdTeacher.assignedClass && (
              <p><strong>Class:</strong> {createdTeacher.assignedClass}</p>
            )}
            {createdTeacher.assignedSubjects.length > 0 && (
              <p><strong>Subjects:</strong> {createdTeacher.assignedSubjects.join(', ')}</p>
            )}
            <div className="email-notice">
              <p>📧 Login credentials have been sent to <strong>{createdTeacher.email}</strong></p>
            </div>
          </div>
          <button onClick={resetForm} className="btn-primary">
            Create Another Teacher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-teacher-registration">
      <div className="form-container">
        <h2>Create New Teacher Account</h2>
        <p>Fill in the teacher details below to create their account</p>
        
        <form onSubmit={handleSubmit} className="teacher-form">
          <div className="form-grid">
            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="form-section">
              <h3>Professional Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={errors.role ? 'error' : ''}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                  {errors.role && <span className="error-message">{errors.role}</span>}
                </div>
                
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={errors.department ? 'error' : ''}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <span className="error-message">{errors.department}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Qualification *</label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className={errors.qualification ? 'error' : ''}
                  >
                    <option value="">Select Qualification</option>
                    {qualifications.map(qual => (
                      <option key={qual} value={qual}>{qual}</option>
                    ))}
                  </select>
                  {errors.qualification && <span className="error-message">{errors.qualification}</span>}
                </div>
              </div>
            </div>

            {/* Assignments */}
            <div className="form-section">
              <h3>Assignments</h3>
              
              {/* Class Assignment */}
              {(formData.role === 'form_teacher' || formData.role === 'dual_role') && (
                <div className="form-group">
                  <label>Assigned Class *</label>
                  <select
                    name="assignedClass"
                    value={formData.assignedClass}
                    onChange={handleInputChange}
                    className={errors.assignedClass ? 'error' : ''}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  {errors.assignedClass && <span className="error-message">{errors.assignedClass}</span>}
                </div>
              )}
              
              {/* Subject Assignment */}
              {(formData.role === 'subject_teacher' || formData.role === 'dual_role') && (
                <div className="form-group">
                  <label>Assigned Subjects *</label>
                  <div className="subjects-grid">
                    {subjects.map(subject => (
                      <label key={subject} className="subject-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.assignedSubjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                        />
                        <span>{subject}</span>
                      </label>
                    ))}
                  </div>
                  {errors.assignedSubjects && <span className="error-message">{errors.assignedSubjects}</span>}
                  
                  {formData.assignedSubjects.length > 0 && (
                    <div className="selected-subjects">
                      <strong>Selected:</strong> {formData.assignedSubjects.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Creating...' : 'Create Teacher & Send Credentials'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleTeacherRegistration;
