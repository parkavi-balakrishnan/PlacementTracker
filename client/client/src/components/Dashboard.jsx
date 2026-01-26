import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'Applied'
    });

    const { company, position, status } = formData;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('/api/jobs', config);
                setJobs(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) logout();
            }
        };
        fetchJobs();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
            const body = JSON.stringify(formData);
            const res = await axios.post('/api/jobs', body, config);
            setJobs([res.data, ...jobs]);
            setFormData({ company: '', position: '', status: 'Applied' });
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>🎓 My Applications</h2>
                <button onClick={logout} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #ff4b2b', color: '#ff4b2b', borderRadius: '8px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            {/* --- ADD JOB FORM --- */}
            <div className="job-card" style={{ padding: '25px', marginBottom: '40px' }}>
                <h3 style={{ marginTop: 0, color: '#4facfe' }}>➕ Add New Application</h3>
                <form onSubmit={onSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
                    <input type="text" placeholder="Company Name" name="company" value={company} onChange={onChange} required style={{ flex: 2, minWidth: '200px' }} />
                    <input type="text" placeholder="Position" name="position" value={position} onChange={onChange} required style={{ flex: 2, minWidth: '200px' }} />
                    <select name="status" value={status} onChange={onChange} style={{ flex: 1, minWidth: '120px' }}>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <button type="submit" style={{ padding: '12px 30px', background: 'linear-gradient(to right, #4facfe, #00f2fe)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Add
                    </button>
                </form>
            </div>

            {/* --- JOB LIST --- */}
            <div style={{ display: 'grid', gap: '15px' }}>
                {jobs.map(job => (
                    <div key={job._id} className="job-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{job.company}</h3>
                            <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>{job.position}</p>
                        </div>
                        <span className="badge" style={{ 
                            padding: '8px 15px', 
                            borderRadius: '20px', 
                            fontSize: '0.8rem',
                            background: job.status === 'Offer' ? 'rgba(46, 204, 113, 0.2)' : job.status === 'Rejected' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(241, 196, 15, 0.2)',
                            color: job.status === 'Offer' ? '#2ecc71' : job.status === 'Rejected' ? '#e74c3c' : '#f1c40f',
                            border: `1px solid ${job.status === 'Offer' ? '#2ecc71' : job.status === 'Rejected' ? '#e74c3c' : '#f1c40f'}`
                        }}>
                            {job.status}
                        </span>
                    </div>
                ))}
                {jobs.length === 0 && <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>No jobs yet. Time to grind! 💼</p>}
            </div>
        </div>
    );
};

export default Dashboard;