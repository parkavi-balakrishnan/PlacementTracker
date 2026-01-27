import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AiCoach from './components/AiCoach';

// We create a separate component for the Navbar so it can use the "useLocation" hook
const Navbar = () => {
  const location = useLocation();
  
  // If we are on the dashboard, HIDE this navbar (because Dashboard has its own Logout button)
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav style={{ padding: '20px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
      <Link to="/login" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>Login</Link>
      <Link to="/signup" style={{ margin: '0 15px', color: '#4facfe', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>Sign Up</Link>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#0f0c29', color: 'white', fontFamily: "'Segoe UI', sans-serif" }}>
        
        <Navbar />

        <div style={{ padding: '20px' }}>
          <h1 style={{ textAlign: 'center', background: '-webkit-linear-gradient(45deg, #4facfe, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '3rem', marginBottom: '10px' }}>
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
  );
}

export default App;