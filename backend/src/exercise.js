const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const upload = require("./upload");

const exerciseSchema = new mongoose.Schema({
    exName: { type: String, required: true,},
    exImage: { type: String, required: true },
    equipment: { type: String },
}, { timestamps: true});

const Exercise = mongoose.model('Exercise', exerciseSchema, 'exercises');

// routes
router.post('/add', upload.single("exImage"), async (req, res) => {
    try {
        const { exName, equipment } = req.body;
        let exImage;

        if (process.env.NODE_ENV === "production") {
          // Cloudinary returns full URL
          exImage = req.file.path;
        } else {
          // Local file name
          exImage = req.file.filename;
        }
        const newExercise = new Exercise({ exName, exImage, equipment });
        const savedExercise = await newExercise.save();
        res.status(201).json({ message: 'Exercise added successfully' , exercise: savedExercise});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/get-all', async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).json({exercises});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update/:id', upload.single("exImage"), async (req, res) => {
    try {
        const { id } = req.params;
        const { exName, equipment } = req.body;
        const updateData = { exName, equipment };
        if (req.file) {
            updateData.exImage = req.file.filename;
        }
        const updatedExercise = await Exercise.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: 'Exercise updated successfully', exercise: updatedExercise });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Exercise.findByIdAndDelete(id);
        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;