import React, { useState, useEffect } from 'react';

const ClassesClean = () => {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    classTeacher: '',
    roomNumber: '',
    capacity: '',
    currentEnrollment: '',
    academicYear: '',
    term: '',
    subjects: [],
    description: '',
    status: 'active'
  });

  const availableSubjects = [
    'English Language', 'Mathematics', 'Basic Science', 'Basic Technology',
    'Social Studies', 'Civic Education', 'Creative Arts', 'Home Economics',
    'Computer Studies', 'Physical Education', 'Agricultural Science',
    'Business Studies', 'French', 'Yoruba', 'Igbo', 'Hausa',
    'Chemistry', 'Physics', 'Biology', 'Geography', 'Economics',
    'Government', 'Literature in English', 'Christian Religious Studies',
    'Islamic Religious Studies', 'History', 'Accounting', 'Commerce'
  ];

  const teachers = [
    'John Smith', 'Mary Johnson', 'David Brown', 'Sarah Wilson',
    'Michael Davis', 'Jennifer Martinez', 'Robert Anderson', 'Lisa Thomas'
  ];

  useEffect(() => {
    // Load sample data
    const sampleClasses = [
      {
        id: 1,
        className: 'JSS 1',
        classTeacher: 'John Smith',
        roomNumber: 'Room 101',
        capacity: 30,
        currentEnrollment: 25,
        academicYear: '2024/2025',
        term: 'Second Term',
        subjects: ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Civic Education'],
        description: 'Junior Secondary School Year 1',
        status: 'active'
      },
      {
        id: 2,
        className: 'JSS 2',
        classTeacher: 'Mary Johnson',
        roomNumber: 'Room 102',
        capacity: 30,
        currentEnrollment: 28,
        academicYear: '2024/2025',
        term: 'Second Term',
        subjects: ['English Language', 'Mathematics', 'Basic Science', 'Basic Technology', 'Social Studies'],
        description: 'Junior Secondary School Year 2',
        status: 'active'
      },
      {
        id: 3,
        className: 'SSS 1',
        classTeacher: 'David Brown',
        roomNumber: 'Room 201',
        capacity: 25,
        currentEnrollment: 22,
        academicYear: '2024/2025',
        term: 'Second Term',
        subjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography'],
        description: 'Senior Secondary School Year 1',
        status: 'active'
      }
    ];
    setClasses(sampleClasses);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' || name === 'currentEnrollment' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubjectChange = (e) => {
    const selectedSubjects = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, subjects: selectedSubjects }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingClass) {
      // Update existing class
      setClasses(prev => prev.map(cls => 
        cls.id === editingClass.id 
          ? { ...cls, ...formData }
          : cls
      ));
    } else {
      // Add new class
      const newClass = {
        id: classes.length + 1,
        ...formData
      };
      setClasses(prev => [...prev, newClass]);
    }

    // Reset form
    setFormData({
      className: '',
      classTeacher: '',
      roomNumber: '',
      capacity: '',
      currentEnrollment: '',
      academicYear: '',
      term: '',
      subjects: [],
      description: '',
      status: 'active'
    });
    setEditingClass(null);
    setShowForm(false);
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData(cls);
    setShowForm(true);
  };

  const handleDelete = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(cls => cls.id !== classId));
    }
  };

  const handleCancel = () => {
    setFormData({
      className: '',
      classTeacher: '',
      roomNumber: '',
      capacity: '',
      currentEnrollment: '',
      academicYear: '',
      term: '',
      subjects: [],
      description: '',
      status: 'active'
    });
    setEditingClass(null);
    setShowForm(false);
  };

  const getEnrollmentStatus = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return { color: '#ef4444', status: 'Full' };
    if (percentage >= 70) return { color: '#f59e0b', status: 'Almost Full' };
    return { color: '#22c55e', status: 'Available' };
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem' }}>Classes Management</h2>
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
          + Add Class
        </button>
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          All Classes ({classes.length})
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Class Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Class Teacher</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Room</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Enrollment</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Subjects</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(cls => {
                const enrollmentStatus = getEnrollmentStatus(cls.currentEnrollment, cls.capacity);
                return (
                  <tr key={cls.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <td style={{ padding: '12px', color: '#e2e8f0', fontWeight: '600' }}>
                      {cls.className}
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{cls.classTeacher}</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{cls.roomNumber}</td>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ color: '#e2e8f0' }}>
                          {cls.currentEnrollment}/{cls.capacity}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: enrollmentStatus.color }}>
                          {enrollmentStatus.status}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>
                      {cls.subjects.slice(0, 3).join(', ')}
                      {cls.subjects.length > 3 && '...'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: cls.status === 'active' ? '#22c55e' : '#ef4444',
                        backgroundColor: cls.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        border: `1px solid ${cls.status === 'active' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {cls.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleEdit(cls)}
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
                          onClick={() => handleDelete(cls.id)}
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
                );
              })}
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
                {editingClass ? 'Edit Class' : 'Add New Class'}
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
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Class Name *</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="e.g., JSS 1A, SSS 2B"
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
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Class Teacher *</label>
                  <select
                    name="classTeacher"
                    value={formData.classTeacher}
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
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Room Number *</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., Room 101"
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
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
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
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Current Enrollment</label>
                  <input
                    type="number"
                    name="currentEnrollment"
                    value={formData.currentEnrollment}
                    onChange={handleInputChange}
                    min="0"
                    max={formData.capacity}
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
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Academic Year *</label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024/2025"
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
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Term *</label>
                  <select
                    name="term"
                    value={formData.term}
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
                    <option value="">Select Term</option>
                    <option value="First Term">First Term</option>
                    <option value="Second Term">Second Term</option>
                    <option value="Third Term">Third Term</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
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
                    minHeight: '100px'
                  }}
                >
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '5px' }}>
                  Hold Ctrl/Cmd to select multiple subjects
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Class description..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(51, 65, 85, 0.5)',
                    border: '2px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

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
                  {editingClass ? 'Update Class' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesClean;
