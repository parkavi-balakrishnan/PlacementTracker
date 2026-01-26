import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // This connects to your BACKEND at port 5001
            const res = await axios.post('http://127.0.0.1:5001/api/auth/register', formData);
            alert('Registered Successfully! Token: ' + res.data.token);
        } catch (err) {
            console.error(err);
            alert('Error: ' + (err.response?.data?.msg || 'Something went wrong'));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Sign Up</h2>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    name="name" 
                    value={name} 
                    onChange={onChange} 
                    required 
                    style={{ padding: '10px' }}
                />
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
                <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Signup;