import React from 'react';
import AdminTeacherCreation from './AdminTeacherCreation';

const TestTeacherCreation = () => {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1>FOLUSHO VICTORY SCHOOLS</h1>
        <h2>Teacher Creation System - Test Page</h2>
        <p>This is a test page to directly access the teacher creation functionality.</p>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <AdminTeacherCreation />
        </div>
      </div>
    </div>
  );
};

export default TestTeacherCreation;
