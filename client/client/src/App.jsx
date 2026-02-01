import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AiCoach from './components/AiCoach';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Main Container with dynamic background color */}
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: 'all 0.3s' }}>
          
          {/* ☀️ Toggle Button is now inside Navbar, so we removed it from here! */}
          <Navbar />

          <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', margin: '20px 0', fontSize: '2.5rem', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
               🚀 Placement Tracker
            </h1>

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Login />} />
              <Route path="/ai-coach" element={<AiCoach />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;