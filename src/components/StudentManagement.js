import React, { useState, useEffect } from 'react';
import { NIGERIAN_SUBJECTS } from '../data/models';
import './StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    class: '',
    stream: '', // Science, Arts, Commercial for SSS classes
    assignedSubjects: [], // Selected subjects
    stateOfOrigin: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nigerian states
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT - Abuja'
  ];

  // Available classes
  const classes = [
    'Pre-Nursery 1', 'Pre-Nursery 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  // Generate admission number
  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    const sequence = String(students.length + 1).padStart(4, '0');
    return `FVS/${year}/${sequence}`;
  };

  // Helper functions for stream-based subject selection
  const getStreamSubjects = (stream) => {
    const allSubjects = [];
    
    // Add core subjects (compulsory for all streams)
    const coreSubjects = ['English Language', 'Mathematics', 'Biology', 'Economics', 'ICT', 'Civic Education'];
    allSubjects.push(...coreSubjects);
    
    // Add stream-specific subjects
    switch (stream) {
      case 'Science':
        allSubjects.push(...NIGERIAN_SUBJECTS.SSS_SUBJECTS.SCIENCE);
        break;
      case 'Arts':
        allSubjects.push(...NIGERIAN_SUBJECTS.SSS_SUBJECTS.ART);
        break;
      case 'Commercial':
        allSubjects.push(...NIGERIAN_SUBJECTS.SSS_SUBJECTS.COMMERCIAL);
        break;
    }
    
    // Add general subjects
    allSubjects.push(...NIGERIAN_SUBJECTS.SSS_SUBJECTS.GENERAL);
    
    // Add elective subjects
    allSubjects.push(...NIGERIAN_SUBJECTS.ELECTIVE_SUBJECTS);
    
    return [...new Set(allSubjects)]; // Remove duplicates
  };

  const isSSSClass = (className) => {
    return className.includes('SSS');
  };

  const getAvailableStreams = () => {
    return ['Science', 'Arts', 'Commercial'];
  };

  // Load sample data on mount
  useEffect(() => {
    const sampleStudents = [
      {
        id: 1,
        admissionNumber: 'FVS/2024/0001',
        firstName: 'Ahmed',
        lastName: 'Bello',
        dateOfBirth: '2010-05-15',
        gender: 'Male',
        class: 'JSS 2',
        stream: '',
        assignedSubjects: [],
        stateOfOrigin: 'Lagos',
        parentName: 'Mr. Bello',
        parentPhone: '+234-8012345678',
        parentEmail: 'bello.parent@example.com',
        address: '123 Lagos Street, Lagos',
        admissionDate: '2020-09-15',
        status: 'active'
      },
      {
        id: 2,
        admissionNumber: 'FVS/2024/0002',
        firstName: 'Chinyere',
        lastName: 'Okonkwo',
        dateOfBirth: '2011-08-20',
        gender: 'Female',
        class: 'JSS 1',
        stream: '',
        assignedSubjects: [],
        stateOfOrigin: 'Anambra',
        parentName: 'Mrs. Okonkwo',
        parentPhone: '+234-8023456789',
        parentEmail: 'okonkwo.parent@example.com',
        address: '456 Enugu Road, Anambra',
        admissionDate: '2020-09-15',
        status: 'active'
      },
      {
        id: 3,
        admissionNumber: 'FVS/2024/0003',
        firstName: 'Tunde',
        lastName: 'Johnson',
        dateOfBirth: '2009-03-10',
        gender: 'Male',
        class: 'SSS 1',
        stream: 'Science',
        assignedSubjects: [
          'English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry',
          'Economics', 'ICT', 'Civic Education', 'Geography', 'Agricultural Science'
        ],
        stateOfOrigin: 'Oyo',
        parentName: 'Mr. Johnson',
        parentPhone: '+234-8034567890',
        parentEmail: 'johnson.parent@example.com',
        address: '789 Ibadan Street, Oyo',
        admissionDate: '2020-09-15',
        status: 'active'
      }
    ];
    setStudents(sampleStudents);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Reset stream and subjects when class changes
    if (name === 'class') {
      setFormData(prev => ({
        ...prev,
        class: value,
        stream: '',
        assignedSubjects: []
      }));
    }
    
    // Reset subjects when stream changes
    if (name === 'stream') {
      setFormData(prev => ({
        ...prev,
        stream: value,
        assignedSubjects: []
      }));
    }
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => {
      const subjects = prev.assignedSubjects;
      if (subjects.includes(subject)) {
        return { ...prev, assignedSubjects: subjects.filter(s => s !== subject) };
      } else {
        // For SSS, ensure minimum of 9 subjects
        if (isSSSClass(prev.class) && subjects.length >= 9) {
          setErrors({ subjects: 'Maximum 9 subjects allowed for SSS students' });
          return prev;
        }
        return { ...prev, assignedSubjects: [...subjects, subject] };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.class) newErrors.class = 'Class is required';
    
    // SSS stream validation
    if (isSSSClass(formData.class) && !formData.stream) {
      newErrors.stream = 'Stream selection is required for SSS students';
    }
    
    // SSS subject validation
    if (isSSSClass(formData.class) && formData.assignedSubjects.length < 9) {
      newErrors.assignedSubjects = 'Minimum 9 subjects required for SSS students';
    }
    
    if (!formData.stateOfOrigin) newErrors.stateOfOrigin = 'State of origin is required';
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
    if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Parent phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Email validation
    if (formData.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.parentPhone && !/^\+?[\d\s-()]+$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Please enter a valid phone number';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingStudent) {
        // Update existing student
        setStudents(prev => prev.map(student => 
          student.id === editingStudent.id 
            ? { ...formData, id: editingStudent.id }
            : student
        ));
      } else {
        // Add new student
        const newStudent = {
          ...formData,
          id: Date.now(),
          admissionNumber: generateAdmissionNumber()
        };
        setStudents(prev => [...prev, newStudent]);
      }
      
      // Reset form
      setFormData({
        admissionNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        class: '',
        stream: '',
        assignedSubjects: [],
        stateOfOrigin: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'active'
      });
      setEditingStudent(null);
      setShowAddForm(false);
      setErrors({});
      
    } catch (error) {
      console.error('Student creation error:', error);
      alert('Student creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowAddForm(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== studentId));
    }
  };

  const handleCancel = () => {
    setFormData({
      admissionNumber: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      class: '',
      stream: '',
      assignedSubjects: [],
      stateOfOrigin: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });
    setEditingStudent(null);
    setShowAddForm(false);
    setErrors({});
  };

  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes('') || 
    student.lastName.toLowerCase().includes('') ||
    student.admissionNumber.toLowerCase().includes('')
  );

  return (
    <div className="student-management">
      <div className="management-header">
        <h2>Student Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          + Add New Student
        </button>
      </div>

      <div className="students-table">
        <div className="table-header">
          <h3>All Students ({filteredStudents.length})</h3>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Admission No.</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Class</th>
                <th>Stream</th>
                <th>Subjects</th>
                <th>State of Origin</th>
                <th>Parent Name</th>
                <th>Parent Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.admissionNumber}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.gender}</td>
                  <td>{student.class}</td>
                  <td>{isSSSClass(student.class) ? student.stream || '-' : '-'}</td>
                  <td>
                    {isSSSClass(student.class) && student.assignedSubjects.length > 0 
                      ? `${student.assignedSubjects.length} subjects`
                      : '-'
                    }
                  </td>
                  <td>{student.stateOfOrigin}</td>
                  <td>{student.parentName}</td>
                  <td>{student.parentPhone}</td>
                  <td>
                    <span className={`status-badge ${student.status}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(student)}
                        className="btn-edit"
                        title="Edit Student"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="btn-delete"
                        title="Delete Student"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button onClick={handleCancel} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-grid">
                <div className="form-section">
                  <h4>Student Information</h4>
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
                      <label>Date of Birth *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={errors.dateOfBirth ? 'error' : ''}
                      />
                      {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                    </div>

                    <div className="form-group">
                      <label>Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={errors.gender ? 'error' : ''}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Class *</label>
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        className={errors.class ? 'error' : ''}
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                      {errors.class && <span className="error-message">{errors.class}</span>}
                    </div>

                    <div className="form-group">
                      <label>State of Origin *</label>
                      <select
                        name="stateOfOrigin"
                        value={formData.stateOfOrigin}
                        onChange={handleInputChange}
                        className={errors.stateOfOrigin ? 'error' : ''}
                      >
                        <option value="">Select State</option>
                        {nigerianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.stateOfOrigin && <span className="error-message">{errors.stateOfOrigin}</span>}
                    </div>
                  </div>

                  {/* SSS Stream Selection */}
                  {isSSSClass(formData.class) && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Stream *</label>
                        <select
                          name="stream"
                          value={formData.stream}
                          onChange={handleInputChange}
                          className={errors.stream ? 'error' : ''}
                        >
                          <option value="">Select Stream</option>
                          {getAvailableStreams().map(stream => (
                            <option key={stream} value={stream}>{stream}</option>
                          ))}
                        </select>
                        {errors.stream && <span className="error-message">{errors.stream}</span>}
                        <small style={{ color: '#94a3b8', marginTop: '0.5rem', display: 'block' }}>
                          Science: Physics, Chemistry | Arts: Government, Literature | Commercial: Account, Commerce
                        </small>
                      </div>
                    </div>
                  )}

                  {/* Subject Selection for SSS */}
                  {isSSSClass(formData.class) && formData.stream && (
                    <div className="form-row">
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Assigned Subjects * (Minimum 9)</label>
                        <div className="subjects-grid">
                          {getStreamSubjects(formData.stream).map(subject => (
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
                            <strong>Selected ({formData.assignedSubjects.length}/9):</strong> {formData.assignedSubjects.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h4>Parent/Guardian Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Parent Name *</label>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        className={errors.parentName ? 'error' : ''}
                      />
                      {errors.parentName && <span className="error-message">{errors.parentName}</span>}
                    </div>

                    <div className="form-group">
                      <label>Parent Phone *</label>
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        className={errors.parentPhone ? 'error' : ''}
                        placeholder="+234-XXXXXXXXXX"
                      />
                      {errors.parentPhone && <span className="error-message">{errors.parentPhone}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Parent Email</label>
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        className={errors.parentEmail ? 'error' : ''}
                      />
                      {errors.parentEmail && <span className="error-message">{errors.parentEmail}</span>}
                    </div>

                    <div className="form-group">
                      <label>Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={errors.address ? 'error' : ''}
                      />
                      {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
