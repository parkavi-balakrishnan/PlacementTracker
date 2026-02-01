import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeToggle from './ThemeToggle'; // Import it here!

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '15px 30px', 
            margin: '0 0 30px 0', 
            alignItems: 'center',
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>🚀 Tracker</Link>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                
                {/* Toggle Button sits here now */}
                <ThemeToggle />

                {!isAuthenticated ? (
                    <>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Login</Link>
                        <Link to="/signup" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Signup</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Dashboard</Link>
                        <Link to="/ai-coach" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>AI Coach</Link>
                        <button 
                            onClick={handleLogout} 
                            style={{ 
                                background: 'transparent', 
                                border: '1px solid var(--accent)', 
                                color: 'var(--accent)', 
                                padding: '8px 20px', 
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;