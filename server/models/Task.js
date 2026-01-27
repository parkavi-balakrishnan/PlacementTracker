const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    category: {
        type: String, // 'DSA', 'Core', 'Company'
        required: true
    },
    topic: {
        type: String, // e.g., 'Arrays', 'OS', 'Google'
        required: true
    },
    taskName: {
        type: String, // e.g., 'Solve LeetCode #1'
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('task', taskSchema);