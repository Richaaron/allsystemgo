import React, { useState, useEffect } from 'react';
import { TeacherAssignmentService, TEACHER_ROLES, TEACHER_ROLE_DESCRIPTIONS } from '../data/teacherModels';
import { NIGERIAN_GRADING_SCALE } from '../data/models';
import './SubjectTeacherDashboard.css';

const SubjectTeacherDashboard = ({ teacherId }) => {
  const [teacher, setTeacher] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [subjectStudents, setSubjectStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [isEditingResults, setIsEditingResults] = useState(false);
  const [results, setResults] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Mock students data
  const [allStudents] = useState([
    {
      id: 1,
      admissionNumber: 'FVS/2024/0001',
      firstName: 'Ahmed',
      lastName: 'Bello',
      middleName: 'Musa',
      class: 'SSS 1A',
      stream: 'Science',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Economics', 'ICT'],
      attendance: { present: 85, absent: 5, late: 2, total: 92 }
    },
    {
      id: 2,
      admissionNumber: 'FVS/2024/0002',
      firstName: 'Fatima',
      lastName: 'Abubakar',
      middleName: 'Aisha',
      class: 'SSS 1A',
      stream: 'Art',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Government', 'Literature in English', 'Economics', 'Religious Studies'],
      attendance: { present: 88, absent: 3, late: 1, total: 92 }
    },
    {
      id: 3,
      admissionNumber: 'FVS/2024/0003',
      firstName: 'Chukwu',
      lastName: 'Okonkwo',
      middleName: 'Emeka',
      class: 'SSS 1A',
      stream: 'Commercial',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Account', 'Commerce', 'Marketing', 'ICT'],
      attendance: { present: 90, absent: 2, late: 0, total: 92 }
    },
    {
      id: 4,
      admissionNumber: 'FVS/2024/0004',
      firstName: 'Mariam',
      lastName: 'Ibrahim',
      middleName: 'Fatima',
      class: 'SSS 1A',
      stream: 'Science',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Economics', 'ICT'],
      attendance: { present: 87, absent: 4, late: 1, total: 92 }
    },
    {
      id: 5,
      admissionNumber: 'FVS/2024/0005',
      firstName: 'Yusuf',
      lastName: 'Mohammed',
      middleName: 'Abdullahi',
      class: 'SSS 1A',
      stream: 'Art',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Government', 'Literature in English', 'Economics', 'Religious Studies'],
      attendance: { present: 82, absent: 7, late: 3, total: 92 }
    },
    {
      id: 6,
      admissionNumber: 'FVS/2024/0006',
      firstName: 'Grace',
      lastName: 'Johnson',
      middleName: 'Chioma',
      class: 'SSS 2B',
      stream: 'Science',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Economics', 'ICT'],
      attendance: { present: 91, absent: 1, late: 0, total: 92 }
    },
    {
      id: 7,
      admissionNumber: 'FVS/2024/0007',
      firstName: 'David',
      lastName: 'Yusuf',
      middleName: 'Michael',
      class: 'SSS 2B',
      stream: 'Commercial',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Account', 'Commerce', 'Marketing', 'ICT'],
      attendance: { present: 89, absent: 2, late: 1, total: 92 }
    },
    {
      id: 8,
      admissionNumber: 'FVS/2024/0008',
      firstName: 'Aisha',
      lastName: 'Bello',
      middleName: 'Ruth',
      class: 'JSS 2A',
      stream: null,
      assignedSubjects: ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
      attendance: { present: 86, absent: 4, late: 2, total: 92 }
    }
  ]);

  useEffect(() => {
    // Get teacher information
    const teacherData = TeacherAssignmentService.getTeacherById(teacherId);
    setTeacher(teacherData);
    
    if (teacherData && teacherData.assignedSubjects) {
      setAssignedSubjects(teacherData.assignedSubjects);
      
      // Set default selected subject
      if (teacherData.assignedSubjects.length > 0) {
        setSelectedSubject(teacherData.assignedSubjects[0]);
      }
      
      // Get students taking assigned subjects
      const students = TeacherAssignmentService.getStudentsForTeacher(teacherId, allStudents);
      setSubjectStudents(students);
    }
  }, [teacherId, allStudents]);

  // Filter students based on selected subject
  const filteredStudents = subjectStudents.filter(student =>
    student.assignedSubjects.includes(selectedSubject) &&
    `${student.firstName} ${student.lastName} ${student.admissionNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize results for selected subject
  useEffect(() => {
    if (selectedSubject && filteredStudents.length > 0) {
      const initialResults = {};
      filteredStudents.forEach(student => {
        initialResults[student.id] = {
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
  }, [selectedSubject, filteredStudents]);

  // Calculate result for a student
  const calculateStudentResult = (studentId, fieldType, value) => {
    const updatedResults = { ...results };
    if (!updatedResults[studentId]) {
      updatedResults[studentId] = {
        firstAssessment: '',
        secondAssessment: '',
        exam: '',
        total: '',
        grade: '',
        remarks: ''
      };
    }
    
    updatedResults[studentId][fieldType] = value;

    // Calculate total if all fields have values
    const firstAssessment = parseFloat(updatedResults[studentId].firstAssessment) || 0;
    const secondAssessment = parseFloat(updatedResults[studentId].secondAssessment) || 0;
    const exam = parseFloat(updatedResults[studentId].exam) || 0;
    
    const total = firstAssessment + secondAssessment + exam;
    updatedResults[studentId].total = total.toFixed(1);

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

    updatedResults[studentId].grade = grade;
    updatedResults[studentId].remarks = remarks;

    setResults(updatedResults);
  };

  // Handle result input changes
  const handleResultChange = (studentId, fieldType, value) => {
    // Validate input
    if (value !== '' && (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100)) {
      return;
    }
    
    // Set max limits based on field type
    const maxValue = fieldType === 'exam' ? 60 : 20;
    if (value !== '' && parseFloat(value) > maxValue) {
      return;
    }
    
    calculateStudentResult(studentId, fieldType, value);
  };

  // Save results
  const handleSaveResults = async () => {
    setIsSaving(true);
    try {
      // Here you would normally save to database
      const resultData = {
        teacherId: teacherId,
        subject: selectedSubject,
        term: selectedTerm,
        session: selectedSession,
        results: results,
        savedAt: new Date().toISOString()
      };
      
      console.log('Saving subject results:', resultData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Results for ${selectedSubject} saved successfully!`);
      setIsEditingResults(false);
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error saving results. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate subject statistics
  const calculateSubjectStatistics = () => {
    if (!selectedSubject || filteredStudents.length === 0) return null;
    
    const validResults = Object.values(results).filter(result => result.total !== '');
    
    if (validResults.length === 0) return null;
    
    const totals = validResults.map(result => parseFloat(result.total));
    const totalScore = totals.reduce((sum, score) => sum + score, 0);
    const average = (totalScore / validResults.length).toFixed(1);
    
    const gradeCounts = {};
    validResults.forEach(result => {
      const grade = result.grade;
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
    
    const highestScore = Math.max(...totals);
    const lowestScore = Math.min(...totals);
    
    return {
      average,
      totalStudents: validResults.length,
      highestScore,
      lowestScore,
      gradeCounts,
      passRate: Math.round((validResults.filter(result => parseFloat(result.total) >= 40).length / validResults.length) * 100)
    };
  };

  const subjectStatistics = calculateSubjectStatistics();

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  if (!teacher) {
    return <div className="loading">Loading teacher information...</div>;
  }

  return (
    <div className="subject-teacher-dashboard">
      <div className="dashboard-header">
        <div className="teacher-info">
          <h1>Subject Teacher Dashboard</h1>
          <p>{teacher.firstName} {teacher.lastName} - {teacher.assignedSubjects.join(', ')}</p>
        </div>
        <div className="term-session-selector">
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="session-select"
          >
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2022/2023">2022/2023</option>
          </select>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="term-select"
          >
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="subject-selection">
        <h2>Assigned Subjects</h2>
        <div className="subject-tabs">
          {assignedSubjects.map(subject => (
            <button
              key={subject}
              className={`subject-tab ${selectedSubject === subject ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Statistics */}
      {subjectStatistics && (
        <div className="subject-statistics">
          <h3>{selectedSubject} Performance - {selectedTerm} {selectedSession}</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Students</h4>
              <p className="stat-value">{subjectStatistics.totalStudents}</p>
            </div>
            <div className="stat-card">
              <h4>Average Score</h4>
              <p className="stat-value">{subjectStatistics.average}%</p>
            </div>
            <div className="stat-card">
              <h4>Highest Score</h4>
              <p className="stat-value">{subjectStatistics.highestScore}%</p>
            </div>
            <div className="stat-card">
              <h4>Pass Rate</h4>
              <p className="stat-value">{subjectStatistics.passRate}%</p>
            </div>
          </div>

          <div className="grade-distribution">
            <h4>Grade Distribution</h4>
            <div className="grade-bars">
              {Object.entries(subjectStatistics.gradeCounts).map(([grade, count]) => (
                <div key={grade} className="grade-bar-item">
                  <span className="grade-label">{grade}:</span>
                  <div className="grade-bar">
                    <div 
                      className={`grade-fill grade-${grade.toLowerCase()}`}
                      style={{ width: `${(count / subjectStatistics.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="grade-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Subject Students
        </button>
        <button
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Result Entry
        </button>
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance Analysis
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'students' && (
          <div className="students-tab">
            <div className="tab-header">
              <h3>Students Taking {selectedSubject}</h3>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="students-grid">
              {filteredStudents.map(student => {
                const attendancePercentage = (student.attendance.present / student.attendance.total) * 100;
                const studentResult = results[student.id];
                
                return (
                  <div
                    key={student.id}
                    className="student-card"
                    onClick={() => handleStudentClick(student)}
                  >
                    <div className="student-avatar">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div className="student-info">
                      <h4>{student.firstName} {student.lastName}</h4>
                      <p className="admission-number">{student.admissionNumber}</p>
                      <p className="class-info">{student.class} {student.stream ? `(${student.stream})` : ''}</p>
                      <div className="student-metrics">
                        <div className="metric">
                          <span className="metric-label">Attendance:</span>
                          <span className="metric-value">
                            {Math.round(attendancePercentage)}%
                          </span>
                        </div>
                        {studentResult && studentResult.total && (
                          <div className="metric">
                            <span className="metric-label">Score:</span>
                            <span className="metric-value">{studentResult.total}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="status-indicators">
                      {studentResult && studentResult.grade && (
                        <span className={`grade-badge grade-${studentResult.grade.toLowerCase()}`}>
                          {studentResult.grade}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-tab">
            <div className="tab-header">
              <h3>Result Entry - {selectedSubject}</h3>
              <div className="result-actions">
                {!isEditingResults ? (
                  <button
                    onClick={() => setIsEditingResults(true)}
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
                      onClick={() => setIsEditingResults(false)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission No.</th>
                    <th>Class</th>
                    <th>1st Assessment (20%)</th>
                    <th>2nd Assessment (20%)</th>
                    <th>Exam (60%)</th>
                    <th>Total (100%)</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const studentResult = results[student.id] || {};
                    return (
                      <tr key={student.id}>
                        <td className="student-name">
                          <div className="student-cell">
                            <div className="student-avatar-small">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </div>
                            <span>{student.firstName} {student.lastName}</span>
                          </div>
                        </td>
                        <td>{student.admissionNumber}</td>
                        <td>{student.class}</td>
                        <td>
                          {isEditingResults ? (
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={studentResult.firstAssessment || ''}
                              onChange={(e) => handleResultChange(student.id, 'firstAssessment', e.target.value)}
                              className="score-input"
                            />
                          ) : (
                            <span className="score-display">{studentResult.firstAssessment || '-'}</span>
                          )}
                        </td>
                        <td>
                          {isEditingResults ? (
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={studentResult.secondAssessment || ''}
                              onChange={(e) => handleResultChange(student.id, 'secondAssessment', e.target.value)}
                              className="score-input"
                            />
                          ) : (
                            <span className="score-display">{studentResult.secondAssessment || '-'}</span>
                          )}
                        </td>
                        <td>
                          {isEditingResults ? (
                            <input
                              type="number"
                              min="0"
                              max="60"
                              step="0.1"
                              value={studentResult.exam || ''}
                              onChange={(e) => handleResultChange(student.id, 'exam', e.target.value)}
                              className="score-input"
                            />
                          ) : (
                            <span className="score-display">{studentResult.exam || '-'}</span>
                          )}
                        </td>
                        <td>
                          <span className={`total-score ${studentResult.total ? 'calculated' : ''}`}>
                            {studentResult.total || '-'}
                          </span>
                        </td>
                        <td>
                          <span className={`grade grade-${studentResult.grade?.toLowerCase() || 'empty'}`}>
                            {studentResult.grade || '-'}
                          </span>
                        </td>
                        <td>
                          <span className={`remarks ${studentResult.remarks?.toLowerCase().replace(' ', '-') || ''}`}>
                            {studentResult.remarks || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-tab">
            <h3>Subject Attendance - {selectedSubject}</h3>
            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission No.</th>
                    <th>Class</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Total</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const percentage = (student.attendance.present / student.attendance.total) * 100;
                    return (
                      <tr key={student.id}>
                        <td>{student.firstName} {student.lastName}</td>
                        <td>{student.admissionNumber}</td>
                        <td>{student.class}</td>
                        <td>{student.attendance.present}</td>
                        <td>{student.attendance.absent}</td>
                        <td>{student.attendance.late}</td>
                        <td>{student.attendance.total}</td>
                        <td style={{ fontWeight: '600', color: percentage >= 75 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444' }}>
                          {percentage.toFixed(1)}%
                        </td>
                        <td>
                          <span className={`attendance-badge ${percentage >= 75 ? 'good' : percentage >= 60 ? 'fair' : 'poor'}`}>
                            {percentage >= 75 ? 'Good' : percentage >= 60 ? 'Fair' : 'Poor'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-tab">
            <h3>Performance Analysis - {selectedSubject}</h3>
            
            {subjectStatistics ? (
              <div className="performance-analysis">
                <div className="performance-summary">
                  <div className="summary-cards">
                    <div className="summary-card">
                      <h4>Class Average</h4>
                      <p className="summary-value">{subjectStatistics.average}%</p>
                      <p className="summary-trend">↑ 2.3% from last term</p>
                    </div>
                    <div className="summary-card">
                      <h4>Pass Rate</h4>
                      <p className="summary-value">{subjectStatistics.passRate}%</p>
                      <p className="summary-trend">↑ 1.5% from last term</p>
                    </div>
                    <div className="summary-card">
                      <h4>Performance Range</h4>
                      <p className="summary-value">{subjectStatistics.lowestScore}% - {subjectStatistics.highestScore}%</p>
                      <p className="summary-trend">Range: {subjectStatistics.highestScore - subjectStatistics.lowestScore}%</p>
                    </div>
                    <div className="summary-card">
                      <h4>Grade Distribution</h4>
                      <div className="mini-grade-distribution">
                        {Object.entries(subjectStatistics.gradeCounts).map(([grade, count]) => (
                          <span key={grade} className={`mini-grade-badge grade-${grade.toLowerCase()}`}>
                            {grade}: {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="performance-details">
                  <div className="performance-chart">
                    <h4>Score Distribution</h4>
                    <div className="score-ranges">
                      <div className="score-range">
                        <span className="range-label">70-100% (A):</span>
                        <div className="range-bar">
                          <div 
                            className="range-fill a-range"
                            style={{ width: `${((subjectStatistics.gradeCounts.A || 0) / subjectStatistics.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="range-count">{subjectStatistics.gradeCounts.A || 0}</span>
                      </div>
                      <div className="score-range">
                        <span className="range-label">60-69% (B):</span>
                        <div className="range-bar">
                          <div 
                            className="range-fill b-range"
                            style={{ width: `${((subjectStatistics.gradeCounts.B || 0) / subjectStatistics.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="range-count">{subjectStatistics.gradeCounts.B || 0}</span>
                      </div>
                      <div className="score-range">
                        <span className="range-label">50-59% (C):</span>
                        <div className="range-bar">
                          <div 
                            className="range-fill c-range"
                            style={{ width: `${((subjectStatistics.gradeCounts.C || 0) / subjectStatistics.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="range-count">{subjectStatistics.gradeCounts.C || 0}</span>
                      </div>
                      <div className="score-range">
                        <span className="range-label">45-49% (D):</span>
                        <div className="range-bar">
                          <div 
                            className="range-fill d-range"
                            style={{ width: `${((subjectStatistics.gradeCounts.D || 0) / subjectStatistics.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="range-count">{subjectStatistics.gradeCounts.D || 0}</span>
                      </div>
                      <div className="score-range">
                        <span className="range-label">40-44% (E):</span>
                        <div className="range-bar">
                          <div 
                            className="range-fill e-range"
                            style={{ width: `${((subjectStatistics.gradeCounts.E || 0) / subjectStatistics.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="range-count">{subjectStatistics.gradeCounts.E || 0}</span>
                      </div>
                      <div className="score-range">
                        <span className="range-label">Below 40% (F):</span>
                        <div className="range-bar">
                          <div 
                            className="range-fill f-range"
                            style={{ width: `${((subjectStatistics.gradeCounts.F || 0) / subjectStatistics.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="range-count">{subjectStatistics.gradeCounts.F || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="recommendations">
                    <h4>Teaching Recommendations</h4>
                    <div className="recommendation-list">
                      <div className="recommendation-item">
                        <span className="recommendation-icon">💡</span>
                        <span>Focus on students scoring below 50% - provide additional support</span>
                      </div>
                      <div className="recommendation-item">
                        <span className="recommendation-icon">📚</span>
                        <span>Consider revision sessions for complex topics</span>
                      </div>
                      <div className="recommendation-item">
                        <span className="recommendation-icon">🎯</span>
                        <span>Maintain current teaching strategies for high performers</span>
                      </div>
                      <div className="recommendation-item">
                        <span className="recommendation-icon">📊</span>
                        <span>Monitor attendance correlation with performance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No performance data available yet. Enter results to see analysis.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="student-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Student Details</h3>
              <button
                className="close-btn"
                onClick={() => setShowStudentModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="student-basic-info">
                <h4>{selectedStudent.firstName} {selectedStudent.lastName} {selectedStudent.middleName}</h4>
                <p>{selectedStudent.admissionNumber} | {selectedStudent.class} {selectedStudent.stream ? `(${selectedStudent.stream})` : ''}</p>
              </div>
              
              <div className="student-detailed-info">
                <div className="info-section">
                  <h5>Subject Performance</h5>
                  <div className="subject-performance">
                    <p>Current Score: {results[selectedStudent.id]?.total || 'Not entered'}%</p>
                    <p>Grade: {results[selectedStudent.id]?.grade || 'Not graded'}</p>
                    <p>Remarks: {results[selectedStudent.id]?.remarks || 'No remarks'}</p>
                  </div>
                </div>
                
                <div className="info-section">
                  <h5>All Assigned Subjects</h5>
                  <div className="subjects-list">
                    {selectedStudent.assignedSubjects.map(subject => (
                      <span key={subject} className={`subject-badge ${subject === selectedSubject ? 'current' : ''}`}>
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="info-section">
                  <h5>Attendance Summary</h5>
                  <div className="attendance-summary">
                    <div className="attendance-item">
                      <span>Present:</span>
                      <span>{selectedStudent.attendance.present}</span>
                    </div>
                    <div className="attendance-item">
                      <span>Absent:</span>
                      <span>{selectedStudent.attendance.absent}</span>
                    </div>
                    <div className="attendance-item">
                      <span>Late:</span>
                      <span>{selectedStudent.attendance.late}</span>
                    </div>
                    <div className="attendance-item">
                      <span>Percentage:</span>
                      <span>{Math.round((selectedStudent.attendance.present / selectedStudent.attendance.total) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectTeacherDashboard;
