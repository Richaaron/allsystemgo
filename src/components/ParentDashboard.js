import React, { useState, useEffect } from 'react';
import { ResultService, FeeService, AttendanceService, mockDatabase } from '../services/schoolServices';
import { formatNaira, getCurrentAcademicYear, getCurrentTerm } from '../data/models';
import config, { getSchoolInfo, formatCurrency } from '../config/envConfig';
import './Dashboard.css';
import '../styles/accessibility.css';

const ParentDashboard = ({ user, onLogout }) => {
  const [activeModule, setActiveModule] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [childResults, setChildResults] = useState([]);
  const [childAttendance, setChildAttendance] = useState({});
  const [childFees, setChildFees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const schoolInfo = getSchoolInfo();

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    setLoading(true);
    try {
      // Mock parent data based on user
      const mockChildren = [
        {
          id: 'student-0001',
          name: 'Johnson Junior',
          firstName: 'Johnson',
          lastName: 'Junior',
          class: 'JSS 1A',
          admissionNumber: 'FVS/2024/0001',
          attendance: { present: 18, absent: 2, percentage: 90 },
          grades: [
            { subject: 'Mathematics', score: 85, grade: 'A', points: 5.0 },
            { subject: 'English Language', score: 78, grade: 'B', points: 4.0 },
            { subject: 'Basic Science', score: 92, grade: 'A', points: 5.0 }
          ],
          fees: { paid: 45000, outstanding: 15000, dueDate: '2024-05-15', total: 60000 },
          gpa: 4.67,
          classPosition: 3,
          totalInClass: 42
        },
        {
          id: 'student-0002',
          name: 'Johnson Mary',
          firstName: 'Johnson',
          lastName: 'Mary',
          class: 'SSS 2B',
          admissionNumber: 'FVS/2024/0002',
          attendance: { present: 20, absent: 0, percentage: 100 },
          grades: [
            { subject: 'Mathematics', score: 88, grade: 'A', points: 5.0 },
            { subject: 'English Language', score: 91, grade: 'A', points: 5.0 },
            { subject: 'Physics', score: 76, grade: 'B', points: 4.0 }
          ],
          fees: { paid: 60000, outstanding: 0, dueDate: '2024-05-01', total: 60000 },
          gpa: 4.67,
          classPosition: 1,
          totalInClass: 38
        }
      ];

      setChildren(mockChildren);
      
      // Mock notifications
      const mockNotifications = [
        { id: 1, title: 'PTA Meeting', message: 'Next PTA meeting on May 10, 2024', type: 'info', date: '2024-05-01' },
        { id: 2, title: 'Outstanding Fees', message: 'Johnson Junior has outstanding fees of ₦15,000', type: 'warning', date: '2024-05-02' },
        { id: 3, title: 'Result Published', message: 'Second Term results are now available', type: 'success', date: '2024-04-28' }
      ];
      setNotifications(mockNotifications);

    } catch (error) {
      console.error('Error fetching parent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChildSelect = (childId) => {
    setSelectedChild(childId);
    const child = children.find(c => c.id === childId);
    if (child) {
      setChildResults(child.grades);
      setChildAttendance(child.attendance);
      setChildFees([child.fees]);
    }
  };

  const handlePayment = () => {
    setActiveModule('fees');
  };

  const downloadResult = (childId) => {
    // Placeholder for result download
    alert('Downloading result slip...');
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
    <div className="parent-overview">
      <section className="children-section" aria-labelledby="children-heading">
        <h2 id="children-heading">My Children</h2>
        <div className="children-grid">
          {children.map((child, index) => (
            <div key={child.id} className="child-card glass-card" role="region" aria-label={`Child ${child.name}`}>
              <div className="child-header">
                <div className="child-avatar" aria-hidden="true">👨‍🎓</div>
                <div className="child-info">
                  <h3>{child.name}</h3>
                  <p>{child.class}</p>
                  <p>Admission No: {child.admissionNumber}</p>
                </div>
              </div>
              <div className="child-stats">
                <div className="child-stat">
                  <span className="stat-label">GPA:</span>
                  <span className="stat-value">{child.gpa.toFixed(2)}</span>
                </div>
                <div className="child-stat">
                  <span className="stat-label">Position:</span>
                  <span className="stat-value">{child.classPosition}/{child.totalInClass}</span>
                </div>
                <div className="child-stat">
                  <span className="stat-label">Attendance:</span>
                  <span className="stat-value">{child.attendance.percentage}%</span>
                </div>
              </div>
              <div className="child-actions">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => handleChildSelect(child.id)}
                  aria-label={`View details for ${child.name}`}
                >
                  View Details
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => downloadResult(child.id)}
                  aria-label={`Download result for ${child.name}`}
                >
                  Download Result
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="notifications-section" aria-labelledby="notifications-heading">
        <h2 id="notifications-heading">Notifications & Announcements</h2>
        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification-item ${notification.type} glass-card`}>
              <div className="notification-icon" aria-hidden="true">
                {notification.type === 'info' ? '📢' : notification.type === 'warning' ? '⚠️' : '✅'}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <small>{notification.date}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="quick-stats-section" aria-labelledby="quick-stats-heading">
        <h2 id="quick-stats-heading">Quick Overview</h2>
        <div className="stats-grid">
          <div className="stat-card glass-card" role="region" aria-label="Total Children">
            <div className="stat-icon" aria-hidden="true">👨‍👩‍👧‍👦</div>
            <div className="stat-content">
              <div className="stat-number">{children.length}</div>
              <div className="stat-label">Children</div>
              <div className="stat-detail">Enrolled</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Average GPA">
            <div className="stat-icon" aria-hidden="true">📊</div>
            <div className="stat-content">
              <div className="stat-number">
                {(children.reduce((sum, child) => sum + child.gpa, 0) / children.length).toFixed(2)}
              </div>
              <div className="stat-label">Average GPA</div>
              <div className="stat-detail">This term</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Average Attendance">
            <div className="stat-icon" aria-hidden="true">📅</div>
            <div className="stat-content">
              <div className="stat-number">
                {Math.round(children.reduce((sum, child) => sum + child.attendance.percentage, 0) / children.length)}%
              </div>
              <div className="stat-label">Avg Attendance</div>
              <div className="stat-detail">This term</div>
            </div>
          </div>
          <div className="stat-card glass-card" role="region" aria-label="Total Fees">
            <div className="stat-icon" aria-hidden="true">💰</div>
            <div className="stat-content">
              <div className="stat-number">
                {formatNaira(children.reduce((sum, child) => sum + child.fees.total, 0))}
              </div>
              <div className="stat-label">Total Fees</div>
              <div className="stat-detail">This term</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderResults = () => (
    <div className="results-module">
      <section className="module-header">
        <h2>Academic Results</h2>
        <div className="module-actions">
          <select 
            value={selectedChild} 
            onChange={(e) => handleChildSelect(e.target.value)}
            aria-label="Select child for results"
          >
            <option value="">Select Child</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          <button className="btn btn-primary">Download All Results</button>
        </div>
      </section>

      {selectedChild && (
        <div className="child-results-container">
          {children
            .filter(child => child.id === selectedChild)
            .map(child => (
              <div key={child.id}>
                <div className="result-header glass-card">
                  <h3>{child.name} - {child.class}</h3>
                  <div className="result-summary">
                    <div className="summary-item">
                      <span>GPA:</span>
                      <span className="gpa-value">{child.gpa.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Position:</span>
                      <span>{child.classPosition}/{child.totalInClass}</span>
                    </div>
                    <div className="summary-item">
                      <span>Term:</span>
                      <span>{config.academic.currentTerm.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="grades-table-container glass-card">
                  <h4>Subject Results - Nigerian Grading System</h4>
                  <table className="results-table" role="table" aria-label="Subject results table">
                    <thead>
                      <tr>
                        <th scope="col">Subject</th>
                        <th scope="col">Score</th>
                        <th scope="col">Grade</th>
                        <th scope="col">Points</th>
                        <th scope="col">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {child.grades.map((grade, index) => (
                        <tr key={index}>
                          <td>{grade.subject}</td>
                          <td className="score-cell">{grade.score}%</td>
                          <td className={`grade-cell grade-${grade.grade.toLowerCase()}`}>{grade.grade}</td>
                          <td className="points-cell">{grade.points}.0</td>
                          <td className="remark-cell">
                            {grade.grade === 'A' ? 'Excellent' :
                             grade.grade === 'B' ? 'Very Good' :
                             grade.grade === 'C' ? 'Good' :
                             grade.grade === 'D' ? 'Credit' :
                             grade.grade === 'E' ? 'Pass' : 'Fail'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grading-legend glass-card">
                  <h4>Nigerian 5-Point Grading Scale:</h4>
                  <div className="scale-items">
                    <div className="scale-item grade-a">A (70-100) = 5.0 Points</div>
                    <div className="scale-item grade-b">B (60-69) = 4.0 Points</div>
                    <div className="scale-item grade-c">C (50-59) = 3.0 Points</div>
                    <div className="scale-item grade-d">D (45-49) = 2.0 Points</div>
                    <div className="scale-item grade-e">E (40-44) = 1.0 Points</div>
                    <div className="scale-item grade-f">F (0-39) = 0.0 Points</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderFees = () => (
    <div className="fees-module">
      <section className="module-header">
        <h2>Fee Management</h2>
        <div className="module-actions">
          <select 
            value={selectedChild} 
            onChange={(e) => handleChildSelect(e.target.value)}
            aria-label="Select child for fee details"
          >
            <option value="">Select Child</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handlePayment}>Make Payment</button>
        </div>
      </section>

      {selectedChild && (
        <div className="fee-details-container">
          {children
            .filter(child => child.id === selectedChild)
            .map(child => (
              <div key={child.id}>
                <div className="fee-summary-card glass-card">
                  <h3>{child.name} - Fee Summary</h3>
                  <div className="fee-breakdown">
                    <div className="fee-item">
                      <span className="fee-label">Total Amount:</span>
                      <span className="fee-amount total">{formatNaira(child.fees.total)}</span>
                    </div>
                    <div className="fee-item">
                      <span className="fee-label">Amount Paid:</span>
                      <span className="fee-amount paid">{formatNaira(child.fees.paid)}</span>
                    </div>
                    <div className="fee-item">
                      <span className="fee-label">Outstanding:</span>
                      <span className={`fee-amount ${child.fees.outstanding > 0 ? 'outstanding' : 'clear'}`}>
                        {formatNaira(child.fees.outstanding)}
                      </span>
                    </div>
                    <div className="fee-item">
                      <span className="fee-label">Due Date:</span>
                      <span className="fee-date">{child.fees.dueDate}</span>
                    </div>
                  </div>
                  <div className="payment-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(child.fees.paid / child.fees.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {Math.round((child.fees.paid / child.fees.total) * 100)}% Paid
                    </div>
                  </div>
                </div>

                <div className="payment-actions glass-card">
                  <h4>Payment Options</h4>
                  <div className="payment-methods">
                    <button className="payment-method-btn btn btn-primary">
                      <span className="method-icon" aria-hidden="true">🏦</span>
                      <span>Bank Transfer</span>
                    </button>
                    <button className="payment-method-btn btn btn-secondary">
                      <span className="method-icon" aria-hidden="true">💳</span>
                      <span>Card Payment</span>
                    </button>
                    <button className="payment-method-btn btn btn-secondary">
                      <span className="method-icon" aria-hidden="true">💰</span>
                      <span>Cash Payment</span>
                    </button>
                  </div>
                </div>

                <div className="payment-history glass-card">
                  <h4>Payment History</h4>
                  <table className="payment-table" role="table" aria-label="Payment history table">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Method</th>
                        <th scope="col">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2024-04-15</td>
                        <td>{formatNaira(30000)}</td>
                        <td>Bank Transfer</td>
                        <td>RCP20240415001</td>
                      </tr>
                      <tr>
                        <td>2024-03-10</td>
                        <td>{formatNaira(15000)}</td>
                        <td>Cash</td>
                        <td>RCP20240310001</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderAttendance = () => (
    <div className="attendance-module">
      <section className="module-header">
        <h2>Attendance Records</h2>
        <div className="module-actions">
          <select 
            value={selectedChild} 
            onChange={(e) => handleChildSelect(e.target.value)}
            aria-label="Select child for attendance"
          >
            <option value="">Select Child</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          <button className="btn btn-secondary">Download Report</button>
        </div>
      </section>

      {selectedChild && (
        <div className="attendance-details-container">
          {children
            .filter(child => child.id === selectedChild)
            .map(child => (
              <div key={child.id}>
                <div className="attendance-summary-card glass-card">
                  <h3>{child.name} - Attendance Summary</h3>
                  <div className="attendance-stats">
                    <div className="attendance-stat">
                      <div className="stat-number">{child.attendance.percentage}%</div>
                      <div className="stat-label">Attendance Rate</div>
                    </div>
                    <div className="attendance-breakdown">
                      <div className="breakdown-item present">
                        <span className="breakdown-number">{child.attendance.present}</span>
                        <span className="breakdown-label">Days Present</span>
                      </div>
                      <div className="breakdown-item absent">
                        <span className="breakdown-number">{child.attendance.absent}</span>
                        <span className="breakdown-label">Days Absent</span>
                      </div>
                    </div>
                  </div>
                  <div className="attendance-visual">
                    <div className="attendance-circle">
                      <div 
                        className="attendance-fill" 
                        style={{ 
                          background: `conic-gradient(#10b981 0deg ${child.attendance.percentage * 3.6}deg, #e5e7eb ${child.attendance.percentage * 3.6}deg)` 
                        }}
                      >
                        <div className="attendance-center">
                          {child.attendance.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="monthly-attendance glass-card">
                  <h4>Monthly Attendance - {config.academic.currentYear}</h4>
                  <div className="months-grid">
                    {['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'].map((month, index) => (
                      <div key={month} className="month-item">
                        <div className="month-name">{month}</div>
                        <div className="month-attendance">
                          <div className="attendance-bar">
                            <div 
                              className="attendance-fill" 
                              style={{ width: `${Math.floor(Math.random() * 20) + 80}%` }}
                            ></div>
                          </div>
                          <span className="attendance-percentage">
                            {Math.floor(Math.random() * 20) + 80}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard parent-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome, {user.name}!</h1>
            <p>{schoolInfo.name} - Parent Dashboard</p>
            <p className="school-motto">{schoolInfo.motto}</p>
            <div className="parent-details">
              <span>Parent/Guardian Portal</span>
              <span>•</span>
              <span>{children.length} Children Enrolled</span>
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

      <nav className="dashboard-nav" role="navigation" aria-label="Parent dashboard navigation">
        <button 
          className={`nav-btn ${activeModule === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveModule('overview')}
          aria-current={activeModule === 'overview' ? 'page' : undefined}
        >
          Overview
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
        {activeModule === 'results' && renderResults()}
        {activeModule === 'fees' && renderFees()}
        {activeModule === 'attendance' && renderAttendance()}
      </main>
    </div>
  );
};

export default ParentDashboard;
