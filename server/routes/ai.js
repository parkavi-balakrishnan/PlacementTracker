const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// 👇 PASTE YOUR KEY HERE 👇
const API_KEY = "AIzaSyDS2xzjFWxKthqDBAspXABVkK_3jeP9oFU"; 

router.post('/plan', auth, async (req, res) => {
    const { targetCompany, resumeText, type } = req.body;
    
    console.log("🤖 AI Request Received...");

    // 1. Construct the Prompt
    let userPrompt = "";
    if (type === 'plan') {
        userPrompt = `Create a strict, week-by-week interview preparation plan for ${targetCompany}. Focus on DSA and Core subjects. Keep it concise.`;
    } else {
        userPrompt = `Review this resume and give 3 bullet points to fix: "${resumeText}".`;
    }

    // 2. The URL - We switched to "gemini-flash-latest" (The Free/Stable Version)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();

        // Check for specific error messages from Google
        if (data.error) {
            console.error("❌ Google API Error:", data.error.message);
            return res.status(500).json({ result: "AI Busy: " + data.error.message });
        }

        // Success!
        if (data.candidates && data.candidates.length > 0) {
            const aiText = data.candidates[0].content.parts[0].text;
            console.log("✅ AI Responded Successfully!");
            res.json({ result: aiText });
        } else {
            res.json({ result: "No response from AI." });
        }

    } catch (err) {
        console.error("❌ Network Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;