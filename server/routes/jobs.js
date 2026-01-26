const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // We will create this helper next!
const Job = require('../models/Job');

// @route   GET api/jobs
// @desc    Get all jobs for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        // Find jobs where the "user" ID matches the logged-in person
        const jobs = await Job.find({ user: req.user.id }).sort({ date: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/jobs
// @desc    Add a new job
router.post('/', auth, async (req, res) => {
    const { company, position, status } = req.body;

    try {
        const newJob = new Job({
            company,
            position,
            status,
            user: req.user.id // Attach the user's ID
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;