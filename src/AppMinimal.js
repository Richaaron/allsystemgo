import React from 'react';

function AppMinimal() {
  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh', 
      background: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#6b46c1', marginBottom: '20px' }}>
        FOLUSHO VICTORY SCHOOLS
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Minimal Test - Application is Working!
      </p>
      
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>✅ React Application Status</h2>
        <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <p>✅ React is rendering</p>
          <p>✅ Components are loading</p>
          <p>✅ Styles are applied</p>
          <p>✅ JavaScript is working</p>
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: '#e8f5e8', 
          borderRadius: '6px',
          border: '2px solid #4caf50'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>Success!</h3>
          <p>The basic React application is working correctly.</p>
          <p>If you can see this page, the React setup is functional.</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => alert('JavaScript is working!')}
            style={{
              background: '#6b46c1',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Test JavaScript
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppMinimal;
