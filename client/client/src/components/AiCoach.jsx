import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Animation Library
import { Sparkles, FileText, Send } from 'lucide-react'; // Cool Icons

const AiCoach = () => {
    const [company, setCompany] = useState('');
    const [resume, setResume] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('plan');

    const generateResponse = async () => {
        if(!company && !resume) return; // Prevent empty clicks
        setLoading(true);
        setResponse('');
        
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
            const body = { type: activeTab, targetCompany: company, resumeText: resume };

            // Your fixed URL
            const res = await axios.post('http://localhost:5001/api/ai/plan', body, config);
            
            setResponse(res.data.result.replace(/\*/g, '')); 
        } catch (err) {
            console.error(err);
            setResponse('⚠️ AI is taking a nap. Check the console for details.');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
            
            {/* 1. Header with Animation */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '40px' }}
            >
                <h1 style={{ fontSize: '3.5rem', margin: '0', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AI Career Coach
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Your personal placement assistant</p>
            </motion.div>

            {/* 2. Glass Card Container */}
            <div className="glass-card" style={{ padding: '30px' }}>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', justifyContent: 'center' }}>
                    <button 
                        onClick={() => setActiveTab('plan')}
                        className="neon-button"
                        style={{ padding: '12px 25px', background: activeTab === 'plan' ? '' : 'transparent', border: activeTab === 'plan' ? '' : '1px solid #475569', boxShadow: activeTab === 'plan' ? '' : 'none' }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}> <Sparkles size={18}/> Study Plan </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('resume')}
                        className="neon-button"
                        style={{ padding: '12px 25px', background: activeTab === 'resume' ? '' : 'transparent', border: activeTab === 'resume' ? '' : '1px solid #475569', boxShadow: activeTab === 'resume' ? '' : 'none' }}
                    >
                         <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}> <FileText size={18}/> Resume Review </span>
                    </button>
                </div>

                {/* Input Area */}
                {activeTab === 'plan' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 style={{ color: '#e2e8f0' }}>Target Company</h3>
                        <input 
                            type="text" 
                            placeholder="e.g. Google, Amazon, Zoho..." 
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '1rem', outline: 'none' }}
                        />
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 style={{ color: '#e2e8f0' }}>Paste Resume Text</h3>
                        <textarea 
                            rows="6"
                            placeholder="Paste your resume content here..." 
                            value={resume}
                            onChange={(e) => setResume(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                        />
                    </motion.div>
                )}

                <button 
                    onClick={generateResponse}
                    disabled={loading}
                    className="neon-button"
                    style={{ width: '100%', marginTop: '25px', padding: '15px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                >
                    {loading ? 'Analyzing...' : <>Generate Response <Send size={18}/></>}
                </button>
            </div>

            {/* 3. Response Area (Animated) */}
            {response && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ marginTop: '30px', padding: '30px', borderColor: '#6366f1' }}
                >
                    <h3 style={{ marginTop: 0, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={20}/> AI Suggestions
                    </h3>
                    <div style={{ lineHeight: '1.8', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                        {response}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AiCoach;