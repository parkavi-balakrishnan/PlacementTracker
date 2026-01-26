require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Better CORS (Allows your frontend explicitly)
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(express.json());

// 2. DEBUG LOGGER (Prints whenever a request hits the server)
app.use((req, res, next) => {
    console.log(`👉 HIT: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

const DB_LINK = process.env.MONGO_URI; 

mongoose.connect(DB_LINK)
  .then(() => console.log('✅✅✅ MongoDB Connected Successfully! ✅✅✅'))
  .catch((err) => console.error('❌ MongoDB Connection Failed:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));