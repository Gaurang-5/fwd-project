// server/models/Syllabus.js

const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
    classNumber: {
        type: Number,
        required: true,
        unique: true,
        enum: [9, 10]
    },
    syllabusLink: {
        type: String,
        required: true,
        trim: true
    },
    academicYear: {
        type: String,
        trim: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const Syllabus = mongoose.model('Syllabus', syllabusSchema);

module.exports = Syllabus;
