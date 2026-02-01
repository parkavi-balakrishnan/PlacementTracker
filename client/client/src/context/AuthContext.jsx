import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in when app starts
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;