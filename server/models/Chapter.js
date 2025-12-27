// backend/models/Chapter.js

const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    chapterNumber: {
        type: Number,
        required: true
    },
    classNumber: {
        type: Number,
        required: true,
        enum: [9, 10]
    },
    unitName: {
        type: String,
        required: true
    },
    videoLink: {
        type: String,
        trim: true
    },
    notesLink: {
        type: String,
        trim: true
    },
    questionsLink: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Add createdAt and updatedAt
});

// --- Performance: Add indexes for frequently queried fields ---
// Compound index for filtering by class and sorting by chapter number
chapterSchema.index({ classNumber: 1, chapterNumber: 1 });

// Index for filtering by unit name
chapterSchema.index({ unitName: 1 });

// Compound index for class + unit filtering
chapterSchema.index({ classNumber: 1, unitName: 1 });

// Text index for search functionality
chapterSchema.index({ title: 'text', unitName: 'text' });

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;