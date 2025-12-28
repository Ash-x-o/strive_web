const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let original = file.originalname.toLowerCase();

    // replace spaces with underscores
    original = original.replace(/\s+/g, "_");

    // add timestamp to avoid duplicates
    const uniqueName = original + "_" + Date.now();

    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


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
        const exImage = req.file.filename;
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




module.exports = router;