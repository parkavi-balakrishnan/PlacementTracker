import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: 'transparent',
        border: 'none', // No border, just the icon
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(15deg)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
    >
      {theme === 'dark' ? <Sun size={24} color="#FDB813" /> : <Moon size={24} color="#6366f1" />}
    </button>
  );
};

export default ThemeToggle;