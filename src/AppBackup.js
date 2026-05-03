import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import AdminTeacherCreation from './components/AdminTeacherCreation';
import TestTeacherCreation from './components/TestTeacherCreation';
import SimpleTest from './components/SimpleTest';
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
      <div className="loading-container">
        <div className="loading-spinner">🎓</div>
        <p>Loading FOLUSHO VICTORY SCHOOLS...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? (
              user.role === 'admin' ? 
                <AdminDashboard user={user} onLogout={handleLogout} /> :
                user.role === 'teacher' ? 
                <TeacherDashboard user={user} onLogout={handleLogout} /> :
                <ParentDashboard user={user} onLogout={handleLogout} />
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-teacher" 
            element={user && user.role === 'admin' ? <AdminTeacherCreation /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/test-teacher-creation" 
            element={<TestTeacherCreation />} 
          />
          <Route 
            path="/simple-test" 
            element={<SimpleTest />} 
          />
          <Route path="/" element={<Navigate to="/simple-test" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
