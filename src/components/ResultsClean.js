import React, { useState, useEffect } from 'react';

const ResultsClean = () => {
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

  useEffect(() => {
    // Load sample data
    const sampleData = [
      {
        id: 1,
        studentName: 'Ahmed Bello',
        studentClass: 'JSS 2A',
        term: 'Second Term',
        totalScore: 85,
        grade: 'A',
        status: 'published'
      },
      {
        id: 2,
        studentName: 'Chinyere Okonkwo',
        studentClass: 'JSS 1A',
        term: 'Second Term',
        totalScore: 78,
        grade: 'B',
        status: 'published'
      }
    ];
    setResults(sampleData);
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

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(15, 23, 42, 0.5)',
      borderRadius: '8px',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '1.8rem' }}>Results Management</h2>
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
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          Student Results ({results.length})
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
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
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
              </tr>
            ))}
          </tbody>
        </table>
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

export default ResultsClean;
