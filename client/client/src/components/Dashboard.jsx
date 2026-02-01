import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Removed useNavigate since Navbar handles navigation/logout now

const Dashboard = () => {
    
    // --- STATE (Your existing logic) ---
    const [jobs, setJobs] = useState([]);
    const [tasks, setTasks] = useState([]);
    
    // Forms
    const [jobForm, setJobForm] = useState({ company: '', position: '', status: 'Applied' });
    const [taskForm, setTaskForm] = useState({ category: 'DSA', topic: '', taskName: '' });

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };

                // Get Jobs
                const resJobs = await axios.get('http://localhost:5001/api/jobs', config);
                setJobs(resJobs.data);

                // Get Tasks
                const resTasks = await axios.get('http://localhost:5001/api/tasks', config);
                setTasks(resTasks.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    // --- ACTIONS ---
    // (Logout is now handled by Navbar, so we removed it from here)

    // Add Job
    const handleJobSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
        const res = await axios.post('http://localhost:5001/api/jobs', jobForm, config);
        setJobs([res.data, ...jobs]);
        setJobForm({ company: '', position: '', status: 'Applied' });
    };

    // Add Task
    const handleTaskSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
        const res = await axios.post('http://localhost:5001/api/tasks', taskForm, config);
        setTasks([res.data, ...tasks]);
        setTaskForm({ ...taskForm, taskName: '' }); 
    };

    // Toggle Task Completion
    const toggleTask = async (id) => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.put(`http://localhost:5001/api/tasks/${id}`, {}, config);
        
        setTasks(tasks.map(task => task._id === id ? { ...task, isCompleted: !task.isCompleted } : task));
    };

    // Delete Task
    const deleteTask = async (id) => {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/tasks/${id}`, { headers: { 'x-auth-token': token } });
        setTasks(tasks.filter(task => task._id !== id));
    };

    // --- CALCULATE PROGRESS ---
    const calculateProgress = (category) => {
        const categoryTasks = tasks.filter(t => t.category === category);
        if (categoryTasks.length === 0) return 0;
        const completed = categoryTasks.filter(t => t.isCompleted).length;
        return Math.round((completed / categoryTasks.length) * 100);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
            
            {/* 1. NEW WELCOME SECTION */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: 'var(--text-main)' }}>
                    Welcome back, <span style={{ color: 'var(--primary)' }}>Future Engineer</span> 🚀
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your progress and crush your goals.</p>
            </div>

            {/* 2. STATS GRID (Using Glass Cards) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                
                {/* DSA Card */}
                <div className="glass-card" style={{ padding: '25px' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-secondary)' }}>📘 DSA Progress</h3>
                    <div style={{ background: 'var(--border)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${calculateProgress('DSA')}%`, background: 'var(--primary)', height: '100%' }}></div>
                    </div>
                    <p style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold' }}>{calculateProgress('DSA')}% Done</p>
                </div>

                {/* Core Card */}
                <div className="glass-card" style={{ padding: '25px' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-secondary)' }}>📗 Core Subjects</h3>
                    <div style={{ background: 'var(--border)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${calculateProgress('Core')}%`, background: 'var(--accent)', height: '100%' }}></div>
                    </div>
                    <p style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold' }}>{calculateProgress('Core')}% Done</p>
                </div>

                {/* Total Stats Card */}
                <div className="glass-card" style={{ padding: '25px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)' }}>{tasks.filter(t => t.isCompleted).length}</h2>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tasks</span>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--accent)' }}>{jobs.length}</h2>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Jobs</span>
                    </div>
                </div>
            </div>

            {/* 3. MAIN CONTENT (Tracker & Jobs) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>

                {/* LEFT: PREPARATION TRACKER */}
                <div className="glass-card" style={{ padding: '30px' }}>
                    <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginTop: 0, color: 'var(--text-main)' }}>📝 Study Tracker</h2>
                    
                    {/* Add Task Form */}
                    <form onSubmit={handleTaskSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <select 
                            value={taskForm.category} 
                            onChange={e => setTaskForm({...taskForm, category: e.target.value})}
                            style={{ padding: '12px', background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '8px' }}
                        >
                            <option value="DSA">DSA</option>
                            <option value="Core">Core</option>
                            <option value="Company">Company</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Topic" 
                            value={taskForm.topic}
                            onChange={e => setTaskForm({...taskForm, topic: e.target.value})}
                            required
                            style={{ flex: 1, padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px' }}
                        />
                        <input 
                            type="text" 
                            placeholder="Task Name" 
                            value={taskForm.taskName}
                            onChange={e => setTaskForm({...taskForm, taskName: e.target.value})}
                            required
                            style={{ flex: 2, padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px' }}
                        />
                        <button type="submit" className="neon-button" style={{ padding: '0 20px' }}>+</button>
                    </form>

                    {/* Task List */}
                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                        {tasks.map(task => (
                            <div key={task._id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '15px', 
                                marginBottom: '10px', 
                                background: 'var(--bg-main)', // Contrast against glass card
                                borderRadius: '10px',
                                border: '1px solid var(--border)',
                                opacity: task.isCompleted ? 0.6 : 1 
                            }}>
                                <input 
                                    type="checkbox" 
                                    checked={task.isCompleted} 
                                    onChange={() => toggleTask(task._id)}
                                    style={{ marginRight: '15px', width: '18px', height: '18px', cursor: 'pointer' }} 
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, textDecoration: task.isCompleted ? 'line-through' : 'none', color: 'var(--text-main)' }}>{task.taskName}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{task.category} • {task.topic}</span>
                                </div>
                                <button onClick={() => deleteTask(task._id)} style={{ background: 'transparent', border: 'none', color: '#ff4b2b', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: JOB APPLICATIONS */}
                <div className="glass-card" style={{ padding: '30px' }}>
                    <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginTop: 0, color: 'var(--text-main)' }}>💼 Job Applications</h2>
                    
                    {/* Add Job Form */}
                    <form onSubmit={handleJobSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input type="text" placeholder="Company" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} required style={{ flex: 1, padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                        <input type="text" placeholder="Role" value={jobForm.position} onChange={e => setJobForm({...jobForm, position: e.target.value})} required style={{ flex: 1, padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                        <button type="submit" className="neon-button" style={{ padding: '0 25px' }}>Add</button>
                    </form>

                    {/* Job List */}
                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                        {jobs.map(job => (
                            <div key={job._id} style={{ 
                                padding: '15px', 
                                marginBottom: '10px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                background: 'var(--bg-main)', // Contrast
                                borderRadius: '10px',
                                border: '1px solid var(--border)'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--text-main)' }}>{job.company}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{job.position}</p>
                                </div>
                                <span style={{ 
                                    fontSize: '0.75rem', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold',
                                    background: job.status === 'Offer' ? '#10b981' : 'var(--bg-card)', 
                                    border: '1px solid var(--border)',
                                    color: job.status === 'Offer' ? 'white' : 'var(--text-secondary)'
                                }}>
                                    {job.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;