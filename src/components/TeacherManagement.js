import React, { useState, useEffect } from 'react';
import { TEACHER_ROLES, TEACHER_ROLE_DESCRIPTIONS } from '../data/teacherModels';
import './TeacherManagement.css';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    department: '',
    role: '',
    subjects: [],
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

  // Available departments
  const departments = [
    'Pre Nursery', 'Nursery', 'Primary', 'Secondary'
  ];

  // Available subjects
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

  // Generate staff ID
  const generateStaffId = () => {
    const year = new Date().getFullYear();
    const sequence = String(teachers.length + 1).padStart(4, '0');
    return `FVS/STF/${year}/${sequence}`;
  };

  // Generate email based on name
  const generateEmail = (firstName, lastName) => {
    const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '');
    return `${cleanFirstName}.${cleanLastName}@folushovictory.sch.ng`;
  };

  // Generate password
  const generatePassword = () => {
    const randomNum = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
    return `fvs@${randomNum}`;
  };

  // Load sample data on mount
  useEffect(() => {
    const sampleTeachers = [
      {
        id: 1,
        staffId: 'FVS/STF/2024/0001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@folushovictory.sch.ng',
        phone: '+234-8012345678',
        dateOfBirth: '1985-03-15',
        gender: 'Female',
        address: '123 Lagos Street, Lagos',
        department: 'Secondary',
        role: 'form_teacher',
        qualifications: ['B.Ed', 'M.Ed'],
        subjects: ['English Language', 'Literature in English'],
        employmentDate: '2020-01-15',
        status: 'active'
      },
      {
        id: 2,
        staffId: 'FVS/STF/2024/0002',
        firstName: 'Michael',
        lastName: 'Bello',
        email: 'michael.bello@folushovictory.sch.ng',
        phone: '+234-8023456789',
        dateOfBirth: '1988-07-20',
        gender: 'Male',
        address: '456 Abuja Road, Abuja',
        department: 'Secondary',
        role: 'subject_teacher',
        qualifications: ['B.Sc Physics', 'PGDE'],
        subjects: ['Physics', 'Mathematics'],
        employmentDate: '2020-09-01',
        status: 'active'
      },
      {
        id: 3,
        staffId: 'FVS/STF/2024/0003',
        firstName: 'Grace',
        lastName: 'Okonkwo',
        email: 'grace.okonkwo@folushovictory.sch.ng',
        phone: '+234-8034567890',
        dateOfBirth: '1990-11-10',
        gender: 'Female',
        address: '789 Enugu Street, Enugu',
        department: 'Primary',
        role: 'form_teacher',
        qualifications: ['NCE', 'B.Ed'],
        subjects: ['English Language', 'Mathematics', 'Basic Science'],
        employmentDate: '2021-02-10',
        status: 'active'
      }
    ];
    setTeachers(sampleTeachers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate email when first or last name changes
    if (name === 'firstName' || name === 'lastName') {
      const firstName = name === 'firstName' ? value : formData.firstName;
      const lastName = name === 'lastName' ? value : formData.lastName;
      if (firstName && lastName) {
        setFormData(prev => ({
          ...prev,
          email: generateEmail(firstName, lastName)
        }));
      }
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => {
      const subjects = prev.subjects;
      if (subjects.includes(subject)) {
        return { ...prev, subjects: subjects.filter(s => s !== subject) };
      } else {
        return { ...prev, subjects: [...subjects, subject] };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
      
      if (editingTeacher) {
        // Update existing teacher
        setTeachers(prev => prev.map(teacher => 
          teacher.id === editingTeacher.id 
            ? { ...formData, id: editingTeacher.id }
            : teacher
        ));
      } else {
        // Generate password for new teacher
        const generatedPassword = generatePassword();
        
        // Add new teacher
        const newTeacher = {
          ...formData,
          id: Date.now(),
          staffId: generateStaffId(),
          password: generatedPassword // Store password (in real app, this would be hashed)
        };
        setTeachers(prev => [...prev, newTeacher]);
        
        // Show credentials to user
        alert(`✅ Teacher Added Successfully!\n\nLogin Credentials:\nEmail: ${newTeacher.email}\nPassword: ${generatedPassword}\n\nPlease save these credentials securely.`);
      }
      
      // Reset form
      setFormData({
        staffId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        department: '',
        role: '',
        subjects: [],
        status: 'active'
      });
      setEditingTeacher(null);
      setShowAddForm(false);
      setErrors({});
      
    } catch (error) {
      console.error('Teacher creation error:', error);
      alert('Teacher creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher);
    setShowAddForm(true);
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
    }
  };

  const handleCancel = () => {
    setFormData({
      staffId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      department: '',
      role: '',
      qualifications: [],
      subjects: [],
      employmentDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });
    setEditingTeacher(null);
    setShowAddForm(false);
    setErrors({});
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.firstName.toLowerCase().includes('') || 
    teacher.lastName.toLowerCase().includes('') ||
    teacher.staffId.toLowerCase().includes('')
  );

  const getRoleDisplayName = (role) => {
    const roleInfo = TEACHER_ROLE_DESCRIPTIONS[role];
    return roleInfo ? roleInfo.title : role;
  };

  return (
    <div className="teacher-management">
      <div className="management-header">
        <h2>Teacher Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          + Add New Teacher
        </button>
      </div>

      <div className="teachers-table">
        <div className="table-header">
          <h3>All Teachers ({filteredTeachers.length})</h3>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search teachers..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Role</th>
                <th>Subjects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td>{teacher.staffId}</td>
                  <td>{teacher.firstName} {teacher.lastName}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.department}</td>
                  <td>
                    <span className="role-badge">{getRoleDisplayName(teacher.role)}</span>
                  </td>
                  <td>
                    {teacher.subjects.length} subject{teacher.subjects.length !== 1 ? 's' : ''}
                  </td>
                  <td>
                    <span className={`status-badge ${teacher.status}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(teacher)}
                        className="btn-edit"
                        title="Edit Teacher"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher.id)}
                        className="btn-delete"
                        title="Delete Teacher"
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
              <h3>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h3>
              <button onClick={handleCancel} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit} className="teacher-form">
              <div className="form-grid">
                <div className="form-section">
                  <h4>Personal Information</h4>
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
                        className={`${errors.email ? 'error' : ''} readonly-input`}
                        readOnly
                        placeholder="Auto-generated from name"
                      />
                      <small className="auto-generated-hint">📧 Auto-generated from teacher name</small>
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
                        placeholder="+234-XXXXXXXXXX"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-row">
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


                </div>

                <div className="form-section">
                  <h4>Professional Information</h4>
                  <div className="form-row">
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

                    <div className="form-group">
                      <label>Role *</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={errors.role ? 'error' : ''}
                      >
                        <option value="">Select Role</option>
                        {Object.values(TEACHER_ROLES).map(role => (
                          <option key={role} value={role}>
                            {TEACHER_ROLE_DESCRIPTIONS[role]?.title || role}
                          </option>
                        ))}
                      </select>
                      {errors.role && <span className="error-message">{errors.role}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>
                  </div>



                  <div className="form-row">
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>Assigned Subjects *</label>
                      <div className="subjects-grid">
                        {subjects.map(subject => (
                          <label key={subject} className="subject-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.subjects.includes(subject)}
                              onChange={() => handleSubjectToggle(subject)}
                            />
                            <span>{subject}</span>
                          </label>
                        ))}
                      </div>
                      {errors.subjects && <span className="error-message">{errors.subjects}</span>}
                      {formData.subjects.length > 0 && (
                        <div className="selected-subjects">
                          <strong>Selected ({formData.subjects.length}):</strong> {formData.subjects.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving...' : (editingTeacher ? 'Update Teacher' : 'Add Teacher')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
