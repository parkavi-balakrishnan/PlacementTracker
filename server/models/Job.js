const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' // This links the Job to the User who added it
    },
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Applied' // Default status is "Applied"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('job', jobSchema);