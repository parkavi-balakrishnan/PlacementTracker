import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // --- STATE ---
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
                const resJobs = await axios.get('/api/jobs', config);
                setJobs(resJobs.data);

                // Get Tasks
                const resTasks = await axios.get('/api/tasks', config);
                setTasks(resTasks.data);
            } catch (err) {
                if (err.response && err.response.status === 401) logout();
            }
        };
        fetchData();
    }, []);

    // --- ACTIONS ---
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Add Job
    const handleJobSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
        const res = await axios.post('/api/jobs', jobForm, config);
        setJobs([res.data, ...jobs]);
        setJobForm({ company: '', position: '', status: 'Applied' });
    };

    // Add Task
    const handleTaskSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
        const res = await axios.post('/api/tasks', taskForm, config);
        setTasks([res.data, ...tasks]);
        setTaskForm({ ...taskForm, taskName: '' }); // Keep category/topic, clear name
    };

    // Toggle Task Completion
    const toggleTask = async (id) => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.put(`/api/tasks/${id}`, {}, config);
        
        // Update UI locally
        setTasks(tasks.map(task => task._id === id ? { ...task, isCompleted: !task.isCompleted } : task));
    };

    // Delete Task
    const deleteTask = async (id) => {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/tasks/${id}`, { headers: { 'x-auth-token': token } });
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
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
            
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', background: '-webkit-linear-gradient(45deg, #4facfe, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    🚀 Placement Dashboard
                </h1>
                <button onClick={logout} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #ff4b2b', color: '#ff4b2b', borderRadius: '5px', cursor: 'pointer' }}>
                    Logout
                </button>
                <button onClick={() => navigate('/ai-coach')} style={{ marginRight: '10px', padding: '8px 20px', background: 'linear-gradient(to right, #6a11cb, #2575fc)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
    🤖 AI Coach
</button>
            </div>

            {/* --- ANALYTICS SECTION --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                
                {/* DSA Progress Card */}
                <div className="job-card" style={{ padding: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>📘 DSA Progress</h3>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginTop: '10px' }}>
                        <div style={{ width: `${calculateProgress('DSA')}%`, background: '#4facfe', height: '100%' }}></div>
                    </div>
                    <p style={{ textAlign: 'right', marginTop: '5px' }}>{calculateProgress('DSA')}% Completed</p>
                </div>

                {/* Core Progress Card */}
                <div className="job-card" style={{ padding: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>📗 Core Subjects</h3>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginTop: '10px' }}>
                        <div style={{ width: `${calculateProgress('Core')}%`, background: '#00f2fe', height: '100%' }}></div>
                    </div>
                    <p style={{ textAlign: 'right', marginTop: '5px' }}>{calculateProgress('Core')}% Completed</p>
                </div>

                {/* Stats Card */}
                <div className="job-card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h3 style={{ marginTop: 0 }}>📊 Total Stats</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
                        <div>
                            <h2 style={{ margin: 0, color: '#4facfe' }}>{tasks.filter(t => t.isCompleted).length}</h2>
                            <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Tasks Done</span>
                        </div>
                        <div>
                            <h2 style={{ margin: 0, color: '#ff9f43' }}>{jobs.length}</h2>
                            <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Applications</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

                {/* LEFT: PREPARATION TRACKER */}
                <div>
                    <h2 style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>📝 Study Tracker</h2>
                    
                    {/* Add Task Form */}
                    <form onSubmit={handleTaskSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <select 
                            value={taskForm.category} 
                            onChange={e => setTaskForm({...taskForm, category: e.target.value})}
                            style={{ padding: '10px', background: '#24243e', color: 'white', border: 'none', borderRadius: '5px' }}
                        >
                            <option value="DSA">DSA</option>
                            <option value="Core">Core</option>
                            <option value="Company">Company</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Topic (e.g. Arrays)" 
                            value={taskForm.topic}
                            onChange={e => setTaskForm({...taskForm, topic: e.target.value})}
                            required
                            style={{ flex: 1, padding: '10px', background: '#24243e', border: 'none', color: 'white', borderRadius: '5px' }}
                        />
                        <input 
                            type="text" 
                            placeholder="Task Name" 
                            value={taskForm.taskName}
                            onChange={e => setTaskForm({...taskForm, taskName: e.target.value})}
                            required
                            style={{ flex: 2, padding: '10px', background: '#24243e', border: 'none', color: 'white', borderRadius: '5px' }}
                        />
                        <button type="submit" style={{ padding: '10px', background: '#4facfe', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+</button>
                    </form>

                    {/* Task List */}
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {tasks.map(task => (
                            <div key={task._id} className="job-card" style={{ display: 'flex', alignItems: 'center', padding: '15px', marginBottom: '10px', opacity: task.isCompleted ? 0.6 : 1 }}>
                                <input 
                                    type="checkbox" 
                                    checked={task.isCompleted} 
                                    onChange={() => toggleTask(task._id)}
                                    style={{ marginRight: '15px', transform: 'scale(1.5)', cursor: 'pointer' }} 
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, textDecoration: task.isCompleted ? 'line-through' : 'none' }}>{task.taskName}</h4>
                                    <span style={{ fontSize: '0.8rem', color: '#4facfe' }}>{task.category} • {task.topic}</span>
                                </div>
                                <button onClick={() => deleteTask(task._id)} style={{ background: 'transparent', border: 'none', color: '#ff4b2b', cursor: 'pointer' }}>✖</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: JOB APPLICATIONS (Existing Feature) */}
                <div>
                    <h2 style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>💼 Job Applications</h2>
                    
                    {/* Add Job Form */}
                    <form onSubmit={handleJobSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input type="text" placeholder="Company" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#24243e', border: 'none', color: 'white', borderRadius: '5px' }} />
                        <input type="text" placeholder="Role" value={jobForm.position} onChange={e => setJobForm({...jobForm, position: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#24243e', border: 'none', color: 'white', borderRadius: '5px' }} />
                        <button type="submit" style={{ padding: '10px', background: '#00f2fe', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add</button>
                    </form>

                    {/* Job List */}
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {jobs.map(job => (
                            <div key={job._id} className="job-card" style={{ padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{job.company}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>{job.position}</p>
                                </div>
                                <span className="badge" style={{ 
                                    fontSize: '0.7rem', padding: '5px 10px', borderRadius: '10px',
                                    background: job.status === 'Offer' ? '#2ecc71' : '#f1c40f', color: '#000'
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