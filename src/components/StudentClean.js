import React, { useState, useEffect } from 'react';

const StudentClean = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionNumber: '',
    class: '',
    gender: '',
    dateOfBirth: '',
    parentName: '',
    parentPhone: '',
    address: '',
    status: 'active'
  });

  const classes = [
    'Pre-Nursery 1', 'Pre-Nursery 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  useEffect(() => {
    // Load sample data
    const sampleStudents = [
      {
        id: 1,
        admissionNumber: 'FVS/2024/0001',
        firstName: 'Ahmed',
        lastName: 'Bello',
        dateOfBirth: '2010-05-15',
        gender: 'Male',
        class: 'JSS 2',
        parentName: 'Mr. Bello',
        parentPhone: '+234-8012345678',
        address: '123 Lagos Street, Lagos',
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
        parentName: 'Mrs. Okonkwo',
        parentPhone: '+234-8023456789',
        address: '456 Enugu Road, Anambra',
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
        parentName: 'Mr. Johnson',
        parentPhone: '+234-8034567890',
        address: '789 Abuja Way, FCT',
        status: 'active'
      }
    ];
    setStudents(sampleStudents);
  }, []);

  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `FVS/${year}/${randomNum}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingStudent) {
      // Update existing student
      setStudents(prev => prev.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...formData }
          : student
      ));
    } else {
      // Add new student
      const newStudent = {
        id: students.length + 1,
        admissionNumber: formData.admissionNumber || generateAdmissionNumber(),
        ...formData
      };
      setStudents(prev => [...prev, newStudent]);
    }

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      admissionNumber: '',
      class: '',
      gender: '',
      dateOfBirth: '',
      parentName: '',
      parentPhone: '',
      address: '',
      status: 'active'
    });
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowForm(true);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== studentId));
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      admissionNumber: '',
      class: '',
      gender: '',
      dateOfBirth: '',
      parentName: '',
      parentPhone: '',
      address: '',
      status: 'active'
    });
    setEditingStudent(null);
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
        <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem' }}>Students Management</h2>
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
          + Add Student
        </button>
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          All Students ({students.length})
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Admission No</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Class</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Gender</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Parent</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <td style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>{student.admissionNumber}</td>
                  <td style={{ padding: '12px', color: '#e2e8f0' }}>
                    {student.firstName} {student.lastName}
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{student.class}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{student.gender}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{student.parentName}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: student.status === 'active' ? '#22c55e' : '#ef4444',
                      backgroundColor: student.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      border: `1px solid ${student.status === 'active' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {student.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleEdit(student)}
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
                        onClick={() => handleDelete(student.id)}
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', margin: 0 }}>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
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
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Admission Number</label>
                  <input
                    type="text"
                    name="admissionNumber"
                    value={formData.admissionNumber}
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
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Class *</label>
                  <select
                    name="class"
                    value={formData.class}
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
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Parent Name *</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Parent Phone *</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
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
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
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
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClean;
