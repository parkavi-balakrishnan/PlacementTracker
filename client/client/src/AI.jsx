import { useState } from 'react';

const AI = () => {
  // 1. State for inputs
  const [targetCompany, setTargetCompany] = useState('');
  const [file, setFile] = useState(null); // 👈 Stores the selected PDF file
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'resume'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // 2. Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Get the first file selected
    }
  };

  // 3. The New Submit Function (Place this inside the component)
  const handleGenerate = async () => {
    setLoading(true);
    setResult('');

    // Get the token from local storage (if you use auth)
    const token = localStorage.getItem('token'); 

    // Create the "FormData" package to send the file
    const formData = new FormData();
    formData.append('type', activeTab); // 'plan' or 'resume'

    // Add data based on which tab is open
    if (activeTab === 'plan') {
      formData.append('targetCompany', targetCompany);
    } else if (activeTab === 'resume' && file) {
      formData.append('resume', file); // 👈 Attach the PDF file here
    }

    try {
      const res = await fetch('http://localhost:5001/api/ai/plan', {
        method: 'POST',
        headers: {
          // ⚠️ IMPORTANT: Do NOT set 'Content-Type': 'application/json' here
          // The browser sets the correct boundary for files automatically
          'Authorization': `Bearer ${token}` 
        },
        body: formData // 👈 Send the FormData object
      });

      const data = await res.json();
      
      if (res.ok) {
        setResult(data.result);
      } else {
        setResult("Error: " + data.result);
      }
      
    } catch (err) {
      console.error("Error:", err);
      setResult("Something went wrong. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDER ---
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Career Coach 🤖</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 rounded ${activeTab === 'plan' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Interview Plan
        </button>
        <button 
          onClick={() => setActiveTab('resume')}
          className={`px-4 py-2 rounded ${activeTab === 'resume' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Resume Review
        </button>
      </div>

      {/* Inputs */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {activeTab === 'plan' ? (
          <div>
            <label className="block mb-2 font-semibold">Target Company:</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              placeholder="e.g. Google, Amazon, TCS"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className="block mb-2 font-semibold">Upload Resume (PDF):</label>
            {/* 4. The File Input */}
            <input 
              type="file" 
              accept="application/pdf"
              className="w-full p-2 border rounded"
              onChange={handleFileChange}
            />
            <p className="text-sm text-gray-500 mt-1">Please upload a .pdf file</p>
          </div>
        )}

        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Generate AI Response'}
        </button>
      </div>

      {/* Results Display */}
      {result && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 whitespace-pre-line">
          <h3 className="font-bold text-lg mb-2">AI Suggestions:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default AI;