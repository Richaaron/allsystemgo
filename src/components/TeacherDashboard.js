import React, { useState, useEffect } from 'react';
import { StudentService, ResultService, AttendanceService, mockDatabase } from '../services/schoolServices';
import { calculateGrade, calculateGPA, getCurrentAcademicYear, getCurrentTerm } from '../data/models';
import config, { getSchoolInfo } from '../config/envConfig';
import './Dashboard.css';
import '../styles/accessibility.css';

const TeacherDashboard = ({ user, onLogout }) => {
  const [activeModule, setActiveModule] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [myStudents, setMyStudents] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [mySubjects, setMySubjects] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [gradeEntryData, setGradeEntryData] = useState({});
  const schoolInfo = getSchoolInfo();

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      // Get teacher info from mock database
      const teacher = mockDatabase.teachers.find(t => t.email === user.email);
      if (!teacher) {
        throw new Error('Teacher not found');
      }

      setTeacherInfo(teacher);
      setMySubjects(teacher.subjectsTeaching);
      setMyClasses(teacher.classesAssigned);

      // Get students in teacher's classes
      const allStudents = mockDatabase.students;
      const myStudentsList = allStudents.filter(student => 
        teacher.classesAssigned.some(classId => {
          const classInfo = mockDatabase.classes.find(c => c.id === classId);
          return classInfo && classInfo.name === student.class;
        })
      );
      setMyStudents(myStudentsList);

      // Generate today's schedule
      const schedule = [
        { time: '8:00 AM', subject: 'Mathematics', class: 'JSS 1A', room: 'Room 12' },
        { time: '10:00 AM', subject: 'Mathematics', class: 'JSS 2B', room: 'Room 15' },
        { time: '2:00 PM', subject: 'Further Mathematics', class: 'SSS 3C', room: 'Room 8' }
      ];
      setTodaySchedule(schedule);

      // Generate assignments
      const mockAssignments = [
        { id: 1, title: 'Algebra Homework', class: 'JSS 1A', dueDate: '2024-05-05', submitted: 45, total: 50 },
        { id: 2, title: 'Geometry Project', class: 'JSS 2B', dueDate: '2024-05-08', submitted: 38, total: 42 }
      ];
      setAssignments(mockAssignments);

    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeEntry = () => {
    setActiveModule('grades');
  };

  const handleAttendance = () => {
    setActiveModule('attendance');
  };

  const handleAssignments = () => {
    setActiveModule('assignments');
  };

  const saveGrades = async () => {
    // Placeholder for grade saving
    alert('Grades saved successfully!');
  };

  const markAttendance = async (studentId, status) => {
    try {
      await AttendanceService.markAttendance({
        studentId,
        class: selectedClass,
        status,
        markedBy: user.name
      });
      // Refresh data
      fetchTeacherData();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" aria-hidden="true">🎓</div>
        <p>Loading FOLUSHO VICTORY SCHOOLS dashboard...</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="teacher-overview">
      <section className="teacher-info-section" aria-labelledby="teacher-info-heading">
        <h2 id="teacher-info-heading">My Teaching Assignment</h2>
        <div className="teacher-info-grid">
          <div className="info-card glass-card" role="region" aria-label="Classes Assigned">
            <h3>Classes Assigned</h3>
            <div className="classes-list">
              {myClasses.map(classId => {
                const classInfo = mockDatabase.classes.find(c => c.id === classId);
                return classInfo ? (
                  <span key={classId} className="class-badge">{classInfo.name}</span>
                ) : null;
              })}
            </div>
          </div>
          <div className="info-card glass-card" role="region" aria-label="Subjects Teaching">
            <h3>Subjects Teaching</h3>
            <div className="subjects-list">
              {mySubjects.map(subjectId => {
                const subject = mockDatabase.subjects.find(s => s.id === subjectId);
                return subject ? (
                  <span key={subjectId} className="subject-badge">{subject.name}</span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section" aria-labelledby="teacher-stats-heading">
        <h2 id="teacher-stats-heading">Teaching Overview</h2>
        <div className="stats-grid">
          <div className="stat-card glass-card" role="region" aria-label="Total Students">
            <div className="stat-icon" aria-hidden="true">👨‍🎓</div>
            <div className="stat-content">
              <div className="stat-number">{myStudents.length}</div>
              <div className="stat-label">Total Students</div>
              <div className="stat-detail">Across all classes</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Classes Teaching">
            <div className="stat-icon" aria-hidden="true">🏫</div>
            <div className="stat-content">
              <div className="stat-number">{myClasses.length}</div>
              <div className="stat-label">Classes</div>
              <div className="stat-detail">This term</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Subjects Teaching">
            <div className="stat-icon" aria-hidden="true">📚</div>
            <div className="stat-content">
              <div className="stat-number">{mySubjects.length}</div>
              <div className="stat-label">Subjects</div>
              <div className="stat-detail">Different subjects</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Average Attendance">
            <div className="stat-icon" aria-hidden="true">📊</div>
            <div className="stat-content">
              <div className="stat-number">88.2%</div>
              <div className="stat-label">Avg Attendance</div>
              <div className="stat-detail">This term</div>
            </div>
          </div>
        </div>
      </section>

      <section className="schedule-section" aria-labelledby="schedule-heading">
        <h2 id="schedule-heading">Today's Schedule</h2>
        <div className="schedule-list glass-card">
          {todaySchedule.map((period, index) => (
            <div key={index} className="schedule-item">
              <div className="schedule-time">{period.time}</div>
              <div className="schedule-content">
                <div className="schedule-subject">{period.subject}</div>
                <div className="schedule-class">{period.class}</div>
                <div className="schedule-room">Room: {period.room}</div>
              </div>
              <button className="btn btn-sm btn-primary">Mark Attendance</button>
            </div>
          ))}
        </div>
      </section>

      <section className="assignments-section" aria-labelledby="assignments-heading">
        <h2 id="assignments-heading">Recent Assignments</h2>
        <div className="assignments-grid">
          {assignments.map(assignment => (
            <div key={assignment.id} className="assignment-card glass-card">
              <div className="assignment-header">
                <h3>{assignment.title}</h3>
                <span className="assignment-class">{assignment.class}</span>
              </div>
              <div className="assignment-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {assignment.submitted}/{assignment.total} Submitted
                </div>
              </div>
              <div className="assignment-due">Due: {assignment.dueDate}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderGrades = () => (
    <div className="grades-module">
      <section className="module-header">
        <h2>Grade Entry - Nigerian Grading System</h2>
        <div className="module-actions">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            aria-label="Select class for grade entry"
          >
            <option value="">Select Class</option>
            {myClasses.map(classId => {
              const classInfo = mockDatabase.classes.find(c => c.id === classId);
              return classInfo ? (
                <option key={classId} value={classId}>{classInfo.name}</option>
              ) : null;
            })}
          </select>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Select subject for grade entry"
          >
            <option value="">Select Subject</option>
            {mySubjects.map(subjectId => {
              const subject = mockDatabase.subjects.find(s => s.id === subjectId);
              return subject ? (
                <option key={subjectId} value={subjectId}>{subject.name}</option>
              ) : null;
            })}
          </select>
          <button className="btn btn-primary" onClick={saveGrades}>Save Grades</button>
        </div>
      </section>

      <div className="grading-scale-info glass-card">
        <h3>Nigerian 5-Point Grading System</h3>
        <div className="scale-grid">
          <div className="scale-item grade-a">A (70-100) = 5.0 Points - Excellent</div>
          <div className="scale-item grade-b">B (60-69) = 4.0 Points - Very Good</div>
          <div className="scale-item grade-c">C (50-59) = 3.0 Points - Good</div>
          <div className="scale-item grade-d">D (45-49) = 2.0 Points - Credit</div>
          <div className="scale-item grade-e">E (40-44) = 1.0 Points - Pass</div>
          <div className="scale-item grade-f">F (0-39) = 0.0 Points - Fail</div>
        </div>
      </div>

      {selectedClass && selectedSubject && (
        <div className="grade-entry-container">
          <h3>Enter Grades</h3>
          <table className="grade-entry-table" role="table" aria-label="Grade entry table">
            <thead>
              <tr>
                <th scope="col">Student Name</th>
                <th scope="col">Admission No.</th>
                <th scope="col">1st CA (10)</th>
                <th scope="col">2nd CA (10)</th>
                <th scope="col">Exam (70)</th>
                <th scope="col">Total (100)</th>
                <th scope="col">Grade</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {myStudents
                .filter(student => {
                  const classInfo = mockDatabase.classes.find(c => c.id === selectedClass);
                  return classInfo && classInfo.name === student.class;
                })
                .map(student => (
                  <tr key={student.id}>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.admissionNumber}</td>
                    <td>
                      <input 
                        type="number" 
                        min="0" 
                        max="10" 
                        className="grade-input"
                        aria-label={`First CA for ${student.firstName} ${student.lastName}`}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        min="0" 
                        max="10" 
                        className="grade-input"
                        aria-label={`Second CA for ${student.firstName} ${student.lastName}`}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        min="0" 
                        max="70" 
                        className="grade-input"
                        aria-label={`Exam score for ${student.firstName} ${student.lastName}`}
                      />
                    </td>
                    <td className="total-score">-</td>
                    <td className="grade-display">-</td>
                    <td className="points-display">-</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAttendance = () => (
    <div className="attendance-module">
      <section className="module-header">
        <h2>Attendance Tracking</h2>
        <div className="module-actions">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            aria-label="Select class for attendance"
          >
            <option value="">Select Class</option>
            {myClasses.map(classId => {
              const classInfo = mockDatabase.classes.find(c => c.id === classId);
              return classInfo ? (
                <option key={classId} value={classId}>{classInfo.name}</option>
              ) : null;
            })}
          </select>
          <button className="btn btn-primary">Mark All Present</button>
          <button className="btn btn-secondary">Save Attendance</button>
        </div>
      </section>

      {selectedClass && (
        <div className="attendance-container">
          <div className="attendance-date">
            <label htmlFor="attendance-date">Date:</label>
            <input 
              type="date" 
              id="attendance-date"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <table className="attendance-table" role="table" aria-label="Attendance tracking table">
            <thead>
              <tr>
                <th scope="col">Student Name</th>
                <th scope="col">Admission No.</th>
                <th scope="col">Present</th>
                <th scope="col">Absent</th>
                <th scope="col">Late</th>
                <th scope="col">Excused</th>
                <th scope="col">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {myStudents
                .filter(student => {
                  const classInfo = mockDatabase.classes.find(c => c.id === selectedClass);
                  return classInfo && classInfo.name === student.class;
                })
                .map(student => (
                  <tr key={student.id}>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.admissionNumber}</td>
                    <td>
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`}
                        value="present"
                        onChange={() => markAttendance(student.id, 'present')}
                        aria-label={`Mark ${student.firstName} ${student.lastName} as present`}
                      />
                    </td>
                    <td>
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`}
                        value="absent"
                        onChange={() => markAttendance(student.id, 'absent')}
                        aria-label={`Mark ${student.firstName} ${student.lastName} as absent`}
                      />
                    </td>
                    <td>
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`}
                        value="late"
                        onChange={() => markAttendance(student.id, 'late')}
                        aria-label={`Mark ${student.firstName} ${student.lastName} as late`}
                      />
                    </td>
                    <td>
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`}
                        value="excused"
                        onChange={() => markAttendance(student.id, 'excused')}
                        aria-label={`Mark ${student.firstName} ${student.lastName} as excused`}
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="remarks-input"
                        placeholder="Add remarks..."
                        aria-label={`Remarks for ${student.firstName} ${student.lastName}`}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard teacher-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome, {user.name}!</h1>
            <p>{schoolInfo.name} - Teacher Dashboard</p>
            <p className="school-motto">{schoolInfo.motto}</p>
            <div className="teacher-details">
              <span>{teacherInfo.position}</span>
              <span>•</span>
              <span>{teacherInfo.department}</span>
            </div>
          </div>
          <div className="user-actions">
            <button 
              className="logout-btn btn btn-danger" 
              onClick={onLogout}
              aria-label="Logout from system"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav" role="navigation" aria-label="Teacher dashboard navigation">
        <button 
          className={`nav-btn ${activeModule === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveModule('overview')}
          aria-current={activeModule === 'overview' ? 'page' : undefined}
        >
          Overview
        </button>
        <button 
          className={`nav-btn ${activeModule === 'grades' ? 'active' : ''}`}
          onClick={handleGradeEntry}
          aria-current={activeModule === 'grades' ? 'page' : undefined}
        >
          Grade Entry
        </button>
        <button 
          className={`nav-btn ${activeModule === 'attendance' ? 'active' : ''}`}
          onClick={handleAttendance}
          aria-current={activeModule === 'attendance' ? 'page' : undefined}
        >
          Attendance
        </button>
        <button 
          className={`nav-btn ${activeModule === 'assignments' ? 'active' : ''}`}
          onClick={handleAssignments}
          aria-current={activeModule === 'assignments' ? 'page' : undefined}
        >
          Assignments
        </button>
      </nav>

      <main className="dashboard-main">
        {activeModule === 'overview' && renderOverview()}
        {activeModule === 'grades' && renderGrades()}
        {activeModule === 'attendance' && renderAttendance()}
        {activeModule === 'assignments' && (
          <div className="assignments-module">
            <h2>Assignment Management</h2>
            <p>Assignment management module coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
