const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const weightTrackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    weight: { type: Number, required: true },
}, { timestamps: true});

const WeightTrack = mongoose.model('WeightTrack', weightTrackSchema, 'weight_tracks');

// routes
router.post('/add', async (req, res) => {
    try {
        const { userId, date, weight } = req.body;
        const newWeightEntry = new WeightTrack({ userId, date, weight });
        const savedEntry = await newWeightEntry.save();
        res.status(201).json({savedEntry});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-by-user/:userId', async (req, res) => {
    try {
        const weightEntries = await WeightTrack.find({ userId: req.params.userId });
        res.status(200).json({weightEntries});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;