const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    routineName: { type: String, required: true,},
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
    isDefault: { type: Boolean, default: false },
    
}, { timestamps: true});

const Routine = mongoose.model('Routine', routineSchema, 'routines');

// routes
router.post('/add', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { userId, routineName, workouts , isDefault } = req.body;
        const newRoutine = new Routine({ userId, routineName, workouts, isDefault });
        const savedRoutine = await newRoutine.save();
        res.status(201).json({ message: 'Routine added successfully' , routine: savedRoutine});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-all', async (req, res) => {
    try {
        const routines = await Routine.find();
        res.status(200).json({routines});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-all-by-user/:userId', async (req, res) => {
    try {
        const routines = await Routine.find({ userId: req.params.userId });
        res.status(200).json({routines});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const routineId = req.params.id;
        const updates = req.body;
        const updatedRoutine = await Routine.findByIdAndUpdate(routineId, updates, { new: true });
        if (!updatedRoutine) {
            return res.status(404).json({ message: 'Routine not found' });
        }
        res.status(200).json({ message: 'Routine updated successfully', routine: updatedRoutine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;