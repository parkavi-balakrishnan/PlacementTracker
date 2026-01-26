import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:5001/api/auth/login', formData);
            
            // Save the token in "Local Storage" (Browser Memory)
            localStorage.setItem('token', res.data.token);
            
            //alert('Login Successful!');
            // Ideally, we would redirect to a Dashboard here
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err);
            alert('Error: ' + (err.response?.data?.msg || 'Invalid Credentials'));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Login</h2>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    name="email" 
                    value={email} 
                    onChange={onChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    name="password" 
                    value={password} 
                    onChange={onChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;