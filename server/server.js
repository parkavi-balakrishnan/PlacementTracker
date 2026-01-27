const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 👈 This is the key fixer
require('dotenv').config();

const app = express();

// 1. ALLOW EVERYONE (Fixes the connection error)
app.use(cors()); 
app.use(express.json());

// 2. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err));

// 3. Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/ai', require('./routes/ai')); // 👈 Ensures AI route is active

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));