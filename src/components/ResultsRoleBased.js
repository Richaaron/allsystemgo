import React, { useState, useEffect } from 'react';

const ResultsRoleBased = ({ user }) => {
  const [results, setResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    term: '',
    totalScore: 0,
    grade: 'F',
    status: 'draft'
  });

  // Sample results data
  const sampleResults = [
    {
      id: 1,
      studentName: 'Ahmed Bello',
      studentClass: 'JSS 2',
      term: 'Second Term',
      totalScore: 85,
      grade: 'A',
      status: 'published',
      subjects: {
        'English Language': { score: 88, grade: 'A' },
        'Mathematics': { score: 82, grade: 'B' },
        'Basic Science': { score: 85, grade: 'A' }
      }
    },
    {
      id: 2,
      studentName: 'Chinyere Okonkwo',
      studentClass: 'JSS 2',
      term: 'Second Term',
      totalScore: 78,
      grade: 'B',
      status: 'published',
      subjects: {
        'English Language': { score: 75, grade: 'B' },
        'Mathematics': { score: 80, grade: 'B' },
        'Basic Science': { score: 79, grade: 'B' }
      }
    },
    {
      id: 3,
      studentName: 'Tunde Johnson',
      studentClass: 'SSS 1',
      term: 'Second Term',
      totalScore: 92,
      grade: 'A',
      status: 'published',
      subjects: {
        'Mathematics': { score: 95, grade: 'A' },
        'Physics': { score: 90, grade: 'A' },
        'Chemistry': { score: 91, grade: 'A' }
      }
    },
    {
      id: 4,
      studentName: 'Fatima Mohammed',
      studentClass: 'SSS 1',
      term: 'Second Term',
      totalScore: 76,
      grade: 'B',
      status: 'published',
      subjects: {
        'Mathematics': { score: 78, grade: 'B' },
        'Physics': { score: 74, grade: 'B' },
        'Chemistry': { score: 76, grade: 'B' }
      }
    }
  ];

  // Sample teacher data for role-based access
  const teacherData = {
    'Form Teacher': {
      assignedClass: 'JSS 2',
      canViewAllSubjects: true,
      canViewAllStudentsInClass: true
    },
    'Subject Teacher': {
      subjects: ['Mathematics', 'Physics'],
      department: 'Secondary',
      canViewOnlySubjectStudents: true
    },
    'Dual Role': {
      assignedClass: 'SSS 1',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      canViewAllSubjects: true,
      canViewAllStudentsInClass: true,
      canViewOnlySubjectStudents: true
    }
  };

  useEffect(() => {
    setResults(sampleResults);
  }, []);

  const getGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 45) return 'E';
    return 'F';
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return '#22c55e';
      case 'B': return '#3b82f6';
      case 'C': return '#fbbf24';
      case 'D': return '#fb923c';
      case 'E': return '#f97316';
      default: return '#ef4444';
    }
  };

  // Filter results based on user role
  const getFilteredResults = () => {
    if (!user || user.role === 'admin') {
      return results; // Admin can see all results
    }

    const teacherInfo = teacherData[user.role];
    if (!teacherInfo) {
      return []; // Unknown role, no access
    }

    switch (user.role) {
      case 'Form Teacher':
        // Form teacher can see all results for their assigned class
        return results.filter(result => result.studentClass === teacherInfo.assignedClass);
      
      case 'Subject Teacher':
        // Subject teacher can see only students who take their subjects
        return results.filter(result => {
          if (result.subjects) {
            return Object.keys(result.subjects).some(subject => 
              teacherInfo.subjects.includes(subject)
            );
          }
          return false;
        });
      
      case 'Dual Role':
        // Dual role can see all results for their assigned class AND subject students
        const classResults = results.filter(result => result.studentClass === teacherInfo.assignedClass);
        const subjectResults = results.filter(result => {
          if (result.subjects) {
            return Object.keys(result.subjects).some(subject => 
              teacherInfo.subjects.includes(subject)
            );
          }
          return false;
        });
        // Combine and remove duplicates
        return [...new Map([...classResults, ...subjectResults].map(item => [item.id, item])).values()];
      
      default:
        return [];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResult = {
      id: results.length + 1,
      ...formData,
      grade: getGrade(formData.totalScore)
    };
    setResults([...results, newResult]);
    setShowForm(false);
    setFormData({
      studentName: '',
      studentClass: '',
      term: '',
      totalScore: 0,
      grade: 'F',
      status: 'draft'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalScore' ? parseInt(value) || 0 : value
    }));
  };

  const filteredResults = getFilteredResults();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem', marginBottom: '5px' }}>Results Management</h2>
          {user && user.role !== 'admin' && (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {user.role} Access - {filteredResults.length} results visible
            </p>
          )}
        </div>
        {(user?.role === 'admin' || user?.role === 'Dual Role') && (
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
            + Add Result
          </button>
        )}
      </div>

      {/* Role Information Panel */}
      {user && user.role !== 'admin' && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#60a5fa', marginBottom: '10px' }}>Your Access Level: {user.role}</h4>
          <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
            {user.role === 'Form Teacher' && teacherData[user.role] && (
              <p>You can view all results for your assigned class: <strong>{teacherData[user.role].assignedClass}</strong></p>
            )}
            {user.role === 'Subject Teacher' && teacherData[user.role] && (
              <p>You can view results for students taking your subjects: <strong>{teacherData[user.role].subjects.join(', ')}</strong></p>
            )}
            {user.role === 'Dual Role' && teacherData[user.role] && (
              <div>
                <p>You can view all results for your assigned class: <strong>{teacherData[user.role].assignedClass}</strong></p>
                <p>And results for students taking your subjects: <strong>{teacherData[user.role].subjects.join(', ')}</strong></p>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          Student Results ({filteredResults.length})
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Student Name</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Class</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Term</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Score</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Grade</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Status</th>
              {user?.role === 'admin' && (
                <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredResults.map(result => (
              <tr key={result.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <td style={{ padding: '12px', color: '#e2e8f0' }}>{result.studentName}</td>
                <td style={{ padding: '12px', color: '#94a3b8' }}>{result.studentClass}</td>
                <td style={{ padding: '12px', color: '#94a3b8' }}>{result.term}</td>
                <td style={{ padding: '12px', color: '#e2e8f0', fontWeight: '600' }}>{result.totalScore}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: getGradeColor(result.grade)
                  }}>
                    {result.grade}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: result.status === 'published' ? '#22c55e' : '#94a3b8',
                    backgroundColor: result.status === 'published' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                    border: `1px solid ${result.status === 'published' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`
                  }}>
                    {result.status}
                  </span>
                </td>
                {user?.role === 'admin' && (
                  <td style={{ padding: '12px' }}>
                    <button 
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
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <p>No results available for your access level.</p>
            {user && user.role === 'Subject Teacher' && (
              <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                You can only see results for students taking your assigned subjects.
              </p>
            )}
          </div>
        )}
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
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', margin: 0 }}>Add New Result</h3>
              <button 
                onClick={() => setShowForm(false)}
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
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Class</label>
                <input
                  type="text"
                  name="studentClass"
                  value={formData.studentClass}
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Term</label>
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '5px' }}>Total Score (0-100)</label>
                <input
                  type="number"
                  name="totalScore"
                  value={formData.totalScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
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

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
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
                  Add Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsRoleBased;
