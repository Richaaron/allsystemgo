import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import emailNotificationService from '../services/emailNotificationService';

const StudentClean = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await supabaseService.getStudents();
      if (data && data.length > 0) {
        setStudents(data);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    // Use last 5 digits of timestamp for uniqueness - no collision risk
    const uniqueId = Date.now().toString().slice(-5);
    return `FVS/${year}/${uniqueId}`;
  };

  const generateCredentials = (studentName) => {
    const cleanName = studentName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomDigits = Math.floor(Math.random() * 90) + 10;
    const username = `${cleanName}${randomDigits}`;
    
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return { username, password };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const admissionNumber = generateAdmissionNumber();
      const credentials = generateCredentials(formData.studentName);
      
      const newStudentData = {
        studentName: formData.studentName,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        admissionNumber: admissionNumber,
        // Send default dummy values for other database constraints
        class: 'Unassigned',
        gender: 'Unknown',
        dateOfBirth: '2000-01-01',
        address: 'N/A'
      };

      console.log('Adding student to database...');
      const studentResult = await supabaseService.addStudent(newStudentData);

      console.log('Creating parent user account...');
      await supabaseService.createParentUser({
        username: credentials.username,
        email: formData.parentEmail,
        password: credentials.password
      });

      console.log('Sending emails...');
      await emailNotificationService.sendStudentWelcomeEmail(
        formData.studentName,
        formData.parentName,
        formData.parentEmail,
        credentials
      );

      setSuccessMessage(`Student successfully registered! Credentials generated and emailed.`);
      
      // Refresh list
      loadStudents();

      // Reset form
      setFormData({
        studentName: '',
        parentName: '',
        parentPhone: '',
        parentEmail: ''
      });
      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage(error.message || 'Failed to register student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This cannot be undone.')) {
      try {
        await supabaseService.deleteStudent(studentId);
        setStudents(prev => prev.filter(student => student.id !== studentId));
      } catch (error) {
        console.error('Failed to delete student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      studentName: '',
      parentName: '',
      parentPhone: '',
      parentEmail: ''
    });
    setShowForm(false);
    setErrorMessage('');
    setSuccessMessage('');
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
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Student Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Parent/Guardian</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Parent Phone</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Parent Email</th>
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
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{student.parentName}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{student.parentPhone}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{student.parentEmail || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
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
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', margin: 0 }}>
                Fast Student Registration
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

            {successMessage && (
              <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#4ade80', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}

            {!successMessage && (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Student Full Name *</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Parent/Guardian Name *</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Mr. David Doe"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Parent/Guardian Phone *</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    placeholder="e.g. 08012345678"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Parent Email (Optional)</label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    placeholder="e.g. parent@example.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '2px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '1rem'
                    }}
                  />
                  <small style={{ color: '#94a3b8', display: 'block', marginTop: '5px' }}>
                    Credentials will be sent here, and a copy sent to the school email.
                  </small>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    style={{
                      background: 'rgba(148, 163, 184, 0.3)',
                      color: '#e2e8f0',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.5 : 1
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Register & Generate Credentials'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClean;
