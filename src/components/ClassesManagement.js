import React, { useState, useEffect } from 'react';
import './ClassesManagement.css';

const ClassesManagement = () => {
  const [classes, setClasses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    classLevel: '',
    classTeacher: '',
    assistantTeacher: '',
    capacity: '',
    currentEnrollment: '',
    roomNumber: '',
    academicYear: new Date().getFullYear().toString(),
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available class levels
  const classLevels = [
    'Pre-Nursery 1', 'Pre-Nursery 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  // Sample teachers for assignment
  const availableTeachers = [
    'Sarah Johnson', 'Michael Bello', 'Grace Okonkwo', 
    'David Adeyemi', 'Funke Adebayo', 'James Okafor'
  ];

  // Load sample data on mount
  useEffect(() => {
    const sampleClasses = [
      {
        id: 1,
        className: 'JSS 1A',
        classLevel: 'JSS 1',
        classTeacher: 'Sarah Johnson',
        assistantTeacher: 'Grace Okonkwo',
        capacity: 35,
        currentEnrollment: 32,
        roomNumber: 'A101',
        academicYear: '2024',
        status: 'active'
      },
      {
        id: 2,
        className: 'JSS 1B',
        classLevel: 'JSS 1',
        classTeacher: 'Michael Bello',
        assistantTeacher: '',
        capacity: 35,
        currentEnrollment: 28,
        roomNumber: 'A102',
        academicYear: '2024',
        status: 'active'
      },
      {
        id: 3,
        className: 'SSS 2A',
        classLevel: 'SSS 2',
        classTeacher: 'David Adeyemi',
        assistantTeacher: 'James Okafor',
        capacity: 40,
        currentEnrollment: 38,
        roomNumber: 'B201',
        academicYear: '2024',
        status: 'active'
      },
      {
        id: 4,
        className: 'Primary 3A',
        classLevel: 'Primary 3',
        classTeacher: 'Funke Adebayo',
        assistantTeacher: '',
        capacity: 30,
        currentEnrollment: 25,
        roomNumber: 'C301',
        academicYear: '2024',
        status: 'active'
      }
    ];
    setClasses(sampleClasses);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.className.trim()) newErrors.className = 'Class name is required';
    if (!formData.classLevel) newErrors.classLevel = 'Class level is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    
    // Validate capacity is a number and greater than 0
    const capacityNum = parseInt(formData.capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    
    // Validate enrollment doesn't exceed capacity
    const enrollmentNum = parseInt(formData.currentEnrollment) || 0;
    if (enrollmentNum > capacityNum) {
      newErrors.currentEnrollment = 'Current enrollment cannot exceed capacity';
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
      
      if (editingClass) {
        // Update existing class
        setClasses(prev => prev.map(cls => 
          cls.id === editingClass.id 
            ? { ...formData, id: editingClass.id }
            : cls
        ));
      } else {
        // Add new class
        const newClass = {
          ...formData,
          id: Date.now(),
          currentEnrollment: parseInt(formData.currentEnrollment) || 0,
          capacity: parseInt(formData.capacity)
        };
        setClasses(prev => [...prev, newClass]);
      }
      
      // Reset form
      setFormData({
        className: '',
        classLevel: '',
        classTeacher: '',
        assistantTeacher: '',
        capacity: '',
        currentEnrollment: '',
        roomNumber: '',
        academicYear: new Date().getFullYear().toString(),
        status: 'active'
      });
      setEditingClass(null);
      setShowAddForm(false);
      setErrors({});
      
    } catch (error) {
      console.error('Class creation error:', error);
      alert('Class creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData(cls);
    setShowAddForm(true);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(cls => cls.id !== classId));
    }
  };

  const handleCancel = () => {
    setFormData({
      className: '',
      classLevel: '',
      classTeacher: '',
      assistantTeacher: '',
      capacity: '',
      currentEnrollment: '',
      roomNumber: '',
      academicYear: new Date().getFullYear().toString(),
      status: 'active'
    });
    setEditingClass(null);
    setShowAddForm(false);
    setErrors({});
  };

  const getEnrollmentPercentage = (current, capacity) => {
    return Math.round((current / capacity) * 100);
  };

  const getEnrollmentStatus = (percentage) => {
    if (percentage >= 90) return { color: '#ef4444', status: 'Full' };
    if (percentage >= 75) return { color: '#fbbf24', status: 'Almost Full' };
    return { color: '#22c55e', status: 'Available' };
  };

  const filteredClasses = classes.filter(cls => 
    cls.className.toLowerCase().includes('') || 
    cls.classLevel.toLowerCase().includes('') ||
    cls.classTeacher.toLowerCase().includes('')
  );

  return (
    <div className="classes-management">
      <div className="management-header">
        <h2>Classes Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          + Add New Class
        </button>
      </div>

      <div className="classes-table">
        <div className="table-header">
          <h3>All Classes ({filteredClasses.length})</h3>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search classes..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Level</th>
                <th>Class Teacher</th>
                <th>Assistant Teacher</th>
                <th>Enrollment</th>
                <th>Room</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map(cls => {
                const percentage = getEnrollmentPercentage(cls.currentEnrollment, cls.capacity);
                const enrollmentStatus = getEnrollmentStatus(percentage);
                
                return (
                  <tr key={cls.id}>
                    <td className="class-name">{cls.className}</td>
                    <td>{cls.classLevel}</td>
                    <td>{cls.classTeacher || '-'}</td>
                    <td>{cls.assistantTeacher || '-'}</td>
                    <td>
                      <div className="enrollment-info">
                        <div className="enrollment-numbers">
                          {cls.currentEnrollment}/{cls.capacity}
                        </div>
                        <div className="enrollment-bar">
                          <div 
                            className="enrollment-fill" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: enrollmentStatus.color 
                            }}
                          ></div>
                        </div>
                        <div className="enrollment-status" style={{ color: enrollmentStatus.color }}>
                          {enrollmentStatus.status}
                        </div>
                      </div>
                    </td>
                    <td>{cls.roomNumber}</td>
                    <td>
                      <span className={`status-badge ${cls.status}`}>
                        {cls.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEdit(cls)}
                          className="btn-edit"
                          title="Edit Class"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(cls.id)}
                          className="btn-delete"
                          title="Delete Class"
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

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
              <button onClick={handleCancel} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit} className="class-form">
              <div className="form-grid">
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Class Name *</label>
                      <input
                        type="text"
                        name="className"
                        value={formData.className}
                        onChange={handleInputChange}
                        className={errors.className ? 'error' : ''}
                        placeholder="e.g., JSS 1A, Primary 3B"
                      />
                      {errors.className && <span className="error-message">{errors.className}</span>}
                    </div>

                    <div className="form-group">
                      <label>Class Level *</label>
                      <select
                        name="classLevel"
                        value={formData.classLevel}
                        onChange={handleInputChange}
                        className={errors.classLevel ? 'error' : ''}
                      >
                        <option value="">Select Class Level</option>
                        {classLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      {errors.classLevel && <span className="error-message">{errors.classLevel}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Class Teacher</label>
                      <select
                        name="classTeacher"
                        value={formData.classTeacher}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Teacher</option>
                        {availableTeachers.map(teacher => (
                          <option key={teacher} value={teacher}>{teacher}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Assistant Teacher</label>
                      <select
                        name="assistantTeacher"
                        value={formData.assistantTeacher}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Assistant</option>
                        {availableTeachers.map(teacher => (
                          <option key={teacher} value={teacher}>{teacher}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Room Number *</label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleInputChange}
                        className={errors.roomNumber ? 'error' : ''}
                        placeholder="e.g., A101, B201"
                      />
                      {errors.roomNumber && <span className="error-message">{errors.roomNumber}</span>}
                    </div>

                    <div className="form-group">
                      <label>Academic Year</label>
                      <select
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleInputChange}
                      >
                        <option value="2024">2024/2025</option>
                        <option value="2023">2023/2024</option>
                        <option value="2022">2022/2023</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Enrollment Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Capacity *</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className={errors.capacity ? 'error' : ''}
                        placeholder="Maximum students"
                        min="1"
                      />
                      {errors.capacity && <span className="error-message">{errors.capacity}</span>}
                    </div>

                    <div className="form-group">
                      <label>Current Enrollment</label>
                      <input
                        type="number"
                        name="currentEnrollment"
                        value={formData.currentEnrollment}
                        onChange={handleInputChange}
                        className={errors.currentEnrollment ? 'error' : ''}
                        placeholder="Current students"
                        min="0"
                      />
                      {errors.currentEnrollment && <span className="error-message">{errors.currentEnrollment}</span>}
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
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving...' : (editingClass ? 'Update Class' : 'Add Class')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesManagement;
