import React, { useState } from 'react';
import SimpleTeacherRegistration from './SimpleTeacherRegistration';
import StudentManagement from './StudentManagement';
import TeacherManagement from './TeacherManagement';
import ClassesManagement from './ClassesManagement';
import ResultsClean from './ResultsClean';
import Settings from './Settings';
import './SimpleDashboard.css';

// Helper functions for role-based navigation
const getRoleBasedMenuItems = (role) => {
  switch (role) {
    case 'admin':
      return [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'register-teacher', label: 'Register Teacher', icon: '👨‍🏫' },
        { id: 'teachers', label: 'Teachers', icon: '👥' },
        { id: 'students', label: 'Students', icon: '🎓' },
        { id: 'classes', label: 'Classes', icon: '🏫' },
        { id: 'results', label: 'Results', icon: '📝' },
        { id: 'fees', label: 'Fees', icon: '💰' },
        { id: 'attendance', label: 'Attendance', icon: '📋' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ];
    case 'form_teacher':
      return [
        { id: 'overview', label: 'My Class', icon: '🏫' },
        { id: 'students', label: 'Students', icon: '🎓' },
        { id: 'attendance', label: 'Attendance', icon: '📋' },
        { id: 'results', label: 'Results', icon: '📝' },
        { id: 'discipline', label: 'Discipline', icon: '📚' },
        { id: 'communication', label: 'Communication', icon: '💬' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ];
    case 'subject_teacher':
      return [
        { id: 'overview', label: 'My Subjects', icon: '📚' },
        { id: 'students', label: 'Students', icon: '🎓' },
        { id: 'results', label: 'Results Entry', icon: '📝' },
        { id: 'performance', label: 'Performance', icon: '📊' },
        { id: 'attendance', label: 'Attendance', icon: '📋' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ];
    case 'dual_role':
      return [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'my-class', label: 'My Class', icon: '🏫' },
        { id: 'my-subjects', label: 'My Subjects', icon: '📚' },
        { id: 'students', label: 'Students', icon: '🎓' },
        { id: 'results', label: 'Results', icon: '📝' },
        { id: 'attendance', label: 'Attendance', icon: '📋' },
        { id: 'communication', label: 'Communication', icon: '💬' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ];
    case 'parent':
      return [
        { id: 'overview', label: 'My Children', icon: '👨‍👩‍👧‍👦' },
        { id: 'results', label: 'Results', icon: '📝' },
        { id: 'attendance', label: 'Attendance', icon: '📋' },
        { id: 'fees', label: 'Fees', icon: '💰' },
        { id: 'communication', label: 'Messages', icon: '💬' }
      ];
    default:
      return [
        { id: 'overview', label: 'Overview', icon: '📊' }
      ];
  }
};

// Helper functions for role-based content
const getRoleOverviewTitle = (role) => {
  switch (role) {
    case 'admin':
      return 'School Overview';
    case 'form_teacher':
      return 'My Class Overview';
    case 'subject_teacher':
      return 'My Subjects Overview';
    case 'dual_role':
      return 'Teaching Overview';
    case 'parent':
      return 'My Children Overview';
    default:
      return 'Overview';
  }
};

const getRoleBasedStats = (role) => {
  switch (role) {
    case 'admin':
      return [
        <div key="students" className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>150</h3>
            <p>Total Students</p>
          </div>
        </div>,
        <div key="teachers" className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-info">
            <h3>25</h3>
            <p>Total Teachers</p>
          </div>
        </div>,
        <div key="classes" className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-info">
            <h3>12</h3>
            <p>Total Classes</p>
          </div>
        </div>,
        <div key="subjects" className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>18</h3>
            <p>Total Subjects</p>
          </div>
        </div>
      ];
    case 'form_teacher':
      return [
        <div key="students" className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>32</h3>
            <p>Class Students</p>
          </div>
        </div>,
        <div key="attendance" className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>95%</h3>
            <p>Attendance Rate</p>
          </div>
        </div>,
        <div key="performance" className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>78%</h3>
            <p>Average Performance</p>
          </div>
        </div>,
        <div key="discipline" className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>2</h3>
            <p>Discipline Cases</p>
          </div>
        </div>
      ];
    case 'subject_teacher':
      return [
        <div key="subjects" className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>3</h3>
            <p>Assigned Subjects</p>
          </div>
        </div>,
        <div key="students" className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>96</h3>
            <p>Total Students</p>
          </div>
        </div>,
        <div key="performance" className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>82%</h3>
            <p>Average Score</p>
          </div>
        </div>,
        <div key="pending" className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>12</h3>
            <p>Pending Results</p>
          </div>
        </div>
      ];
    case 'dual_role':
      return [
        <div key="class" className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-info">
            <h3>JSS 2A</h3>
            <p>Assigned Class</p>
          </div>
        </div>,
        <div key="subjects" className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>2</h3>
            <p>Assigned Subjects</p>
          </div>
        </div>,
        <div key="students" className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>32</h3>
            <p>Total Students</p>
          </div>
        </div>,
        <div key="tasks" className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>8</h3>
            <p>Pending Tasks</p>
          </div>
        </div>
      ];
    case 'parent':
      return [
        <div key="children" className="stat-card">
          <div className="stat-icon">👨‍👩‍👧‍👦</div>
          <div className="stat-info">
            <h3>2</h3>
            <p>My Children</p>
          </div>
        </div>,
        <div key="fees" className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₦45,000</h3>
            <p>Total Fees</p>
          </div>
        </div>,
        <div key="results" className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>B+</h3>
            <p>Average Grade</p>
          </div>
        </div>,
        <div key="attendance" className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>92%</h3>
            <p>Attendance</p>
          </div>
        </div>
      ];
    default:
      return [];
  }
};

const getRoleBasedActivity = (role) => {
  switch (role) {
    case 'admin':
      return [
        <li key="1">New teacher registration completed</li>,
        <li key="2">Student results uploaded for JSS 2A</li>,
        <li key="3">Fee payment reminder sent to parents</li>,
        <li key="4">Class attendance report generated</li>
      ];
    case 'form_teacher':
      return [
        <li key="1">Class attendance marked for today</li>,
        <li key="2">Weekly progress report submitted</li>,
        <li key="3">Parent meeting scheduled for Friday</li>,
        <li key="4">Student discipline case resolved</li>
      ];
    case 'subject_teacher':
      return [
        <li key="1">Mathematics test results submitted</li>,
        <li key="2">Physics practical conducted</li>,
        <li key="3">Student performance analysis completed</li>,
        <li key="4">Subject materials uploaded</li>
      ];
    case 'dual_role':
      return [
        <li key="1">Class attendance recorded</li>,
        <li key="2">English test results submitted</li>,
        <li key="3">Class meeting held with parents</li>,
        <li key="4">Subject preparation completed</li>
      ];
    case 'parent':
      return [
        <li key="1">Child's results available for viewing</li>,
        <li key="2">Fee payment reminder received</li>,
        <li key="3">Teacher message regarding homework</li>,
        <li key="4">School event invitation received</li>
      ];
    default:
      return [<li key="1">No recent activity</li>];
  }
};

const SimpleDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('overview');
  
  const menuItems = getRoleBasedMenuItems(user.role);

  const renderContent = () => {
    switch (activeView) {
      case 'register-teacher':
        return <SimpleTeacherRegistration />;
      case 'overview':
        return (
          <div className="dashboard-content">
            <h2>{getRoleOverviewTitle(user.role)}</h2>
            <div className="stats-grid">
              {getRoleBasedStats(user.role)}
            </div>
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <ul>
                {getRoleBasedActivity(user.role)}
              </ul>
            </div>
          </div>
        );
      case 'teachers':
        return <TeacherManagement />;
      case 'students':
        return <StudentManagement />;
      case 'classes':
        return <ClassesManagement />;
      case 'results':
        return <ResultsClean />;
      case 'communication':
        return (
          <div className="dashboard-content">
            <h2>Communication</h2>
            <div className="content-placeholder">
              <p>Communication module coming soon...</p>
              <p>Send messages to parents, teachers, and students</p>
            </div>
          </div>
        );
      case 'settings':
        return <Settings user={user} />;
      default:
        return (
          <div className="dashboard-content">
            <h2>Welcome to Dashboard</h2>
            <p>Select an option from the menu to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="simple-dashboard">
      <div className="dashboard-header">
        <div className="header-left h1">
          <h1><span className="graduation-cap">🎓</span> FOLUSHO VICTORY SCHOOLS</h1>
          <p>Nigerian School Management System</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">({user.role})</span>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-body">
        <nav className="dashboard-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SimpleDashboard;
