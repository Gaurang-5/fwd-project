// server/routes/chapters.js

const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const mongoose = require('mongoose');
const { isAuthenticated } = require('../middleware/auth');

// Validation middleware
const validateChapter = (req, res, next) => {
    const { title, chapterNumber, classNumber, unitName } = req.body;
    
    if (!title || !chapterNumber || !classNumber || !unitName) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['title', 'chapterNumber', 'classNumber', 'unitName']
        });
    }
    
    if (![9, 10].includes(parseInt(classNumber))) {
        return res.status(400).json({ error: 'classNumber must be 9 or 10' });
    }
    
    next();
};

// Validate ObjectId middleware
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid chapter ID' });
    }
    next();
};

// GET: Fetch all chapters with optional filtering (Protected)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const { classNumber, unitName, search } = req.query;
        const filter = {};
        
        if (classNumber) filter.classNumber = parseInt(classNumber);
        if (unitName) filter.unitName = unitName;
        
        // Text search if search query provided
        if (search) {
            filter.$text = { $search: search };
        }
        
        const chapters = await Chapter.find(filter)
            .sort({ classNumber: 1, chapterNumber: 1 })
            .lean()
            .exec(); // Explicit exec() for better performance
        
        // Add ETag for caching
        const etag = `"chapters-${chapters.length}-${Date.now()}"`;
        res.set('ETag', etag);
            
        res.json({
            success: true,
            count: chapters.length,
            data: chapters
        });
    } catch (err) {
        console.error('Error fetching chapters:', err);
        res.status(500).json({ error: 'Failed to fetch chapters' });
    }
});

// POST: Create a new chapter
router.post('/', validateChapter, async (req, res) => {
    try {
        const chapter = new Chapter(req.body);
        const newChapter = await chapter.save();
        
        res.status(201).json({
            success: true,
            message: 'Chapter created successfully',
            data: newChapter
        });
    } catch (err) {
        console.error('Error creating chapter:', err);
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: Object.values(err.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({ error: 'Failed to create chapter' });
    }
});

// GET: Fetch a single chapter by ID (Protected)
router.get('/:id', isAuthenticated, validateObjectId, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).lean();
        
        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }
        
        res.json({ success: true, data: chapter });
    } catch (err) {
        console.error('Error fetching chapter:', err);
        res.status(500).json({ error: 'Failed to fetch chapter' });
    }
});

// PUT: Update a chapter by ID
router.put('/:id', validateObjectId, validateChapter, async (req, res) => {
    try {
        const updatedChapter = await Chapter.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
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