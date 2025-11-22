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
});

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;