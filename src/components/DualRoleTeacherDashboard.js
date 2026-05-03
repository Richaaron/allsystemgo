import React, { useState, useEffect } from 'react';
import { TeacherAssignmentService, TEACHER_ROLES, TEACHER_ROLE_DESCRIPTIONS } from '../data/teacherModels';
import { NIGERIAN_GRADING_SCALE } from '../data/models';
import './DualRoleTeacherDashboard.css';

const DualRoleTeacherDashboard = ({ teacherId }) => {
  const [teacher, setTeacher] = useState(null);
  const [assignedClass, setAssignedClass] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [subjectStudents, setSubjectStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeView, setActiveView] = useState('class'); // 'class' or 'subject'
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
      class: 'JSS 2B',
      stream: null,
      assignedSubjects: ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
      attendance: { present: 85, absent: 5, late: 2, total: 92 },
      fees: { tuition: 45000, paid: 45000, balance: 0, status: 'paid' },
      results: {
        'First Term': { average: 87.5, position: 2, totalSubjects: 13 },
        'Second Term': { average: 89.2, position: 1, totalSubjects: 13 },
        'Third Term': { average: 91.8, position: 1, totalSubjects: 13 }
      }
    },
    {
      id: 2,
      admissionNumber: 'FVS/2024/0002',
      firstName: 'Fatima',
      lastName: 'Abubakar',
      middleName: 'Aisha',
      class: 'JSS 2B',
      stream: null,
      assignedSubjects: ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
      attendance: { present: 88, absent: 3, late: 1, total: 92 },
      fees: { tuition: 45000, paid: 30000, balance: 15000, status: 'partial' },
      results: {
        'First Term': { average: 82.3, position: 5, totalSubjects: 13 },
        'Second Term': { average: 85.1, position: 4, totalSubjects: 13 },
        'Third Term': { average: 87.9, position: 3, totalSubjects: 13 }
      }
    },
    {
      id: 3,
      admissionNumber: 'FVS/2024/0003',
      firstName: 'Chukwu',
      lastName: 'Okonkwo',
      middleName: 'Emeka',
      class: 'JSS 2B',
      stream: null,
      assignedSubjects: ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
      attendance: { present: 90, absent: 2, late: 0, total: 92 },
      fees: { tuition: 45000, paid: 45000, balance: 0, status: 'paid' },
      results: {
        'First Term': { average: 79.8, position: 8, totalSubjects: 13 },
        'Second Term': { average: 83.4, position: 6, totalSubjects: 13 },
        'Third Term': { average: 86.2, position: 5, totalSubjects: 13 }
      }
    },
    {
      id: 4,
      admissionNumber: 'FVS/2024/0004',
      firstName: 'Mariam',
      lastName: 'Ibrahim',
      middleName: 'Fatima',
      class: 'JSS 2B',
      stream: null,
      assignedSubjects: ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
      attendance: { present: 87, absent: 4, late: 1, total: 92 },
      fees: { tuition: 45000, paid: 45000, balance: 0, status: 'paid' },
      results: {
        'First Term': { average: 85.6, position: 3, totalSubjects: 13 },
        'Second Term': { average: 87.8, position: 2, totalSubjects: 13 },
        'Third Term': { average: 90.1, position: 2, totalSubjects: 13 }
      }
    },
    {
      id: 5,
      admissionNumber: 'FVS/2024/0005',
      firstName: 'Yusuf',
      lastName: 'Mohammed',
      middleName: 'Abdullahi',
      class: 'JSS 2B',
      stream: null,
      assignedSubjects: ['English Language', 'Mathematics', 'National Values', 'Business Studies', 'Home Economics', 'Physical & Health Education', 'Agricultural Science', 'Basic Science', 'Basic Technology', 'Fine Arts', 'Religious Studies', 'Computer Studies', 'Hausa'],
      attendance: { present: 82, absent: 7, late: 3, total: 92 },
      fees: { tuition: 45000, paid: 20000, balance: 25000, status: 'partial' },
      results: {
        'First Term': { average: 76.4, position: 12, totalSubjects: 13 },
        'Second Term': { average: 78.9, position: 10, totalSubjects: 13 },
        'Third Term': { average: 81.5, position: 8, totalSubjects: 13 }
      }
    },
    {
      id: 6,
      admissionNumber: 'FVS/2024/0006',
      firstName: 'Grace',
      lastName: 'Johnson',
      middleName: 'Chioma',
      class: 'SSS 1A',
      stream: 'Science',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Economics', 'ICT'],
      attendance: { present: 91, absent: 1, late: 0, total: 92 },
      fees: { tuition: 45000, paid: 45000, balance: 0, status: 'paid' },
      results: {
        'First Term': { average: 88.3, position: 3, totalSubjects: 7 },
        'Second Term': { average: 90.1, position: 2, totalSubjects: 7 },
        'Third Term': { average: 92.5, position: 1, totalSubjects: 7 }
      }
    },
    {
      id: 7,
      admissionNumber: 'FVS/2024/0007',
      firstName: 'David',
      lastName: 'Yusuf',
      middleName: 'Michael',
      class: 'SSS 1A',
      stream: 'Commercial',
      assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Account', 'Commerce', 'Marketing', 'ICT'],
      attendance: { present: 89, absent: 2, late: 1, total: 92 },
      fees: { tuition: 45000, paid: 45000, balance: 0, status: 'paid' },
      results: {
        'First Term': { average: 84.7, position: 6, totalSubjects: 7 },
        'Second Term': { average: 86.9, position: 4, totalSubjects: 7 },
        'Third Term': { average: 89.2, position: 3, totalSubjects: 7 }
      }
    }
  ]);

  useEffect(() => {
    // Get teacher information
    const teacherData = TeacherAssignmentService.getTeacherById(teacherId);
    setTeacher(teacherData);
    
    if (teacherData) {
      // Set class assignment
      if (teacherData.assignedClass) {
        setAssignedClass(teacherData.assignedClass);
        const classStudents = allStudents.filter(student => 
          student.class === teacherData.assignedClass
        );
        setClassStudents(classStudents);
      }
      
      // Set subject assignments
      if (teacherData.assignedSubjects && teacherData.assignedSubjects.length > 0) {
        setAssignedSubjects(teacherData.assignedSubjects);
        setSelectedSubject(teacherData.assignedSubjects[0]);
        
        // Get students taking assigned subjects
        const students = TeacherAssignmentService.getStudentsForTeacher(teacherId, allStudents);
        setSubjectStudents(students);
      }
    }
  }, [teacherId, allStudents]);

  // Filter students based on active view
  const getFilteredStudents = () => {
    let students = activeView === 'class' ? classStudents : subjectStudents;
    
    if (activeView === 'subject' && selectedSubject) {
      students = students.filter(student => student.assignedSubjects.includes(selectedSubject));
    }
    
    return students.filter(student =>
      `${student.firstName} ${student.lastName} ${student.admissionNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredStudents = getFilteredStudents();

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
      const resultData = {
        teacherId: teacherId,
        subject: selectedSubject,
        term: selectedTerm,
        session: selectedSession,
        results: results,
        savedAt: new Date().toISOString()
      };
      
      console.log('Saving subject results:', resultData);
      
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

  // Calculate comprehensive statistics
  const calculateComprehensiveStatistics = () => {
    const classStats = {
      totalStudents: classStudents.length,
      averageAttendance: 0,
      feeStatus: { paid: 0, partial: 0, unpaid: 0 },
      averagePerformance: 0
    };

    let totalAttendance = 0;
    let totalPerformance = 0;
    
    classStudents.forEach(student => {
      const attendancePercentage = (student.attendance.present / student.attendance.total) * 100;
      totalAttendance += attendancePercentage;
      classStats.feeStatus[student.fees.status]++;
      
      const termResults = student.results[selectedTerm];
      if (termResults) {
        totalPerformance += termResults.average;
      }
    });
    
    classStats.averageAttendance = (totalAttendance / classStudents.length).toFixed(1);
    classStats.averagePerformance = (totalPerformance / classStudents.length).toFixed(1);

    // Subject statistics
    const subjectStats = {};
    assignedSubjects.forEach(subject => {
      const subjectStudents = allStudents.filter(student => 
        student.assignedSubjects.includes(subject)
      );
      
      subjectStats[subject] = {
        totalStudents: subjectStudents.length,
        averagePerformance: 0
      };
    });

    return {
      class: classStats,
      subjects: subjectStats
    };
  };

  const comprehensiveStats = calculateComprehensiveStatistics();

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  if (!teacher) {
    return <div className="loading">Loading teacher information...</div>;
  }

  return (
    <div className="dual-role-dashboard">
      <div className="dashboard-header">
        <div className="teacher-info">
          <h1>Dual Role Teacher Dashboard</h1>
          <p>{teacher.firstName} {teacher.lastName}</p>
          <div className="role-badges">
            <span className="role-badge form-teacher">Form Teacher: {teacher.assignedClass}</span>
            <span className="role-badge subject-teacher">Subject Teacher: {teacher.assignedSubjects.join(', ')}</span>
          </div>
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

      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={`view-btn ${activeView === 'class' ? 'active' : ''}`}
          onClick={() => setActiveView('class')}
        >
          <span className="view-icon">👥</span>
          Form Teacher View
        </button>
        <button
          className={`view-btn ${activeView === 'subject' ? 'active' : ''}`}
          onClick={() => setActiveView('subject')}
        >
          <span className="view-icon">📚</span>
          Subject Teacher View
        </button>
      </div>

      {/* Subject Selection (only for subject view) */}
      {activeView === 'subject' && (
        <div className="subject-selection">
          <h3>Select Subject</h3>
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
      )}

      {/* Comprehensive Statistics */}
      {comprehensiveStats && (
        <div className="comprehensive-statistics">
          <h2>Overview - {selectedTerm} {selectedSession}</h2>
          
          {activeView === 'class' && (
            <div className="class-overview">
              <h3>Class Management - {assignedClass}</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Students</h4>
                  <p className="stat-value">{comprehensiveStats.class.totalStudents}</p>
                </div>
                <div className="stat-card">
                  <h4>Average Attendance</h4>
                  <p className="stat-value">{comprehensiveStats.class.averageAttendance}%</p>
                </div>
                <div className="stat-card">
                  <h4>Average Performance</h4>
                  <p className="stat-value">{comprehensiveStats.class.averagePerformance}%</p>
                </div>
                <div className="stat-card">
                  <h4>Fee Compliance</h4>
                  <p className="stat-value">
                    {Math.round((comprehensiveStats.class.feeStatus.paid / comprehensiveStats.class.totalStudents) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeView === 'subject' && (
            <div className="subject-overview">
              <h3>Subject Teaching - {selectedSubject}</h3>
              <div className="subject-stats">
                {Object.entries(comprehensiveStats.subjects).map(([subject, stats]) => (
                  <div key={subject} className={`subject-stat ${subject === selectedSubject ? 'active' : ''}`}>
                    <h4>{subject}</h4>
                    <p>{stats.totalStudents} students</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === 'communication' ? 'active' : ''}`}
          onClick={() => setActiveTab('communication')}
        >
          Communication
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-section">
                <h3>Class Responsibilities</h3>
                <div className="responsibility-cards">
                  <div className="responsibility-card">
                    <h4>Student Management</h4>
                        <p>Manage {comprehensiveStats.class.totalStudents} students in {assignedClass}</p>
                    <div className="responsibility-stats">
                      <span>Attendance: {comprehensiveStats.class.averageAttendance}%</span>
                      <span>Performance: {comprehensiveStats.class.averagePerformance}%</span>
                    </div>
                  </div>
                  <div className="responsibility-card">
                    <h4>Fee Monitoring</h4>
                    <p>Track fee status for all class students</p>
                    <div className="responsibility-stats">
                      <span>Paid: {comprehensiveStats.class.feeStatus.paid}</span>
                      <span>Partial: {comprehensiveStats.class.feeStatus.partial}</span>
                      <span>Unpaid: {comprehensiveStats.class.feeStatus.unpaid}</span>
                    </div>
                  </div>
                  <div className="responsibility-card">
                    <h4>Discipline & Conduct</h4>
                    <p>Maintain discipline records and behavior tracking</p>
                    <div className="responsibility-stats">
                      <span>Excellent: 12</span>
                      <span>Good: 8</span>
                      <span>Needs Improvement: 3</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-section">
                <h3>Subject Responsibilities</h3>
                <div className="responsibility-cards">
                  {assignedSubjects.map(subject => {
                    const stats = comprehensiveStats.subjects[subject];
                    return (
                      <div key={subject} className="responsibility-card">
                        <h4>{subject}</h4>
                        <p>Teaching {stats.totalStudents} students across multiple classes</p>
                        <div className="responsibility-stats">
                          <span>Classes: 2</span>
                          <span>Performance: 85.2%</span>
                          <span>Pass Rate: 92%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="students-tab">
            <div className="tab-header">
              <h3>
                {activeView === 'class' ? `Class Students - ${assignedClass}` : `Students Taking ${selectedSubject}`}
              </h3>
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
                const termResults = student.results[selectedTerm];
                
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
                      <p className="class-info">
                        {student.class} {student.stream ? `(${student.stream})` : ''}
                      </p>
                      <div className="student-metrics">
                        <div className="metric">
                          <span className="metric-label">Attendance:</span>
                          <span className="metric-value">
                            {Math.round(attendancePercentage)}%
                          </span>
                        </div>
                        {termResults && (
                          <div className="metric">
                            <span className="metric-label">Average:</span>
                            <span className="metric-value">{termResults.average}%</span>
                          </div>
                        )}
                        {studentResult && studentResult.total && (
                          <div className="metric">
                            <span className="metric-label">Subject:</span>
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
                      <span className={`fee-status ${student.fees.status}`}>
                        {student.fees.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-tab">
            {activeView === 'class' ? (
              <div className="class-results">
                <h3>Class Results Overview</h3>
                <div className="class-results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Admission No.</th>
                        <th>Class Average</th>
                        <th>Position</th>
                        <th>Total Subjects</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => {
                        const termResults = student.results[selectedTerm];
                        return (
                          <tr key={student.id}>
                            <td>{student.firstName} {student.lastName}</td>
                            <td>{student.admissionNumber}</td>
                            <td style={{ fontWeight: '600', color: '#10b981' }}>
                              {termResults?.average || '-'}%
                            </td>
                            <td>{termResults?.position || '-'}</td>
                            <td>{termResults?.totalSubjects || '-'}</td>
                            <td>
                              <span className="trend-indicator up">↑</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="subject-results">
                <div className="tab-header">
                  <h3>Subject Results - {selectedSubject}</h3>
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
                            <td>{student.firstName} {student.lastName}</td>
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
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-tab">
            <h3>Attendance Management</h3>
            <div className="attendance-summary">
              <div className="attendance-cards">
                <div className="attendance-card">
                  <h4>Class Attendance</h4>
                  <p>{comprehensiveStats.class.averageAttendance}% average</p>
                </div>
                <div className="attendance-card">
                  <h4>Subject Attendance</h4>
                  <p>87.3% average across all subjects</p>
                </div>
              </div>
            </div>

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

        {activeTab === 'communication' && (
          <div className="communication-tab">
            <h3>Parent Communication</h3>
            <div className="communication-tools">
              <div className="communication-card">
                <h4>Send Class Announcement</h4>
                <textarea placeholder="Type your message to all class parents..." rows="4"></textarea>
                <button className="btn-send">Send to All Parents</button>
              </div>
              <div className="communication-card">
                <h4>Individual Parent Contact</h4>
                <select>
                  <option>Select Student</option>
                  {filteredStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
                <textarea placeholder="Type your message to the parent..." rows="4"></textarea>
                <button className="btn-send">Send Message</button>
              </div>
            </div>
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
                  <h5>Academic Performance</h5>
                  <div className="performance-info">
                    <p>Class Average: {selectedStudent.results[selectedTerm]?.average || '-'}%</p>
                    <p>Position: {selectedStudent.results[selectedTerm]?.position || '-'}</p>
                    {activeView === 'subject' && results[selectedStudent.id] && (
                      <>
                        <p>Subject Score: {results[selectedStudent.id].total || 'Not entered'}%</p>
                        <p>Subject Grade: {results[selectedStudent.id].grade || 'Not graded'}</p>
                      </>
                    )}
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
                  <h5>Attendance & Fees</h5>
                  <div className="attendance-fee-info">
                    <div className="attendance-item">
                      <span>Attendance:</span>
                      <span>{Math.round((selectedStudent.attendance.present / selectedStudent.attendance.total) * 100)}%</span>
                    </div>
                    <div className="attendance-item">
                      <span>Fee Status:</span>
                      <span className={`fee-status ${selectedStudent.fees.status}`}>
                        {selectedStudent.fees.status}
                      </span>
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

export default DualRoleTeacherDashboard;
