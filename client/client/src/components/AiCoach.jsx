import React, { useState } from 'react';
import axios from 'axios';

const AiCoach = () => {
    const [company, setCompany] = useState('');
    const [resume, setResume] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'resume'

    const generateResponse = async () => {
        setLoading(true);
        setResponse('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
            
            const body = {
                type: activeTab,
                targetCompany: company,
                resumeText: resume
            };

            const res = await axios.post('http://localhost:5001/api/ai/plan', body, config);
            
            // Format the text slightly for better reading
            setResponse(res.data.result.replace(/\*/g, '')); 
        } catch (err) {
            console.error(err);
            setResponse('Error generating plan. Try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', color: 'white' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2.5rem', background: '-webkit-linear-gradient(45deg, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                🤖 AI Career Coach
            </h1>

            {/* TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                <button 
                    onClick={() => setActiveTab('plan')}
                    style={{ padding: '10px 20px', background: activeTab === 'plan' ? '#4facfe' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
                >
                    📅 Study Planner
                </button>
                <button 
                    onClick={() => setActiveTab('resume')}
                    style={{ padding: '10px 20px', background: activeTab === 'resume' ? '#ff00cc' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
                >
                    📄 Resume Review
                </button>
            </div>

            {/* INPUT AREA */}
            <div className="job-card" style={{ padding: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                
                {activeTab === 'plan' ? (
                    <div>
                        <h3>Target Company</h3>
                        <input 
                            type="text" 
                            placeholder="e.g. Google, Amazon, TCS..." 
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: '#1e1e2e', color: 'white' }}
                        />
                    </div>
                ) : (
                    <div>
                        <h3>Paste Your Resume Content</h3>
                        <textarea 
                            rows="6"
                            placeholder="Paste your resume text here..." 
                            value={resume}
                            onChange={(e) => setResume(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: '#1e1e2e', color: 'white' }}
                        />
                    </div>
                )}

                <button 
                    onClick={generateResponse}
                    disabled={loading}
                    style={{ marginTop: '20px', width: '100%', padding: '15px', background: loading ? 'grey' : 'linear-gradient(to right, #4facfe, #00f2fe)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                    {loading ? 'Thinking... 🧠' : activeTab === 'plan' ? 'Generate Plan 🚀' : 'Analyze Resume 🔍'}
                </button>
            </div>

            {/* RESPONSE AREA */}
            {response && (
                <div style={{ marginTop: '40px', padding: '25px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3>💡 AI Suggestions:</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#ddd' }}>
                        {response}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default AiCoach;