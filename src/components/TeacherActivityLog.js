import React, { useState } from 'react';

const TeacherActivityLog = () => {
  // Mock data representing typical teacher activities
  const [activities] = useState([
    {
      id: 1,
      teacherName: 'Aaron Aluko',
      role: 'Subject Teacher',
      actionType: 'RESULT_ENTRY',
      description: 'Entered Mathematics results for JSS 2.',
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      status: 'success'
    },
    {
      id: 2,
      teacherName: 'John Doe',
      role: 'Form Teacher',
      actionType: 'EMAIL_SENT',
      description: 'Sent bulk result emails to 35 parents in JSS 1.',
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      status: 'success'
    },
    {
      id: 3,
      teacherName: 'Jane Smith',
      role: 'Dual Role',
      actionType: 'LOGIN',
      description: 'Logged into the portal successfully.',
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      status: 'success'
    },
    {
      id: 4,
      teacherName: 'Aaron Aluko',
      role: 'Subject Teacher',
      actionType: 'PASSWORD_CHANGE',
      description: 'Updated account password.',
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      status: 'warning'
    },
    {
      id: 5,
      teacherName: 'Grace Okafor',
      role: 'Form Teacher',
      actionType: 'LOGIN_FAILED',
      description: 'Failed login attempt (Invalid Password).',
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      status: 'danger'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const getActionBadge = (type) => {
    switch(type) {
      case 'RESULT_ENTRY':
        return <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>✏️ ENTRY</span>;
      case 'EMAIL_SENT':
        return <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>📧 EMAIL</span>;
      case 'LOGIN':
        return <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>🔐 LOGIN</span>;
      case 'PASSWORD_CHANGE':
        return <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>🔑 SECURITY</span>;
      case 'LOGIN_FAILED':
        return <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>❌ ALERT</span>;
      default:
        return <span style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>ACTION</span>;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const filteredActivities = activities.filter(activity => 
    activity.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: '#f1f5f9', margin: '0 0 5px 0', fontSize: '24px' }}>Teacher Activity Log</h2>
          <p style={{ color: '#94a3b8', margin: 0 }}>Monitor all actions taken by teaching staff across the portal.</p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
            👥
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' }}>12</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Active Today</div>
          </div>
        </div>
        <div style={{ flex: 1, background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
            📝
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' }}>8</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Results Updated</div>
          </div>
        </div>
        <div style={{ flex: 1, background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
            ⚠️
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' }}>1</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Failed Logins</div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '18px' }}>Recent Activity</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search activity, teacher, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '300px',
                padding: '10px 15px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '6px',
                color: '#f1f5f9',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Activity Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.6)', textAlign: 'left' }}>
              <th style={{ padding: '15px 20px', color: '#94a3b8', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Teacher</th>
              <th style={{ padding: '15px 20px', color: '#94a3b8', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Action</th>
              <th style={{ padding: '15px 20px', color: '#94a3b8', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Details</th>
              <th style={{ padding: '15px 20px', color: '#94a3b8', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <tr key={activity.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.4)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                        {activity.teacherName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color: '#f1f5f9', fontWeight: '600' }}>{activity.teacherName}</div>
                        <div style={{ color: '#94a3b8', fontSize: '12px' }}>{activity.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    {getActionBadge(activity.actionType)}
                  </td>
                  <td style={{ padding: '15px 20px', color: '#cbd5e1', fontSize: '14px' }}>
                    {activity.description}
                  </td>
                  <td style={{ padding: '15px 20px', color: '#94a3b8', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🕒</span> {formatTimeAgo(activity.timestamp)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  No activities found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherActivityLog;
