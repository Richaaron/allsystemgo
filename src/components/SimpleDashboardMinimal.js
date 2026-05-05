import React, { useState } from 'react';
import ResultsNigerian from './ResultsNigerian';
import StudentClean from './StudentClean';
import TeacherClean from './TeacherClean';
import ClassesClean from './ClassesClean';
import Settings from './Settings';
import TeacherActivityLog from './TeacherActivityLog';

const SimpleDashboardMinimal = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('overview');

  const renderContent = () => {
    switch (activeMenu) {
      case 'overview':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Dashboard Overview</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Total Students</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f1f5f9' }}>156</p>
              </div>
              <div style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Total Teachers</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f1f5f9' }}>24</p>
              </div>
              <div style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Total Classes</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f1f5f9' }}>12</p>
              </div>
            </div>
          </div>
        );
      case 'results':
        return <ResultsNigerian user={user} />;
      case 'students':
        return <StudentClean />;
      case 'teachers':
        return <TeacherClean />;
      case 'classes':
        return <ClassesClean />;
      case 'activity':
        return <TeacherActivityLog />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Welcome to Dashboard</h2>
            <p style={{ color: '#94a3b8' }}>Select a menu item to get started.</p>
          </div>
        );
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'results', label: 'Results', icon: '📝' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'teachers', label: 'Teachers', icon: '👥' },
    { id: 'classes', label: 'Classes', icon: '🏫' },
    { id: 'activity', label: 'Teacher Activity', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.5)'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'rgba(30, 41, 59, 0.8)',
        borderRight: '1px solid rgba(148, 163, 184, 0.2)',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem' }}>
            🎓 Folusho Victory
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>School Management System</p>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {menuItems.filter(item => {
              if (user?.role === 'admin') return true;
              return !['teachers', 'classes', 'activity'].includes(item.id);
            }).map(item => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: activeMenu === item.id 
                      ? 'rgba(59, 130, 246, 0.2)' 
                      : 'transparent',
                    border: activeMenu === item.id 
                      ? '2px solid #3b82f6' 
                      : '2px solid transparent',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem'
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div style={{
            padding: '15px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <p style={{ color: '#f1f5f9', fontSize: '0.9rem', marginBottom: '5px' }}>
              {user?.name || 'Admin User'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '10px' }}>
              {user?.role || 'Administrator'}
            </p>
            <button
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '20px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ color: '#f1f5f9', margin: 0 }}>
              {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
            </h2>
            <p style={{ color: '#94a3b8', margin: '5px 0 0 0', fontSize: '0.9rem' }}>
              Welcome back, {user?.name || 'Admin User'}
            </p>
          </div>
        </div>

        {/* Page Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default SimpleDashboardMinimal;
