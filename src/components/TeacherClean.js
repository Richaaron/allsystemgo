import React, { useState, useEffect } from 'react';

const TeacherClean = () => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    department: '',
    role: '',
    qualifications: [],
    subjects: [],
    employmentDate: new Date().toISOString().split('T')[0],
    status: 'active',
    assignedClass: ''
  });

  const subjects = [
    'English Language', 'Mathematics', 'Basic Science', 'Basic Technology',
    'Social Studies', 'Civic Education', 'Creative Arts', 'Home Economics',
    'Computer Studies', 'Physical Education', 'Agricultural Science',
    'Business Studies', 'French', 'Yoruba', 'Igbo', 'Hausa',
    'Chemistry', 'Physics', 'Biology', 'Geography', 'Economics',
    'Government', 'Literature in English', 'Christian Religious Studies',
    'Islamic Religious Studies', 'History', 'Accounting', 'Commerce'
  ];

  const departments = [
    'Pre Nursery', 'Nursery', 'Primary', 'Secondary'
  ];

  const roles = [
    'Form Teacher', 'Subject Teacher', 'Dual Role'
  ];

  const qualifications = [
    'B.Ed', 'B.Sc Education', 'M.Ed', 'PhD', 'NCE', 'PGDE', 'B.Sc', 'M.Sc'
  ];

  const availableClasses = [
    'Pre-Nursery 1', 'Pre-Nursery 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  useEffect(() => {
    // Load sample data
    const sampleTeachers = [
      {
        id: 1,
        staffId: 'FVS/EMP/001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@folushovictory.edu.ng',
        phone: '+234-8012345678',
        gender: 'Male',
        dateOfBirth: '1985-06-15',
        address: '123 Lagos Street, Lagos',
        department: 'Secondary',
        role: 'Form Teacher',
        qualifications: ['B.Ed Education'],
        subjects: ['English Language', 'Literature in English'],
        employmentDate: '2020-01-15',
        status: 'active',
        assignedClass: 'JSS 2'
      },
      {
        id: 2,
        staffId: 'FVS/EMP/002',
        firstName: 'Mary',
        lastName: 'Johnson',
        email: 'mary.johnson@folushovictory.edu.ng',
        phone: '+234-8023456789',
        gender: 'Female',
        dateOfBirth: '1988-03-20',
        address: '456 Enugu Road, Anambra',
        department: 'Secondary',
        role: 'Subject Teacher',
        qualifications: ['B.Sc Mathematics'],
        subjects: ['Mathematics', 'Physics'],
        employmentDate: '2021-02-10',
        status: 'active'
      },
      {
        id: 3,
        staffId: 'FVS/EMP/003',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@folushovictory.edu.ng',
        phone: '+234-8034567890',
        gender: 'Male',
        dateOfBirth: '1982-11-10',
        address: '789 Abuja Way, FCT',
        department: 'Secondary',
        role: 'Dual Role',
        qualifications: ['M.Ed Mathematics', 'B.Sc Physics'],
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
        employmentDate: '2019-08-20',
        status: 'active',
        assignedClass: 'SSS 1'
      }
    ];
    setTeachers(sampleTeachers);
  }, []);

  const generateStaffId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `FVS/EMP/${randomNum}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate username from first and last name
  const generateUsername = (firstName, lastName) => {
    if (!firstName || !lastName) return '';
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `${cleanFirst}.${cleanLast}${randomNum}`;
  };

  // Generate password
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubjectChange = (e) => {
    const selectedSubjects = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, subjects: selectedSubjects }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.department || !formData.role || formData.subjects.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingTeacher) {
      // Update existing teacher
      setTeachers(prev => prev.map(teacher =>
        teacher.id === editingTeacher.id
          ? { ...teacher, ...formData }
          : teacher
      ));
    } else {
      // Generate credentials for new teacher
      const generatedUsername = generateUsername(formData.firstName, formData.lastName);
      const generatedPassword = generatePassword();

      // Add new teacher with credentials
      const newTeacher = {
        id: teachers.length + 1,
        staffId: formData.staffId || generateStaffId(),
        username: generatedUsername,
        password: generatedPassword,
        ...formData
      };
      setTeachers(prev => [...prev, newTeacher]);

      // Show credentials that will be sent to teacher's email
      alert(
        `Teacher Created Successfully!\n\n` +
        `Credentials will be sent to: ${formData.email}\n\n` +
        `Username: ${generatedUsername}\n` +
        `Password: ${generatedPassword}\n\n` +
        `Please save these credentials securely.`
      );
    }

    // Reset form
    setFormData({
      staffId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      address: '',
      department: '',
      role: '',
      qualifications: [],
      subjects: [],
      employmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
      assignedClass: ''
    });
    setEditingTeacher(null);
    setShowForm(false);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher);
    setShowForm(true);
  };

  const handleDelete = (teacherId) => {
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
      gender: '',
      dateOfBirth: '',
      address: '',
      department: '',
      role: '',
      qualifications: [],
      subjects: [],
      employmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
      assignedClass: ''
    });
    setEditingTeacher(null);
    setShowForm(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem' }}>Teachers Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          + Add Teacher
        </button>
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          All Teachers ({teachers.length})
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Staff ID</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Department</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(teacher => (
                <tr key={teacher.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <td style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>{teacher.staffId}</td>
                  <td style={{ padding: '12px', color: '#e2e8f0' }}>
                    {teacher.firstName} {teacher.lastName}
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>{teacher.email}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{teacher.department}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{teacher.role}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: teacher.status === 'active' ? '#22c55e' : '#ef4444',
                      backgroundColor: teacher.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      border: `1px solid ${teacher.status === 'active' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {teacher.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleEdit(teacher)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#3b82f6',
                          fontSize: '1rem'
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontSize: '1rem'
                        }}
                        title="Delete"
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

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', margin: 0 }}>
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
              </h3>
              <button 
                onClick={handleCancel}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Teacher's personal email address"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '5px' }}>
                    Credentials will be sent to this email
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Staff ID</label>
                  <input
                    type="text"
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleInputChange}
                    placeholder="Auto-generated if empty"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(51, 65, 85, 0.5)',
                    border: '2px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Subjects *</label>
                  <select
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleSubjectChange}
                    multiple
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem',
                      minHeight: '80px'
                    }}
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '5px' }}>
                    Hold Ctrl/Cmd to select multiple subjects
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(formData.role === 'Form Teacher' || formData.role === 'Dual Role') && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Assigned Class *</label>
                  <select
                    name="assignedClass"
                    value={formData.assignedClass}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select Class</option>
                    {availableClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(51, 65, 85, 0.5)',
                    border: '2px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '1rem'
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={handleCancel}
                  style={{
                    background: 'rgba(148, 163, 184, 0.3)',
                    color: '#e2e8f0',
                    border: '2px solid rgba(148, 163, 184, 0.3)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClean;
