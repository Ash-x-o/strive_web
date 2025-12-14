const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const workoutTrackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    routineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', required: true },
    workouts: { type: [{
            day: { type: String, default:""},
            type:{ type: String, default:""},
            exercises: [{ 
                exId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
                sets: [{ 
                    weight: { type: Number, required: true  },
                    reps: { type: Number, required: true },
                    status: { type: String, default: 'pending' }
                }],
                maxRep: { type: Number, default: 0 },
                minRep: { type: Number, default: 0 },
                weightUnit: { type: String, required: true },
                status: { type: String, default: 'pending' }
             }],
            status: { type: String, default: 'pending' }         
        }], required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'completed' },
    
}, { timestamps: true});

const WorkoutTrack = mongoose.model('WorkoutTrack', workoutTrackSchema, 'workout_tracks');

// routes
router.post('/add', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { userId, routineId, workouts, date } = req.body;
        const newWorkoutTrack = new WorkoutTrack({ userId, routineId, workouts, date });
        const savedWorkoutTrack = await newWorkoutTrack.save();
        res.status(201).json({ message: 'Workout track added successfully' , workoutTrack: savedWorkoutTrack});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-all', async (req, res) => {
    try {
        const workoutTracks = await WorkoutTrack.find();
        res.status(200).json({workoutTracks});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-all-by-user/:userId', async (req, res) => {
    try {
        const workoutTracks = await WorkoutTrack.find({ userId: req.params.userId });
        res.status(200).json({workoutTracks});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;