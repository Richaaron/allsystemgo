import React, { useState, useEffect } from 'react';

const ResultsNigerian = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [term, setTerm] = useState('Second Term');
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({});

  // Sample students with their registered subjects
  const sampleStudents = [
    {
      id: 1,
      admissionNumber: 'FVS/2024/0001',
      firstName: 'Ahmed',
      lastName: 'Bello',
      studentClass: 'JSS 2',
      registeredSubjects: [
        { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Basic Science', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Social Studies', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Civic Education', maxCA1: 20, maxCA2: 20, maxExam: 60 }
      ]
    },
    {
      id: 2,
      admissionNumber: 'FVS/2024/0002',
      firstName: 'Chinyere',
      lastName: 'Okonkwo',
      studentClass: 'JSS 2',
      registeredSubjects: [
        { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Basic Science', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Basic Technology', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Business Studies', maxCA1: 20, maxCA2: 20, maxExam: 60 }
      ]
    },
    {
      id: 3,
      admissionNumber: 'FVS/2024/0003',
      firstName: 'Tunde',
      lastName: 'Johnson',
      studentClass: 'SSS 1',
      registeredSubjects: [
        { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Physics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Chemistry', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Biology', maxCA1: 20, maxCA2: 20, maxExam: 60 }
      ]
    },
    {
      id: 4,
      admissionNumber: 'FVS/2024/0004',
      firstName: 'Fatima',
      lastName: 'Mohammed',
      studentClass: 'SSS 1',
      registeredSubjects: [
        { name: 'English Language', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Mathematics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Physics', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Chemistry', maxCA1: 20, maxCA2: 20, maxExam: 60 },
        { name: 'Geography', maxCA1: 20, maxCA2: 20, maxExam: 60 }
      ]
    }
  ];

  // Sample existing results
  const sampleResults = [
    {
      id: 1,
      studentId: 1,
      studentName: 'Ahmed Bello',
      studentClass: 'JSS 2',
      term: 'Second Term',
      subjects: [
        { name: 'English Language', ca1: 18, ca2: 19, exam: 48, total: 85, grade: 'A' },
        { name: 'Mathematics', ca1: 16, ca2: 17, exam: 45, total: 78, grade: 'B' },
        { name: 'Basic Science', ca1: 17, ca2: 18, exam: 50, total: 85, grade: 'A' }
      ],
      overallTotal: 248,
      overallAverage: 82.7,
      overallGrade: 'A',
      status: 'published'
    }
  ];

  useEffect(() => {
    setStudents(sampleStudents);
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

  // Initialize form data when student is selected
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    const initialFormData = {};
    
    student.registeredSubjects.forEach(subject => {
      initialFormData[subject.name] = {
        ca1: '',
        ca2: '',
        exam: '',
        total: 0,
        grade: 'F'
      };
    });
    
    setFormData(initialFormData);
    setShowForm(true);
  };

  // Calculate total and grade for a subject
  const calculateSubjectScore = (subjectName, ca1, ca2, exam) => {
    const total = (parseInt(ca1) || 0) + (parseInt(ca2) || 0) + (parseInt(exam) || 0);
    const grade = getGrade(total);
    return { total, grade };
  };

  // Handle score input changes
  const handleScoreChange = (subjectName, fieldType, value) => {
    const numValue = Math.min(parseInt(value) || 0, fieldType === 'exam' ? 60 : 20);
    if (numValue < 0) return;

    setFormData(prev => {
      const updatedData = { ...prev };
      if (!updatedData[subjectName]) {
        updatedData[subjectName] = { ca1: '', ca2: '', exam: '', total: 0, grade: 'F' };
      }
      
      updatedData[subjectName] = {
        ...updatedData[subjectName],
        [fieldType]: numValue
      };

      // Calculate total and grade
      const { total, grade } = calculateSubjectScore(
        subjectName,
        updatedData[subjectName].ca1,
        updatedData[subjectName].ca2,
        updatedData[subjectName].exam
      );
      
      updatedData[subjectName].total = total;
      updatedData[subjectName].grade = grade;

      return updatedData;
    });
  };

  // Calculate overall scores
  const calculateOverallScores = () => {
    if (!selectedStudent) return { total: 0, average: 0, grade: 'F' };
    
    const subjects = Object.values(formData);
    if (subjects.length === 0) return { total: 0, average: 0, grade: 'F' };
    
    const totalScore = subjects.reduce((sum, subject) => sum + (subject.total || 0), 0);
    const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;
    const grade = getGrade(Math.round(averageScore));
    
    return { total: totalScore, average: averageScore, grade };
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedStudent) return;

    const overallScores = calculateOverallScores();
    const subjectResults = selectedStudent.registeredSubjects.map(subject => ({
      name: subject.name,
      ca1: formData[subject.name]?.ca1 || 0,
      ca2: formData[subject.name]?.ca2 || 0,
      exam: formData[subject.name]?.exam || 0,
      total: formData[subject.name]?.total || 0,
      grade: formData[subject.name]?.grade || 'F'
    }));

    const newResult = {
      id: results.length + 1,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      studentClass: selectedStudent.studentClass,
      term: term,
      subjects: subjectResults,
      overallTotal: overallScores.total,
      overallAverage: overallScores.average,
      overallGrade: overallScores.grade,
      status: 'draft'
    };

    setResults([...results, newResult]);
    setShowForm(false);
    setSelectedStudent(null);
    setFormData({});
  };

  // Filter results based on user role
  const getFilteredResults = () => {
    if (!user || user.role === 'admin') {
      return results;
    }

    switch (user.role) {
      case 'Form Teacher':
        return results.filter(result => result.studentClass === 'JSS 2');
      case 'Subject Teacher':
        return results.filter(result => {
          return result.subjects.some(subject => 
            ['Mathematics', 'Physics'].includes(subject.name)
          );
        });
      case 'Dual Role':
        return results.filter(result => 
          result.studentClass === 'SSS 1' || 
          result.subjects.some(subject => 
            ['Mathematics', 'Physics', 'Chemistry'].includes(subject.name)
          )
        );
      default:
        return [];
    }
  };

  const filteredResults = getFilteredResults();
  const overallScores = calculateOverallScores();

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
        <select
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          style={{
            background: 'rgba(51, 65, 85, 0.5)',
            border: '2px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '8px',
            color: '#f1f5f9',
            padding: '10px',
            fontSize: '1rem'
          }}
        >
          <option value="First Term">First Term</option>
          <option value="Second Term">Second Term</option>
          <option value="Third Term">Third Term</option>
        </select>
      </div>

      {/* Student Selection */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>Select Student for Result Entry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          {students.map(student => (
            <div
              key={student.id}
              onClick={() => handleStudentSelect(student)}
              style={{
                background: 'rgba(51, 65, 85, 0.5)',
                border: '2px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.background = 'rgba(59, 130, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                e.target.style.background = 'rgba(51, 65, 85, 0.5)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ color: '#f1f5f9', fontWeight: '600' }}>
                  {student.firstName} {student.lastName}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {student.admissionNumber}
                </span>
              </div>
              <div style={{ color: '#60a5fa', fontSize: '0.9rem', marginBottom: '5px' }}>
                {student.studentClass}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                {student.registeredSubjects.length} subjects
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Entry Form */}
      {showForm && selectedStudent && (
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
            maxWidth: '900px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#f1f5f9', fontSize: '1.5rem', margin: 0 }}>
                  Enter Results - {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>
                  {selectedStudent.studentClass} • {selectedStudent.admissionNumber} • {term}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setSelectedStudent(null);
                  setFormData({});
                }}
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
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#f1f5f9', marginBottom: '15px' }}>Subject Scores</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#e2e8f0' }}>Subject</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>1st CA (20)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>2nd CA (20)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>Exam (60)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>Total</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0' }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.registeredSubjects.map(subject => {
                        const subjectData = formData[subject.name] || {};
                        return (
                          <tr key={subject.name} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                            <td style={{ padding: '10px', color: '#e2e8f0', fontWeight: '500' }}>
                              {subject.name}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={subjectData.ca1 || ''}
                                onChange={(e) => handleScoreChange(subject.name, 'ca1', e.target.value)}
                                style={{
                                  width: '60px',
                                  padding: '5px',
                                  background: 'rgba(51, 65, 85, 0.5)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  borderRadius: '4px',
                                  color: '#f1f5f9',
                                  textAlign: 'center'
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={subjectData.ca2 || ''}
                                onChange={(e) => handleScoreChange(subject.name, 'ca2', e.target.value)}
                                style={{
                                  width: '60px',
                                  padding: '5px',
                                  background: 'rgba(51, 65, 85, 0.5)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  borderRadius: '4px',
                                  color: '#f1f5f9',
                                  textAlign: 'center'
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="60"
                                value={subjectData.exam || ''}
                                onChange={(e) => handleScoreChange(subject.name, 'exam', e.target.value)}
                                style={{
                                  width: '60px',
                                  padding: '5px',
                                  background: 'rgba(51, 65, 85, 0.5)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  borderRadius: '4px',
                                  color: '#f1f5f9',
                                  textAlign: 'center'
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center', color: '#e2e8f0', fontWeight: '600' }}>
                              {subjectData.total || 0}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                color: 'white',
                                backgroundColor: getGradeColor(subjectData.grade || 'F')
                              }}>
                                {subjectData.grade || 'F'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overall Summary */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#60a5fa', marginBottom: '10px' }}>Overall Summary</h4>
                <div style={{ display: 'flex', gap: '30px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Total Score: </span>
                    <span style={{ color: '#f1f5f9', fontWeight: '600' }}>{overallScores.total}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Average: </span>
                    <span style={{ color: '#f1f5f9', fontWeight: '600' }}>
                      {overallScores.average.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Grade: </span>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: getGradeColor(overallScores.grade)
                    }}>
                      {overallScores.grade}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedStudent(null);
                    setFormData({});
                  }}
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
                  Save Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Results Table */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          Saved Results ({filteredResults.length})
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(51, 65, 85, 0.8)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Student</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Class</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Term</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Average</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Grade</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#e2e8f0' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map(result => (
              <tr key={result.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <td style={{ padding: '12px', color: '#e2e8f0' }}>{result.studentName}</td>
                <td style={{ padding: '12px', color: '#94a3b8' }}>{result.studentClass}</td>
                <td style={{ padding: '12px', color: '#94a3b8' }}>{result.term}</td>
                <td style={{ padding: '12px', color: '#e2e8f0', fontWeight: '600' }}>
                  {result.overallAverage.toFixed(1)}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: getGradeColor(result.overallGrade)
                  }}>
                    {result.overallGrade}
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

        {filteredResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <p>No results available. Select a student above to enter results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsNigerian;
