import React, { useState, useEffect } from 'react';
import { TeacherAssignmentService, TEACHER_ROLES, TEACHER_ROLE_DESCRIPTIONS } from '../data/teacherModels';
import { NIGERIAN_GRADING_SCALE } from '../data/models';
import './FormTeacherDashboard.css';

const FormTeacherDashboard = ({ teacherId }) => {
  const [teacher, setTeacher] = useState(null);
  const [assignedClass, setAssignedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [classStatistics, setClassStatistics] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);

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
      attendance: { present: 85, absent: 5, late: 2, total: 92 },
      fees: { tuition: 45000, paid: 45000, balance: 0, status: 'paid' },
      results: {
        'First Term': { average: 87.5, position: 2, totalSubjects: 7 },
        'Second Term': { average: 89.2, position: 1, totalSubjects: 7 },
        'Third Term': { average: 91.8, position: 1, totalSubjects: 7 }
      }
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
      attendance: { present: 88, absent: 3, late: 1, total: 92 },
      fees: { tuition: 45000, paid: 30000, balance: 15000, status: 'partial' },
      results: {
        'First Term': { average: 82.3, position: 5, totalSubjects: 7 },
        'Second Term': { average: 85.1, position: 4, totalSubjects: 7 },
        'Third Term': { average: 87.9, position: 3, totalSubjects: 7 }
      }
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
      attendance: { present: 90, absent: 2, late: 0, total: 92 },
      fees: { tuition: 45000, paid: 45000, balance: 0, status: 'paid' },
      results: {
        'First Term': { average: 79.8, position: 8, totalSubjects: 7 },
        'Second Term': { average: 83.4, position: 6, totalSubjects: 7 },
        'Third Term': { average: 86.2, position: 5, totalSubjects: 7 }
      }
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
      attendance: { present: 87, absent: 4, late: 1, total: 92 },
      fees: { tuition: 45000, paid: 45000, balance: 0, status: 'paid' },
      results: {
        'First Term': { average: 85.6, position: 3, totalSubjects: 7 },
        'Second Term': { average: 87.8, position: 2, totalSubjects: 7 },
        'Third Term': { average: 90.1, position: 2, totalSubjects: 7 }
      }
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
      attendance: { present: 82, absent: 7, late: 3, total: 92 },
      fees: { tuition: 45000, paid: 20000, balance: 25000, status: 'partial' },
      results: {
        'First Term': { average: 76.4, position: 12, totalSubjects: 7 },
        'Second Term': { average: 78.9, position: 10, totalSubjects: 7 },
        'Third Term': { average: 81.5, position: 8, totalSubjects: 7 }
      }
    }
  ]);

  useEffect(() => {
    // Get teacher information
    const teacherData = TeacherAssignmentService.getTeacherById(teacherId);
    setTeacher(teacherData);
    
    if (teacherData && teacherData.assignedClass) {
      setAssignedClass(teacherData.assignedClass);
      
      // Get students in assigned class
      const students = allStudents.filter(student => 
        student.class === teacherData.assignedClass
      );
      setClassStudents(students);
      
      // Calculate class statistics
      calculateClassStatistics(students);
    }
  }, [teacherId, allStudents]);

  const calculateClassStatistics = (students) => {
    if (!students || students.length === 0) return;
    
    const stats = {
      totalStudents: students.length,
      averageAttendance: 0,
      feeStatus: { paid: 0, partial: 0, unpaid: 0 },
      averagePerformance: 0,
      genderDistribution: { male: 0, female: 0 },
      streamDistribution: {}
    };
    
    let totalAttendance = 0;
    let totalPerformance = 0;
    
    students.forEach(student => {
      // Attendance
      const attendancePercentage = (student.attendance.present / student.attendance.total) * 100;
      totalAttendance += attendancePercentage;
      
      // Fee status
      stats.feeStatus[student.fees.status]++;
      
      // Performance
      const termResults = student.results[selectedTerm];
      if (termResults) {
        totalPerformance += termResults.average;
      }
      
      // Gender (mock data - would come from actual student data)
      stats.genderDistribution[student.firstName.includes('a') ? 'female' : 'male']++;
      
      // Stream distribution
      if (!stats.streamDistribution[student.stream]) {
        stats.streamDistribution[student.stream] = 0;
      }
      stats.streamDistribution[student.stream]++;
    });
    
    stats.averageAttendance = (totalAttendance / students.length).toFixed(1);
    stats.averagePerformance = (totalPerformance / students.length).toFixed(1);
    
    setClassStatistics(stats);
  };

  const filteredStudents = classStudents.filter(student =>
    `${student.firstName} ${student.lastName} ${student.admissionNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const getPerformanceColor = (average) => {
    if (average >= 70) return '#10b981';
    if (average >= 60) return '#3b82f6';
    if (average >= 50) return '#f59e0b';
    if (average >= 45) return '#f97316';
    return '#ef4444';
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 75) return '#3b82f6';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (!teacher) {
    return <div className="loading">Loading teacher information...</div>;
  }

  return (
    <div className="form-teacher-dashboard">
      <div className="dashboard-header">
        <div className="teacher-info">
          <h1>Form Teacher Dashboard</h1>
          <p>{teacher.firstName} {teacher.lastName} - {teacher.assignedClass}</p>
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

      {/* Class Statistics */}
      {classStatistics && (
        <div className="class-statistics">
          <h2>Class Overview - {assignedClass}</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Students</h4>
              <p className="stat-value">{classStatistics.totalStudents}</p>
            </div>
            <div className="stat-card">
              <h4>Average Attendance</h4>
              <p className="stat-value" style={{ color: getAttendanceColor(classStatistics.averageAttendance) }}>
                {classStatistics.averageAttendance}%
              </p>
            </div>
            <div className="stat-card">
              <h4>Average Performance</h4>
              <p className="stat-value" style={{ color: getPerformanceColor(classStatistics.averagePerformance) }}>
                {classStatistics.averagePerformance}%
              </p>
            </div>
            <div className="stat-card">
              <h4>Fee Compliance</h4>
              <p className="stat-value">
                {Math.round((classStatistics.feeStatus.paid / classStatistics.totalStudents) * 100)}%
              </p>
            </div>
          </div>

          <div className="additional-stats">
            <div className="gender-distribution">
              <h4>Gender Distribution</h4>
              <div className="distribution-bars">
                <div className="distribution-item">
                  <span>Male: {classStatistics.genderDistribution.male}</span>
                  <div className="bar male-bar" style={{ width: `${(classStatistics.genderDistribution.male / classStatistics.totalStudents) * 100}%` }}></div>
                </div>
                <div className="distribution-item">
                  <span>Female: {classStatistics.genderDistribution.female}</span>
                  <div className="bar female-bar" style={{ width: `${(classStatistics.genderDistribution.female / classStatistics.totalStudents) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="stream-distribution">
              <h4>Stream Distribution</h4>
              <div className="distribution-bars">
                {Object.entries(classStatistics.streamDistribution).map(([stream, count]) => (
                  <div key={stream} className="distribution-item">
                    <span>{stream}: {count}</span>
                    <div className={`bar ${stream.toLowerCase()}-bar`} style={{ width: `${(count / classStatistics.totalStudents) * 100}%` }}></div>
                  </div>
                ))}
              </div>
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
          Class Students
        </button>
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
        <button
          className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
          onClick={() => setActiveTab('fees')}
        >
          Fee Status
        </button>
        <button
          className={`tab-btn ${activeTab === 'discipline' ? 'active' : ''}`}
          onClick={() => setActiveTab('discipline')}
        >
          Discipline
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'students' && (
          <div className="students-tab">
            <div className="tab-header">
              <h3>Class Students</h3>
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
                      <p className="stream-info">{student.stream} Stream</p>
                      <div className="student-metrics">
                        <div className="metric">
                          <span className="metric-label">Attendance:</span>
                          <span className="metric-value" style={{ color: getAttendanceColor(attendancePercentage) }}>
                            {Math.round(attendancePercentage)}%
                          </span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Average:</span>
                          <span className="metric-value" style={{ color: getPerformanceColor(termResults?.average || 0) }}>
                            {termResults?.average || '-'}%
                          </span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Position:</span>
                          <span className="metric-value">{termResults?.position || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="status-indicators">
                      <div className={`fee-status ${student.fees.status}`}>
                        {student.fees.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-tab">
            <h3>Class Attendance Overview</h3>
            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission No.</th>
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
                        <td>{student.attendance.present}</td>
                        <td>{student.attendance.absent}</td>
                        <td>{student.attendance.late}</td>
                        <td>{student.attendance.total}</td>
                        <td style={{ color: getAttendanceColor(percentage), fontWeight: '600' }}>
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

        {activeTab === 'results' && (
          <div className="results-tab">
            <h3>Class Results - {selectedTerm} {selectedSession}</h3>
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission No.</th>
                    <th>Stream</th>
                    <th>Average</th>
                    <th>Position</th>
                    <th>Subjects</th>
                    <th>Grade Distribution</th>
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
                        <td>{student.stream}</td>
                        <td style={{ color: getPerformanceColor(termResults?.average || 0), fontWeight: '600' }}>
                          {termResults?.average || '-'}%
                        </td>
                        <td>{termResults?.position || '-'}</td>
                        <td>{termResults?.totalSubjects || '-'}</td>
                        <td>
                          <div className="grade-distribution-mini">
                            {/* Mock grade distribution */}
                            <span className="grade-badge a">3</span>
                            <span className="grade-badge b">2</span>
                            <span className="grade-badge c">1</span>
                            <span className="grade-badge d">1</span>
                          </div>
                        </td>
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
        )}

        {activeTab === 'fees' && (
          <div className="fees-tab">
            <h3>Class Fee Status</h3>
            <div className="fee-summary">
              <div className="fee-cards">
                <div className="fee-card paid">
                  <h4>Fully Paid</h4>
                  <p className="fee-count">{classStatistics?.feeStatus.paid || 0}</p>
                  <p className="fee-percentage">
                    {Math.round(((classStatistics?.feeStatus.paid || 0) / (classStatistics?.totalStudents || 1)) * 100)}%
                  </p>
                </div>
                <div className="fee-card partial">
                  <h4>Partially Paid</h4>
                  <p className="fee-count">{classStatistics?.feeStatus.partial || 0}</p>
                  <p className="fee-percentage">
                    {Math.round(((classStatistics?.feeStatus.partial || 0) / (classStatistics?.totalStudents || 1)) * 100)}%
                  </p>
                </div>
                <div className="fee-card unpaid">
                  <h4>Unpaid</h4>
                  <p className="fee-count">{classStatistics?.feeStatus.unpaid || 0}</p>
                  <p className="fee-percentage">
                    {Math.round(((classStatistics?.feeStatus.unpaid || 0) / (classStatistics?.totalStudents || 1)) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="fee-details-table">
              <table className="fee-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission No.</th>
                    <th>Tuition Fee</th>
                    <th>Amount Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{student.admissionNumber}</td>
                      <td>₦{student.fees.tuition.toLocaleString()}</td>
                      <td>₦{student.fees.paid.toLocaleString()}</td>
                      <td className={student.fees.balance > 0 ? 'unpaid' : 'paid'}>
                        ₦{student.fees.balance.toLocaleString()}
                      </td>
                      <td>
                        <span className={`fee-status-badge ${student.fees.status}`}>
                          {student.fees.status.charAt(0).toUpperCase() + student.fees.status.slice(1)}
                        </span>
                      </td>
                      <td>{student.fees.status === 'paid' ? '2024-09-15' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'discipline' && (
          <div className="discipline-tab">
            <h3>Class Discipline Records</h3>
            <div className="discipline-summary">
              <div className="discipline-stats">
                <div className="discipline-stat excellent">
                  <h4>Excellent</h4>
                  <p>12 students</p>
                </div>
                <div className="discipline-stat good">
                  <h4>Good</h4>
                  <p>8 students</p>
                </div>
                <div className="discipline-stat fair">
                  <h4>Needs Improvement</h4>
                  <p>3 students</p>
                </div>
                <div className="discipline-stat poor">
                  <h4>Poor</h4>
                  <p>2 students</p>
                </div>
              </div>
            </div>

            <div className="discipline-records">
              <table className="discipline-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission No.</th>
                    <th>Conduct Grade</th>
                    <th>Incidents</th>
                    <th>Remarks</th>
                    <th>Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{student.admissionNumber}</td>
                      <td>
                        <span className="conduct-grade excellent">A</span>
                      </td>
                      <td>0</td>
                      <td>Excellent behavior, respectful to teachers and peers</td>
                      <td>
                        <span className="action-required none">None</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="student-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Student Details</h3>
              <button
                className="close-btn"
                onClick={() => setShowStudentDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="student-basic-info">
                <h4>{selectedStudent.firstName} {selectedStudent.lastName} {selectedStudent.middleName}</h4>
                <p>{selectedStudent.admissionNumber} | {selectedStudent.class} ({selectedStudent.stream})</p>
              </div>
              
              <div className="student-detailed-info">
                <div className="info-section">
                  <h5>Academic Performance</h5>
                  <div className="performance-chart">
                    {/* Performance visualization would go here */}
                    <p>Average: {selectedStudent.results[selectedTerm]?.average || '-'}%</p>
                    <p>Position: {selectedStudent.results[selectedTerm]?.position || '-'}</p>
                  </div>
                </div>
                
                <div className="info-section">
                  <h5>Assigned Subjects</h5>
                  <div className="subjects-list">
                    {selectedStudent.assignedSubjects.map(subject => (
                      <span key={subject} className="subject-badge">{subject}</span>
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
                
                <div className="info-section">
                  <h5>Fee Status</h5>
                  <div className="fee-summary-student">
                    <div className="fee-item">
                      <span>Tuition:</span>
                      <span>₦{selectedStudent.fees.tuition.toLocaleString()}</span>
                    </div>
                    <div className="fee-item">
                      <span>Paid:</span>
                      <span>₦{selectedStudent.fees.paid.toLocaleString()}</span>
                    </div>
                    <div className="fee-item">
                      <span>Balance:</span>
                      <span className={selectedStudent.fees.balance > 0 ? 'unpaid' : 'paid'}>
                        ₦{selectedStudent.fees.balance.toLocaleString()}
                      </span>
                    </div>
                    <div className="fee-item">
                      <span>Status:</span>
                      <span className={`fee-status-badge ${selectedStudent.fees.status}`}>
                        {selectedStudent.fees.status.charAt(0).toUpperCase() + selectedStudent.fees.status.slice(1)}
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

export default FormTeacherDashboard;
