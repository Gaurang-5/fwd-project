// backend/routes/chapters.js

const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');

// GET: Fetch all chapters
router.get('/', async (req, res) => {
    try {
        const chapters = await Chapter.find().sort({ classNumber: 1, chapterNumber: 1 });
        res.json(chapters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Create a new chapter
router.post('/', async (req, res) => {
    const chapter = new Chapter({
        title: req.body.title,
        chapterNumber: req.body.chapterNumber,
        classNumber: req.body.classNumber,
        unitName: req.body.unitName,
        videoLink: req.body.videoLink,
        notesLink: req.body.notesLink,
        questionsLink: req.body.questionsLink
    });
    try {
        const newChapter = await chapter.save();
        res.status(201).json(newChapter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET: Fetch a single chapter by ID
router.get('/:id', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) return res.status(404).json({ message: 'Cannot find chapter' });
        res.json(chapter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT: Update a chapter by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedChapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedChapter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Delete a chapter by ID
router.delete('/:id', async (req, res) => {
    try {
        await Chapter.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Chapter' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;