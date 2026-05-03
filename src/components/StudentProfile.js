import React, { useState, useEffect } from 'react';
import { NIGERIAN_GRADING_SCALE } from '../data/models';
import './StudentProfile.css';

const StudentProfile = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentResults, setStudentResults] = useState({});
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('subjects'); // 'subjects' or 'results'

  // Mock student data with assigned subjects
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        admissionNumber: 'FVS/2024/0001',
        firstName: 'Ahmed',
        lastName: 'Bello',
        middleName: 'Musa',
        dateOfBirth: '2008-05-15',
        gender: 'Male',
        class: 'SSS 1A',
        stream: 'Science',
        assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Economics', 'ICT'],
        registrationDate: '2024-09-01',
        status: 'active',
        parentInfo: {
          fatherName: 'Mr. Bello Ibrahim',
          fatherPhone: '+234-801-234-5678',
          motherName: 'Mrs. Aisha Bello',
          motherPhone: '+234-802-345-6789'
        },
        attendance: {
          present: 85,
          absent: 5,
          late: 2,
          total: 92
        },
        fees: {
          tuition: 45000,
          paid: 45000,
          balance: 0,
          status: 'paid'
        }
      },
      {
        id: 2,
        admissionNumber: 'FVS/2024/0002',
        firstName: 'Fatima',
        lastName: 'Abubakar',
        middleName: 'Aisha',
        dateOfBirth: '2007-08-22',
        gender: 'Female',
        class: 'SSS 2B',
        stream: 'Art',
        assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Government', 'Literature in English', 'Economics', 'Religious Studies'],
        registrationDate: '2024-09-01',
        status: 'active',
        parentInfo: {
          fatherName: 'Alhaji Abubakar Muhammad',
          fatherPhone: '+234-803-456-7890',
          motherName: 'Hajara Abubakar',
          motherPhone: '+234-804-567-8901'
        },
        attendance: {
          present: 88,
          absent: 3,
          late: 1,
          total: 92
        },
        fees: {
          tuition: 45000,
          paid: 30000,
          balance: 15000,
          status: 'partial'
        }
      },
      {
        id: 3,
        admissionNumber: 'FVS/2024/0003',
        firstName: 'Chukwu',
        lastName: 'Okonkwo',
        middleName: 'Emeka',
        dateOfBirth: '2006-12-10',
        gender: 'Male',
        class: 'SSS 3C',
        stream: 'Commercial',
        assignedSubjects: ['English Language', 'Mathematics', 'Biology', 'Account', 'Commerce', 'Marketing', 'ICT'],
        registrationDate: '2024-09-01',
        status: 'active',
        parentInfo: {
          fatherName: 'Mr. Okonkwo Chike',
          fatherPhone: '+234-805-678-9012',
          motherName: 'Mrs. Ngozi Okonkwo',
          motherPhone: '+234-806-789-0123'
        },
        attendance: {
          present: 90,
          absent: 2,
          late: 0,
          total: 92
        },
        fees: {
          tuition: 45000,
          paid: 45000,
          balance: 0,
          status: 'paid'
        }
      }
    ];
    setStudents(mockStudents);
  }, []);

  // Mock results data
  useEffect(() => {
    if (selectedStudent) {
      const mockResults = {
        'First Term': {
          'English Language': { firstAssessment: 18, secondAssessment: 17, exam: 52, total: 87, grade: 'A', remarks: 'Excellent' },
          'Mathematics': { firstAssessment: 16, secondAssessment: 15, exam: 48, total: 79, grade: 'B', remarks: 'Very Good' },
          'Biology': { firstAssessment: 19, secondAssessment: 18, exam: 55, total: 92, grade: 'A', remarks: 'Excellent' },
          'Physics': { firstAssessment: 15, secondAssessment: 14, exam: 45, total: 74, grade: 'B', remarks: 'Very Good' },
          'Chemistry': { firstAssessment: 17, secondAssessment: 16, exam: 50, total: 83, grade: 'A', remarks: 'Excellent' },
          'Economics': { firstAssessment: 18, secondAssessment: 17, exam: 53, total: 88, grade: 'A', remarks: 'Excellent' },
          'ICT': { firstAssessment: 20, secondAssessment: 19, exam: 58, total: 97, grade: 'A', remarks: 'Excellent' }
        },
        'Second Term': {
          'English Language': { firstAssessment: 17, secondAssessment: 18, exam: 54, total: 89, grade: 'A', remarks: 'Excellent' },
          'Mathematics': { firstAssessment: 17, secondAssessment: 16, exam: 50, total: 83, grade: 'A', remarks: 'Excellent' },
          'Biology': { firstAssessment: 18, secondAssessment: 19, exam: 56, total: 93, grade: 'A', remarks: 'Excellent' },
          'Physics': { firstAssessment: 16, secondAssessment: 15, exam: 47, total: 78, grade: 'B', remarks: 'Very Good' },
          'Chemistry': { firstAssessment: 18, secondAssessment: 17, exam: 52, total: 87, grade: 'A', remarks: 'Excellent' },
          'Economics': { firstAssessment: 19, secondAssessment: 18, exam: 55, total: 92, grade: 'A', remarks: 'Excellent' },
          'ICT': { firstAssessment: 19, secondAssessment: 20, exam: 59, total: 98, grade: 'A', remarks: 'Excellent' }
        },
        'Third Term': {
          'English Language': { firstAssessment: 18, secondAssessment: 17, exam: 53, total: 88, grade: 'A', remarks: 'Excellent' },
          'Mathematics': { firstAssessment: 18, secondAssessment: 17, exam: 51, total: 86, grade: 'A', remarks: 'Excellent' },
          'Biology': { firstAssessment: 20, secondAssessment: 19, exam: 58, total: 97, grade: 'A', remarks: 'Excellent' },
          'Physics': { firstAssessment: 17, secondAssessment: 16, exam: 49, total: 82, grade: 'A', remarks: 'Excellent' },
          'Chemistry': { firstAssessment: 19, secondAssessment: 18, exam: 54, total: 91, grade: 'A', remarks: 'Excellent' },
          'Economics': { firstAssessment: 18, secondAssessment: 19, exam: 56, total: 93, grade: 'A', remarks: 'Excellent' },
          'ICT': { firstAssessment: 20, secondAssessment: 19, exam: 60, total: 99, grade: 'A', remarks: 'Excellent' }
        }
      };
      setStudentResults(mockResults);
    }
  }, [selectedStudent]);

  // Filter students based on search
  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName} ${student.admissionNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate overall statistics
  const calculateOverallStats = () => {
    if (!selectedStudent || !studentResults[selectedTerm]) return null;
    
    const termResults = studentResults[selectedTerm];
    const subjects = Object.keys(termResults);
    const validResults = subjects.filter(subject => termResults[subject].total);
    
    if (validResults.length === 0) return null;
    
    const totals = validResults.map(subject => termResults[subject].total);
    const totalScore = totals.reduce((sum, score) => sum + score, 0);
    const average = (totalScore / validResults.length).toFixed(1);
    
    const gradeCounts = {};
    validResults.forEach(subject => {
      const grade = termResults[subject].grade;
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
    
    const highestScore = Math.max(...totals);
    const lowestScore = Math.min(...totals);
    
    return {
      average,
      totalSubjects: validResults.length,
      highestScore,
      lowestScore,
      gradeCounts,
      position: 1, // Mock position
      totalStudents: 45 // Mock total students
    };
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="student-profile">
      <div className="profile-header">
        <h1>Student Profile</h1>
        <p>View comprehensive student information and academic performance</p>
      </div>

      <div className="profile-controls">
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

      <div className="profile-content">
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
                  <p className="class-info">{student.class} ({student.stream})</p>
                  <p className="status-badge">{student.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Details */}
        {selectedStudent && (
          <div className="student-details">
            {/* Basic Information */}
            <div className="info-section">
              <h2>Basic Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name:</label>
                  <span>{selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}</span>
                </div>
                <div className="info-item">
                  <label>Admission Number:</label>
                  <span>{selectedStudent.admissionNumber}</span>
                </div>
                <div className="info-item">
                  <label>Date of Birth:</label>
                  <span>{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>Gender:</label>
                  <span>{selectedStudent.gender}</span>
                </div>
                <div className="info-item">
                  <label>Class:</label>
                  <span>{selectedStudent.class}</span>
                </div>
                <div className="info-item">
                  <label>Stream:</label>
                  <span>{selectedStudent.stream}</span>
                </div>
                <div className="info-item">
                  <label>Registration Date:</label>
                  <span>{new Date(selectedStudent.registrationDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedStudent.status}`}>{selectedStudent.status}</span>
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div className="info-section">
              <h2>Parent/Guardian Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Father's Name:</label>
                  <span>{selectedStudent.parentInfo.fatherName}</span>
                </div>
                <div className="info-item">
                  <label>Father's Phone:</label>
                  <span>{selectedStudent.parentInfo.fatherPhone}</span>
                </div>
                <div className="info-item">
                  <label>Mother's Name:</label>
                  <span>{selectedStudent.parentInfo.motherName}</span>
                </div>
                <div className="info-item">
                  <label>Mother's Phone:</label>
                  <span>{selectedStudent.parentInfo.motherPhone}</span>
                </div>
              </div>
            </div>

            {/* Assigned Subjects */}
            <div className="info-section">
              <h2>Assigned Subjects</h2>
              <div className="subjects-display">
                {selectedStudent.assignedSubjects.map(subject => (
                  <div key={subject} className="subject-badge">
                    {subject}
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Performance */}
            <div className="info-section">
              <h2>Academic Performance - {selectedSession} {selectedTerm}</h2>
              
              {/* View Mode Toggle */}
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${viewMode === 'subjects' ? 'active' : ''}`}
                  onClick={() => setViewMode('subjects')}
                >
                  Subject Breakdown
                </button>
                <button
                  className={`toggle-btn ${viewMode === 'results' ? 'active' : ''}`}
                  onClick={() => setViewMode('results')}
                >
                  Results Summary
                </button>
              </div>

              {viewMode === 'subjects' ? (
                <div className="subjects-results">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>1st Assessment</th>
                        <th>2nd Assessment</th>
                        <th>Exam</th>
                        <th>Total</th>
                        <th>Grade</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.assignedSubjects.map(subject => {
                        const result = studentResults[selectedTerm]?.[subject];
                        return (
                          <tr key={subject}>
                            <td className="subject-name">{subject}</td>
                            <td>{result?.firstAssessment || '-'}</td>
                            <td>{result?.secondAssessment || '-'}</td>
                            <td>{result?.exam || '-'}</td>
                            <td className="total-score">{result?.total || '-'}</td>
                            <td>
                              <span className={`grade grade-${result?.grade?.toLowerCase() || 'empty'}`}>
                                {result?.grade || '-'}
                              </span>
                            </td>
                            <td>
                              <span className={`remarks ${result?.remarks?.toLowerCase().replace(' ', '-') || ''}`}>
                                {result?.remarks || '-'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="results-summary">
                  {overallStats && (
                    <>
                      <div className="summary-cards">
                        <div className="summary-card">
                          <h4>Average Score</h4>
                          <p className="summary-value">{overallStats.average}%</p>
                        </div>
                        <div className="summary-card">
                          <h4>Class Position</h4>
                          <p className="summary-value">{overallStats.position} / {overallStats.totalStudents}</p>
                        </div>
                        <div className="summary-card">
                          <h4>Total Subjects</h4>
                          <p className="summary-value">{overallStats.totalSubjects}</p>
                        </div>
                        <div className="summary-card">
                          <h4>Highest Score</h4>
                          <p className="summary-value">{overallStats.highestScore}%</p>
                        </div>
                      </div>

                      <div className="grade-distribution">
                        <h4>Grade Distribution</h4>
                        <div className="grade-bars">
                          {Object.entries(overallStats.gradeCounts).map(([grade, count]) => (
                            <div key={grade} className="grade-bar-item">
                              <span className="grade-label">{grade}:</span>
                              <div className="grade-bar">
                                <div 
                                  className={`grade-fill grade-${grade.toLowerCase()}`}
                                  style={{ width: `${(count / overallStats.totalSubjects) * 100}%` }}
                                ></div>
                              </div>
                              <span className="grade-count">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Attendance and Fees */}
            <div className="info-section">
              <h2>Attendance & Fees</h2>
              <div className="attendance-fees-grid">
                <div className="attendance-card">
                  <h4>Attendance</h4>
                  <div className="attendance-stats">
                    <div className="stat">
                      <span className="stat-label">Present:</span>
                      <span className="stat-value present">{selectedStudent.attendance.present}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Absent:</span>
                      <span className="stat-value absent">{selectedStudent.attendance.absent}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Late:</span>
                      <span className="stat-value late">{selectedStudent.attendance.late}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Total:</span>
                      <span className="stat-value">{selectedStudent.attendance.total}</span>
                    </div>
                  </div>
                  <div className="attendance-percentage">
                    <div className="percentage-bar">
                      <div 
                        className="percentage-fill"
                        style={{ width: `${(selectedStudent.attendance.present / selectedStudent.attendance.total) * 100}%` }}
                      ></div>
                    </div>
                    <span>{Math.round((selectedStudent.attendance.present / selectedStudent.attendance.total) * 100)}%</span>
                  </div>
                </div>

                <div className="fees-card">
                  <h4>Fee Status</h4>
                  <div className="fee-stats">
                    <div className="stat">
                      <span className="stat-label">Tuition:</span>
                      <span className="stat-value">₦{selectedStudent.fees.tuition.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Paid:</span>
                      <span className="stat-value paid">₦{selectedStudent.fees.paid.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Balance:</span>
                      <span className={`stat-value ${selectedStudent.fees.balance > 0 ? 'unpaid' : 'paid'}`}>
                        ₦{selectedStudent.fees.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={`fee-status ${selectedStudent.fees.status}`}>
                    {selectedStudent.fees.status.charAt(0).toUpperCase() + selectedStudent.fees.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
