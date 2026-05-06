import React, { useState, useEffect } from 'react';
import ResultsNigerian from './ResultsNigerian';
import StudentClean from './StudentClean';
import TeacherClean from './TeacherClean';
import Settings from './Settings';
import TeacherActivityLog from './TeacherActivityLog';
import { supabaseService } from '../services/supabaseService';

const SimpleDashboardMinimal = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [stats, setStats] = useState({ students: null, teachers: null, classes: null, results: null });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, results] = await Promise.all([
          supabaseService.getStudents(),
          supabaseService.getTeachers(),
          supabaseService.getStudentResults()
        ]);
        const classes = [...new Set(students.map(s => s.studentClass).filter(Boolean))];
        setStats({
          students: students.length,
          teachers: teachers.length,
          classes: classes.length,
          results: results.length
        });
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case 'overview':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#f1f5f9', marginBottom: '5px' }}>Dashboard Overview</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>Live data from database</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {[
                { label: 'Total Students', value: stats.students, icon: '🎓', color: '#3b82f6' },
                { label: 'Total Teachers', value: stats.teachers, icon: '👨‍🏫', color: '#22c55e' },
                { label: 'Active Classes', value: stats.classes, icon: '🏫', color: '#a855f7' },
                { label: 'Results Saved', value: stats.results, icon: '📄', color: '#f59e0b' }
              ].map(card => (
                <div key={card.label} style={{
                  background: 'rgba(30, 41, 59, 0.8)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: `1px solid ${card.color}40`,
                  boxShadow: `0 0 20px ${card.color}15`,
                  transition: 'transform 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>{card.label}</h3>
                    <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                  </div>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: card.color, margin: 0 }}>
                    {statsLoading ? '...' : card.value ?? 0}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', background: 'rgba(30, 41, 59, 0.8)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: '10px', fontSize: '1rem' }}>👋 Welcome back, {user?.name || user?.email}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>You are logged in as <strong style={{ color: '#60a5fa' }}>{user?.role?.replace('_', ' ').toUpperCase()}</strong>. Use the sidebar to navigate.</p>
            </div>
          </div>
        );
      case 'results':
        return <ResultsNigerian user={user} />;
      case 'students':
        return <StudentClean />;
      case 'teachers':
        return <TeacherClean />;
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'results', label: 'Results', icon: '📄' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
    { id: 'activity', label: 'Teacher Activity', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Nav Toggle */}
      <button 
        className="mobile-nav-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'} Menu
      </button>

      {/* Overlay to close sidebar on mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99
          }}
        />
      )}

      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
              return !['teachers', 'activity'].includes(item.id);
            }).map(item => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => handleMenuClick(item.id)}
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

      {/* Main Content Area */}
      <div className="dashboard-content">
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
