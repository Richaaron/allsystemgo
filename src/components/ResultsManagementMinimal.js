import React, { useState, useEffect } from 'react';

const ResultsManagementMinimal = () => {
  const [results, setResults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Grade system - Simplified
  const getGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 45) return 'E';
    return 'F';
  };

  // Load sample data on mount
  useEffect(() => {
    const sampleResults = [
      {
        id: 1,
        studentId: 'FVS/2024/0001',
        studentName: 'Ahmed Bello',
        class: 'JSS 2A',
        term: 'Second Term',
        academicYear: '2024/2025',
        averageScore: 85.0,
        grade: 'A',
        status: 'published'
      }
    ];
    setResults(sampleResults);
  }, []);

  return (
    <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem' }}>Results Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
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
          + Add New Result
        </button>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.8)', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>All Results ({results.length})</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0', borderBottom: '2px solid rgba(59, 130, 246, 0.3)' }}>Student</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0', borderBottom: '2px solid rgba(59, 130, 246, 0.3)' }}>Class</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0', borderBottom: '2px solid rgba(59, 130, 246, 0.3)' }}>Average Score</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0', borderBottom: '2px solid rgba(59, 130, 246, 0.3)' }}>Grade</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0', borderBottom: '2px solid rgba(59, 130, 246, 0.3)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <td style={{ padding: '12px', color: '#94a3b8' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#e2e8f0' }}>{result.studentName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{result.studentId}</div>
                  </div>
                </td>
                <td style={{ padding: '12px', color: '#94a3b8' }}>{result.class}</td>
                <td style={{ padding: '12px', color: '#94a3b8' }}>{result.averageScore.toFixed(1)}</td>
                <td style={{ padding: '12px' }}>
                  <span 
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: result.grade === 'A' ? '#22c55e' : '#3b82f6'
                    }}
                  >
                    {result.grade}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span 
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: '#22c55e',
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    {result.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
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
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', margin: 0 }}>Add New Result</h3>
              <button 
                onClick={() => setShowAddForm(false)}
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

            <div style={{ color: '#e2e8f0', textAlign: 'center' }}>
              <h4>Results Entry Form</h4>
              <p>This is a minimal working version to test functionality.</p>
              <p>Nigerian result structure (1st CA, 2nd CA, Exam) will be implemented here.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button 
                onClick={() => setShowAddForm(false)}
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
                onClick={() => {
                  alert('Result submitted successfully!');
                  setShowAddForm(false);
                }}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsManagementMinimal;
