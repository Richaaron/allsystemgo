import React, { useState, useEffect } from 'react';
import './ResultsManagement.css';

const ResultsManagementWorking = () => {
  const [results, setResults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    class: '',
    term: '',
    academicYear: '',
    subjects: [],
    totalScore: 0,
    averageScore: 0,
    grade: '',
    remarks: '',
    status: 'draft'
  });
  const [errors, setErrors] = useState({});

  // Grade system - Simplified
  const getGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 45) return 'E';
    return 'F';
  };

  const getGradeColor = (grade) => {
    if (grade === 'A') return '#22c55e';
    if (grade === 'B') return '#3b82f6';
    if (grade === 'C') return '#fbbf24';
    if (grade === 'D') return '#fb923c';
    if (grade === 'E') return '#f97316';
    return '#ef4444';
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
        subjects: [
          { name: 'English Language', firstCA: 20, secondCA: 20, exam: 45, total: 85, grade: 'A' },
          { name: 'Mathematics', firstCA: 18, secondCA: 20, exam: 40, total: 78, grade: 'B' },
          { name: 'Basic Science', firstCA: 22, secondCA: 23, exam: 47, total: 92, grade: 'A' }
        ],
        totalScore: 255,
        averageScore: 85.0,
        grade: 'A',
        remarks: 'Excellent performance. Keep up the good work!',
        status: 'published'
      }
    ];
    setResults(sampleResults);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectScoreChange = (subjectName, component, value) => {
    setFormData(prev => {
      const updatedSubjects = prev.subjects.map(subject => {
        if (subject.name === subjectName) {
          const updatedSubject = { ...subject, [component]: parseInt(value) || 0 };
          updatedSubject.total = updatedSubject.firstCA + updatedSubject.secondCA + updatedSubject.exam;
          updatedSubject.grade = getGrade(updatedSubject.total);
          return updatedSubject;
        }
        return subject;
      });
      
      const totalScore = updatedSubjects.reduce((sum, subject) => sum + subject.total, 0);
      const averageScore = updatedSubjects.length > 0 ? totalScore / updatedSubjects.length : 0;
      
      return {
        ...prev,
        subjects: updatedSubjects,
        totalScore,
        averageScore,
        grade: getGrade(Math.round(averageScore))
      };
    });
  };

  const addSubject = () => {
    const newSubject = {
      name: 'New Subject',
      firstCA: 0,
      secondCA: 0,
      exam: 0,
      total: 0,
      grade: 'F'
    };
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
  };

  const removeSubject = (subjectName) => {
    setFormData(prev => {
      const updatedSubjects = prev.subjects.filter(subject => subject.name !== subjectName);
      const totalScore = updatedSubjects.reduce((sum, subject) => sum + subject.total, 0);
      const averageScore = updatedSubjects.length > 0 ? totalScore / updatedSubjects.length : 0;
      
      return {
        ...prev,
        subjects: updatedSubjects,
        totalScore,
        averageScore,
        grade: getGrade(Math.round(averageScore))
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Result submitted successfully!');
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="results-management">
      <div className="management-header">
        <h2>Results Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          + Add New Result
        </button>
      </div>

      <div className="results-table">
        <div className="table-header">
          <h3>All Results ({results.length})</h3>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Term</th>
                <th>Average Score</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-name">{result.studentName}</div>
                      <div className="student-id">{result.studentId}</div>
                    </div>
                  </td>
                  <td>{result.class}</td>
                  <td>{result.term}</td>
                  <td>
                    <div className="score-display">
                      <span className="average-score">{result.averageScore.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="grade-badge" 
                      style={{ backgroundColor: getGradeColor(result.grade) }}
                    >
                      {result.grade}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${result.status}`}>
                      {result.status}
                    </span>
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
              <h3>Add New Result</h3>
              <button onClick={handleCancel} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit} className="result-form">
              <div className="form-grid">
                <div className="form-section">
                  <h4>Student Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Student Name *</label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="Enter student name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Class *</label>
                      <input
                        type="text"
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        placeholder="Enter class"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Subject Scores</h4>
                  
                  <div className="subjects-header">
                    <h5>Subjects ({formData.subjects.length})</h5>
                    <button type="button" onClick={addSubject} className="btn-add-subject">
                      + Add Subject
                    </button>
                  </div>

                  <div className="subjects-grid">
                    {formData.subjects.map((subject, index) => (
                      <div key={index} className="subject-item">
                        <div className="subject-header">
                          <input
                            type="text"
                            value={subject.name}
                            onChange={(e) => {
                              const updatedSubjects = formData.subjects.map((s, i) => 
                                i === index ? { ...s, name: e.target.value } : s
                              );
                              setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
                            }}
                            className="subject-input"
                            placeholder="Subject name"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeSubject(subject.name)}
                            className="btn-remove-subject"
                          >
                            ×
                          </button>
                        </div>
                        <div className="score-components">
                          <div className="score-input-group">
                            <label>1st CA (20)</label>
                            <input
                              type="number"
                              value={subject.firstCA}
                              onChange={(e) => handleSubjectScoreChange(subject.name, 'firstCA', e.target.value)}
                              min="0"
                              max="20"
                              className="score-input ca-input"
                            />
                          </div>
                          <div className="score-input-group">
                            <label>2nd CA (20)</label>
                            <input
                              type="number"
                              value={subject.secondCA}
                              onChange={(e) => handleSubjectScoreChange(subject.name, 'secondCA', e.target.value)}
                              min="0"
                              max="20"
                              className="score-input ca-input"
                            />
                          </div>
                          <div className="score-input-group">
                            <label>Exam (60)</label>
                            <input
                              type="number"
                              value={subject.exam}
                              onChange={(e) => handleSubjectScoreChange(subject.name, 'exam', e.target.value)}
                              min="0"
                              max="60"
                              className="score-input exam-input"
                            />
                          </div>
                        </div>
                        <div className="subject-total">
                          <div className="total-display">
                            <label>Total:</label>
                            <span className="total-score">{subject.total}/100</span>
                          </div>
                          <div className="grade-display">
                            <label>Grade:</label>
                            <span className="grade-badge" style={{ backgroundColor: getGradeColor(subject.grade) }}>
                              {subject.grade}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
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

export default ResultsManagementWorking;
