import React, { useState, useEffect } from 'react';
import { StudentService, ResultService, FeeService, AttendanceService, mockDatabase } from '../services/schoolServices';
import { formatNaira, getCurrentAcademicYear, getCurrentTerm } from '../data/models';
import config, { getSchoolInfo, formatCurrency } from '../config/envConfig';
import './Dashboard.css';
import '../styles/accessibility.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeModule, setActiveModule] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(config.academic.currentTerm);
  const [selectedYear, setSelectedYear] = useState(config.academic.currentYear);
  const schoolInfo = getSchoolInfo();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [studentsRes, teachersRes, classesRes, feesRes] = await Promise.all([
        StudentService.getStudents(),
        StudentService.getStudents(), // Mock for teachers
        StudentService.getStudents(), // Mock for classes
        FeeService.getFeeSummary()
      ]);

      // Calculate comprehensive stats
      const calculatedStats = {
        totalStudents: mockDatabase.students.length,
        totalTeachers: mockDatabase.teachers.length,
        totalClasses: mockDatabase.classes.length,
        totalSubjects: mockDatabase.subjects.length,
        averageAttendance: 88.5,
        averagePerformance: 76.2,
        totalRevenue: 125000000,
        pendingFees: 8500000,
        activeStudents: mockDatabase.students.filter(s => s.status === 'active').length,
        graduatedStudents: mockDatabase.students.filter(s => s.status === 'graduated').length
      };

      setStats(calculatedStats);
      setStudents(mockDatabase.students);
      setTeachers(mockDatabase.teachers);
      setClasses(mockDatabase.classes);
      setFees(mockDatabase.fees);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegistration = () => {
    setActiveModule('students');
  };

  const handleResultManagement = () => {
    setActiveModule('results');
  };

  const handleFeeManagement = () => {
    setActiveModule('fees');
  };

  const handleAttendanceTracking = () => {
    setActiveModule('attendance');
  };

  const generateReport = (type) => {
    // Placeholder for report generation
    alert(`Generating ${type} report...`);
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
    <div className="admin-overview">
      <section className="stats-section" aria-labelledby="overview-heading">
        <h2 id="overview-heading">School Overview - {config.academic.currentYear}</h2>
        <div className="stats-grid">
          <div className="stat-card glass-card" role="region" aria-label="Total Students">
            <div className="stat-icon" aria-hidden="true">👨‍🎓</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalStudents}</div>
              <div className="stat-label">Total Students</div>
              <div className="stat-detail">Active: {stats.activeStudents}</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Total Teachers">
            <div className="stat-icon" aria-hidden="true">👩‍🏫</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalTeachers}</div>
              <div className="stat-label">Teachers</div>
              <div className="stat-detail">Qualified Staff</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Total Classes">
            <div className="stat-icon" aria-hidden="true">🏫</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalClasses}</div>
              <div className="stat-label">Classes</div>
              <div className="stat-detail">All Levels</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Attendance Rate">
            <div className="stat-icon" aria-hidden="true">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.averageAttendance}%</div>
              <div className="stat-label">Attendance Rate</div>
              <div className="stat-detail">This Term</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Average Performance">
            <div className="stat-icon" aria-hidden="true">📈</div>
            <div className="stat-content">
              <div className="stat-number">{stats.averagePerformance}%</div>
              <div className="stat-label">Average Performance</div>
              <div className="stat-detail">School Wide</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Total Revenue">
            <div className="stat-icon" aria-hidden="true">💰</div>
            <div className="stat-content">
              <div className="stat-number">{formatNaira(stats.totalRevenue)}</div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-detail">This Academic Year</div>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-actions-section" aria-labelledby="actions-heading">
        <h2 id="actions-heading">Quick Actions</h2>
        <div className="actions-grid">
          <button 
            className="action-card glass-card btn" 
            onClick={handleStudentRegistration}
            aria-label="Register new student"
          >
            <div className="action-icon" aria-hidden="true">➕</div>
            <div className="action-title">Register Student</div>
            <div className="action-desc">Add new student</div>
          </button>
          <button 
            className="action-card glass-card btn" 
            onClick={handleResultManagement}
            aria-label="Manage student results"
          >
            <div className="action-icon" aria-hidden="true">📝</div>
            <div className="action-title">Manage Results</div>
            <div className="action-desc">Enter grades & generate reports</div>
          </button>
          <button 
            className="action-card glass-card btn" 
            onClick={handleFeeManagement}
            aria-label="Manage school fees"
          >
            <div className="action-icon" aria-hidden="true">💳</div>
            <div className="action-title">Fee Management</div>
            <div className="action-desc">Track payments & generate invoices</div>
          </button>
          <button 
            className="action-card glass-card btn" 
            onClick={handleAttendanceTracking}
            aria-label="Track attendance"
          >
            <div className="action-icon" aria-hidden="true">📋</div>
            <div className="action-title">Attendance</div>
            <div className="action-desc">Daily attendance tracking</div>
          </button>
          <button 
            className="action-card glass-card btn" 
            onClick={() => generateReport('academic')}
            aria-label="Generate academic reports"
          >
            <div className="action-icon" aria-hidden="true">📊</div>
            <div className="action-title">Academic Reports</div>
            <div className="action-desc">Performance analytics</div>
          </button>
          <button 
            className="action-card glass-card btn" 
            onClick={() => generateReport('financial')}
            aria-label="Generate financial reports"
          >
            <div className="action-icon" aria-hidden="true">📈</div>
            <div className="action-title">Financial Reports</div>
            <div className="action-desc">Revenue & expenses</div>
          </button>
        </div>
      </section>

      <section className="recent-activities-section" aria-labelledby="activities-heading">
        <h2 id="activities-heading">Recent Activities</h2>
        <div className="activities-list glass-card">
          <div className="activity-item">
            <div className="activity-icon" aria-hidden="true">👨‍🎓</div>
            <div className="activity-content">
              <div className="activity-action">New student registration</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" aria-hidden="true">📝</div>
            <div className="activity-content">
              <div className="activity-action">JSS 2A results uploaded</div>
              <div className="activity-time">4 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" aria-hidden="true">💰</div>
            <div className="activity-content">
              <div className="activity-action">Fee payment received - SSS 1B</div>
              <div className="activity-time">6 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" aria-hidden="true">📋</div>
            <div className="activity-content">
              <div className="activity-action">Daily attendance completed</div>
              <div className="activity-time">8 hours ago</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderStudents = () => (
    <div className="students-module">
      <section className="module-header">
        <h2>Student Management</h2>
        <div className="module-actions">
          <button className="btn btn-primary">Add New Student</button>
          <button className="btn btn-secondary">Export List</button>
        </div>
      </section>
      
      <div className="students-filters">
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          aria-label="Filter by class"
        >
          <option value="">All Classes</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Search students..." 
          aria-label="Search students"
        />
      </div>

      <div className="students-table-container">
        <table className="data-table" role="table" aria-label="Students list">
          <thead>
            <tr>
              <th scope="col">Admission No.</th>
              <th scope="col">Name</th>
              <th scope="col">Class</th>
              <th scope="col">Gender</th>
              <th scope="col">Parent Contact</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 10).map(student => (
              <tr key={student.id}>
                <td>{student.admissionNumber}</td>
                <td>{student.firstName} {student.lastName}</td>
                <td>{student.class}</td>
                <td>{student.gender}</td>
                <td>{student.parentGuardian.phone}</td>
                <td>
                  <span className={`status-badge ${student.status}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-secondary">View</button>
                  <button className="btn btn-sm btn-primary">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="results-module">
      <section className="module-header">
        <h2>Result Management</h2>
        <div className="module-actions">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            aria-label="Select class for results"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <select 
            value={selectedTerm} 
            onChange={(e) => setSelectedTerm(e.target.value)}
            aria-label="Select term"
          >
            <option value="TERM_1">First Term</option>
            <option value="TERM_2">Second Term</option>
            <option value="TERM_3">Third Term</option>
          </select>
          <button className="btn btn-primary">Generate Results</button>
        </div>
      </section>

      <div className="result-entry-container">
        <h3>Result Entry - Nigerian Grading Scale</h3>
        <div className="grading-scale-info glass-card">
          <h4>Nigerian 5-Point Grading System:</h4>
          <div className="scale-grid">
            <div className="scale-item">A (70-100) = 5.0 Points</div>
            <div className="scale-item">B (60-69) = 4.0 Points</div>
            <div className="scale-item">C (50-59) = 3.0 Points</div>
            <div className="scale-item">D (45-49) = 2.0 Points</div>
            <div className="scale-item">E (40-44) = 1.0 Points</div>
            <div className="scale-item">F (0-39) = 0.0 Points</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFees = () => (
    <div className="fees-module">
      <section className="module-header">
        <h2>Fee Management</h2>
        <div className="module-actions">
          <button className="btn btn-primary">Generate Invoices</button>
          <button className="btn btn-secondary">Payment Report</button>
        </div>
      </section>

      <div className="fee-summary-grid">
        <div className="summary-card glass-card">
          <h3>Total Revenue</h3>
          <div className="summary-amount">{formatNaira(stats.totalRevenue)}</div>
        </div>
        <div className="summary-card glass-card">
          <h3>Pending Fees</h3>
          <div className="summary-amount pending">{formatNaira(stats.pendingFees)}</div>
        </div>
        <div className="summary-card glass-card">
          <h3>Collection Rate</h3>
          <div className="summary-amount">93.2%</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome, {user.name}!</h1>
            <p>{schoolInfo.name} - Administrator Dashboard</p>
            <p className="school-motto">{schoolInfo.motto}</p>
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

      <nav className="dashboard-nav" role="navigation" aria-label="Dashboard navigation">
        <button 
          className={`nav-btn ${activeModule === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveModule('overview')}
          aria-current={activeModule === 'overview' ? 'page' : undefined}
        >
          Overview
        </button>
        <button 
          className={`nav-btn ${activeModule === 'students' ? 'active' : ''}`}
          onClick={() => setActiveModule('students')}
          aria-current={activeModule === 'students' ? 'page' : undefined}
        >
          Students
        </button>
        <button 
          className={`nav-btn ${activeModule === 'results' ? 'active' : ''}`}
          onClick={() => setActiveModule('results')}
          aria-current={activeModule === 'results' ? 'page' : undefined}
        >
          Results
        </button>
        <button 
          className={`nav-btn ${activeModule === 'fees' ? 'active' : ''}`}
          onClick={() => setActiveModule('fees')}
          aria-current={activeModule === 'fees' ? 'page' : undefined}
        >
          Fees
        </button>
        <button 
          className={`nav-btn ${activeModule === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveModule('attendance')}
          aria-current={activeModule === 'attendance' ? 'page' : undefined}
        >
          Attendance
        </button>
      </nav>

      <main className="dashboard-main">
        {activeModule === 'overview' && renderOverview()}
        {activeModule === 'students' && renderStudents()}
        {activeModule === 'results' && renderResults()}
        {activeModule === 'fees' && renderFees()}
        {activeModule === 'attendance' && (
          <div className="attendance-module">
            <h2>Attendance Tracking</h2>
            <p>Attendance management module coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
