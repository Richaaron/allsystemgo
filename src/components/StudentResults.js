import React, { useState, useEffect } from 'react';
import { NIGERIAN_GRADING_SCALE } from '../data/models';
import './StudentResults.css';

const StudentResults = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [results, setResults] = useState({});
  const [currentTerm, setCurrentTerm] = useState('First Term');
  const [currentSession, setCurrentSession] = useState('2024/2025');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock student data - in real app, this would come from database
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        admissionNumber: 'FVS/2024/0001',
        firstName: 'Ahmed',
        lastName: 'Bello',
        middleName: 'Musa',
        class: 'SSS 1A',
        stream: 'Science',
        assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Economics', 'ICT']
      },
      {
        id: 2,
        admissionNumber: 'FVS/2024/0002',
        firstName: 'Fatima',
        lastName: 'Abubakar',
        middleName: 'Aisha',
        class: 'SSS 2B',
        stream: 'Art',
        assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Government', 'Literature in English', 'Economics', 'Religious Studies']
      },
      {
        id: 3,
        admissionNumber: 'FVS/2024/0003',
        firstName: 'Chukwu',
        lastName: 'Okonkwo',
        middleName: 'Emeka',
        class: 'SSS 3C',
        stream: 'Commercial',
        assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Account', 'Commerce', 'Marketing', 'ICT']
      }
    ];
    setStudents(mockStudents);
  }, []);

  // Filter students based on search
  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName} ${student.admissionNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize results for selected student
  useEffect(() => {
    if (selectedStudent && selectedStudent.assignedSubjects) {
      const initialResults = {};
      selectedStudent.assignedSubjects.forEach(subject => {
        initialResults[subject] = {
          firstAssessment: '',
          secondAssessment: '',
          exam: '',
          total: '',
          grade: '',
          remarks: ''
        };
      });
      setResults(initialResults);
    }
  }, [selectedStudent]);

  // Calculate total, grade, and remarks when scores change
  const calculateResult = (subject, fieldType, value) => {
    const updatedResults = { ...results };
    updatedResults[subject][fieldType] = value;

    // Calculate total if all fields have values
    const firstAssessment = parseFloat(updatedResults[subject].firstAssessment) || 0;
    const secondAssessment = parseFloat(updatedResults[subject].secondAssessment) || 0;
    const exam = parseFloat(updatedResults[subject].exam) || 0;
    
    const total = firstAssessment + secondAssessment + exam;
    updatedResults[subject].total = total.toFixed(1);

    // Calculate grade based on total
    let grade = 'F';
    let remarks = 'Fail';
    
    if (total >= 70) {
      grade = 'A';
      remarks = 'Excellent';
    } else if (total >= 60) {
      grade = 'B';
      remarks = 'Very Good';
    } else if (total >= 50) {
      grade = 'C';
      remarks = 'Good';
    } else if (total >= 45) {
      grade = 'D';
      remarks = 'Fair';
    } else if (total >= 40) {
      grade = 'E';
      remarks = 'Pass';
    }

    updatedResults[subject].grade = grade;
    updatedResults[subject].remarks = remarks;

    setResults(updatedResults);
  };

  // Handle result input changes
  const handleResultChange = (subject, fieldType, value) => {
    // Validate input
    if (value !== '' && (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100)) {
      return;
    }
    calculateResult(subject, fieldType, value);
  };

  // Save results
  const handleSaveResults = async () => {
    setIsSaving(true);
    try {
      // Here you would normally save to database
      const resultData = {
        studentId: selectedStudent.id,
        term: currentTerm,
        session: currentSession,
        results: results,
        savedAt: new Date().toISOString()
      };
      
      console.log('Saving results:', resultData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Results saved successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error saving results. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate overall statistics
  const calculateStatistics = () => {
    if (!selectedStudent || !results) return null;
    
    const subjects = Object.keys(results);
    const validResults = subjects.filter(subject => results[subject].total !== '');
    
    if (validResults.length === 0) return null;
    
    const totals = validResults.map(subject => parseFloat(results[subject].total));
    const totalScore = totals.reduce((sum, score) => sum + score, 0);
    const average = (totalScore / validResults.length).toFixed(1);
    
    const gradeCounts = {};
    validResults.forEach(subject => {
      const grade = results[subject].grade;
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
    
    const highestScore = Math.max(...totals);
    const lowestScore = Math.min(...totals);
    
    return {
      average,
      totalSubjects: validResults.length,
      highestScore,
      lowestScore,
      gradeCounts
    };
  };

  const statistics = calculateStatistics();

  return (
    <div className="student-results">
      <div className="results-header">
        <h1>Student Results Management</h1>
        <p>Enter and manage student academic results</p>
      </div>

      <div className="results-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="term-session-selector">
          <select
            value={currentSession}
            onChange={(e) => setCurrentSession(e.target.value)}
            className="session-select"
          >
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2022/2023">2022/2023</option>
          </select>

          <select
            value={currentTerm}
            onChange={(e) => setCurrentTerm(e.target.value)}
            className="term-select"
          >
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </div>
      </div>

      <div className="results-content">
        {/* Student List */}
        <div className="student-list">
          <h3>Registered Students</h3>
          <div className="students-grid">
            {filteredStudents.map(student => (
              <div
                key={student.id}
                className={`student-card ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="student-avatar">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
                <div className="student-info">
                  <h4>{student.firstName} {student.lastName}</h4>
                  <p className="admission-number">{student.admissionNumber}</p>
                  <p className="class-info">{student.class} - {student.stream}</p>
                  <p className="subjects-count">{student.assignedSubjects.length} subjects</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Entry */}
        {selectedStudent && (
          <div className="results-entry">
            <div className="student-details">
              <div className="student-header">
                <h2>{selectedStudent.firstName} {selectedStudent.lastName} {selectedStudent.middleName}</h2>
                <p>{selectedStudent.admissionNumber} | {selectedStudent.class} ({selectedStudent.stream})</p>
                <p>{currentSession} - {currentTerm}</p>
              </div>

              <div className="action-buttons">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-edit"
                  >
                    Edit Results
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button
                      onClick={handleSaveResults}
                      disabled={isSaving}
                      className="btn-save"
                    >
                      {isSaving ? 'Saving...' : 'Save Results'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results Table */}
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>1st Assessment (20%)</th>
                    <th>2nd Assessment (20%)</th>
                    <th>Exam (60%)</th>
                    <th>Total (100%)</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.assignedSubjects.map(subject => (
                    <tr key={subject}>
                      <td className="subject-name">{subject}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={results[subject]?.firstAssessment || ''}
                            onChange={(e) => handleResultChange(subject, 'firstAssessment', e.target.value)}
                            className="score-input"
                          />
                        ) : (
                          <span className="score-display">{results[subject]?.firstAssessment || '-'}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={results[subject]?.secondAssessment || ''}
                            onChange={(e) => handleResultChange(subject, 'secondAssessment', e.target.value)}
                            className="score-input"
                          />
                        ) : (
                          <span className="score-display">{results[subject]?.secondAssessment || '-'}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="60"
                            step="0.1"
                            value={results[subject]?.exam || ''}
                            onChange={(e) => handleResultChange(subject, 'exam', e.target.value)}
                            className="score-input"
                          />
                        ) : (
                          <span className="score-display">{results[subject]?.exam || '-'}</span>
                        )}
                      </td>
                      <td>
                        <span className={`total-score ${results[subject]?.total ? 'calculated' : ''}`}>
                          {results[subject]?.total || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`grade grade-${results[subject]?.grade?.toLowerCase() || 'empty'}`}>
                          {results[subject]?.grade || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`remarks ${results[subject]?.remarks?.toLowerCase().replace(' ', '-') || ''}`}>
                          {results[subject]?.remarks || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="results-statistics">
                <h3>Performance Summary</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Average Score</h4>
                    <p className="stat-value">{statistics.average}%</p>
                  </div>
                  <div className="stat-card">
                    <h4>Total Subjects</h4>
                    <p className="stat-value">{statistics.totalSubjects}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Highest Score</h4>
                    <p className="stat-value">{statistics.highestScore}%</p>
                  </div>
                  <div className="stat-card">
                    <h4>Lowest Score</h4>
                    <p className="stat-value">{statistics.lowestScore}%</p>
                  </div>
                </div>

                <div className="grade-distribution">
                  <h4>Grade Distribution</h4>
                  <div className="grade-bars">
                    {Object.entries(statistics.gradeCounts).map(([grade, count]) => (
                      <div key={grade} className="grade-bar-item">
                        <span className="grade-label">{grade}:</span>
                        <div className="grade-bar">
                          <div 
                            className={`grade-fill grade-${grade.toLowerCase()}`}
                            style={{ width: `${(count / statistics.totalSubjects) * 100}%` }}
                          ></div>
                        </div>
                        <span className="grade-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResults;
