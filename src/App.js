import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SimpleLogin from './components/SimpleLogin';
import SimpleDashboardMinimal from './components/SimpleDashboardMinimal';
import SimpleTeacherRegistration from './components/SimpleTeacherRegistration';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <p>Loading FOLUSHO VICTORY SCHOOLS...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <SimpleLogin onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <SimpleDashboardMinimal user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/register-teacher" 
            element={user ? <SimpleTeacherRegistration /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
