const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const multer = require('multer');
const pdfParse = require('pdf-parse');
require('dotenv').config();

// Configure Multer to store file in memory (RAM) temporarily
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

const API_KEY = process.env.GEMINI_API_KEY;

// Handle file upload errors
router.post('/plan', auth, (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ result: "File too large. Maximum size is 5MB." });
            }
            return res.status(400).json({ result: "File upload error: " + err.message });
        } else if (err) {
            return res.status(400).json({ result: err.message });
        }
        next();
    });
}, async (req, res) => {
    const { targetCompany, type, resumeText: textResume } = req.body;
    
    // We try to get text from EITHER a file OR a text input
    let resumeText = textResume || "";

    console.log("🤖 AI Request Type:", type);

    // --- 1. PDF Text Extraction ---
    if (req.file) {
        try {
            console.log("📄 Processing PDF file...");
            const pdfData = await pdfParse(req.file.buffer);
            resumeText = pdfData.text.trim(); // We extracted the text!
            console.log("✅ PDF Parsed. Text length:", resumeText.length);
            
            if (!resumeText || resumeText.length === 0) {
                return res.status(400).json({ result: "Could not extract text from PDF. The PDF might be image-based or empty." });
            }
        } catch (error) {
            console.error("❌ PDF Parse Error:", error);
            return res.status(500).json({ result: "Failed to read PDF file: " + error.message });
        }
    }

    // --- 2. Validation ---
    if (!API_KEY) {
        return res.status(500).json({ result: "Server Error: API Key missing." });
    }
    
    if (type === 'plan' && !targetCompany) {
        return res.status(400).json({ result: "Please provide a target company." });
    }
    
    // If no text found from file OR input
    if (type === 'resume' && !resumeText) {
        return res.status(400).json({ result: "Please upload a PDF resume or paste resume text." });
    }

    // --- 3. Build Prompt ---
    let userPrompt = "";
    if (type === 'plan') {
        userPrompt = `Create a strict, week-by-week interview preparation plan for ${targetCompany}. Focus on DSA and Core subjects.`;
    } else {
        // We limit the text to 10,000 characters to avoid hitting limits
        const cleanResume = resumeText.substring(0, 10000); 
        userPrompt = `Review this resume and give 3 specific, actionable bullet points to fix (Focus on formatting, keywords, and impact). Here is the resume text: \n\n"${cleanResume}"`;
    }

    try {
        console.log(`🌐 Connecting to Gemini 1.5 Flash...`);

        // --- 4. Call Google API (Gemini 1.5 Flash) ---
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: userPrompt }] }]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiText) {
            console.log("✅ AI Response Success!");
            res.json({ result: aiText });
        } else {
            console.warn("⚠️ AI responded but content was empty.");
            res.status(500).json({ result: "AI response was empty." });
        }

    } catch (err) {
        console.error("❌ AI Error Details:");
        if (err.response) {
            console.error(JSON.stringify(err.response.data, null, 2));
            if (err.response.status === 404) {
                return res.status(500).json({ result: "Model not found. Try updating the model name in ai.js." });
            }
        } else {
            console.error(err.message);
        }
        res.status(500).json({ result: "AI Service Error. Check server logs for details." });
    }
});

module.exports = router;