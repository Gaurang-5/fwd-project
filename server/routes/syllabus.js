// server/routes/syllabus.js

const express = require('express');
const router = express.Router();
const Syllabus = require('../models/Syllabus');

// Validation middleware
const validateSyllabus = (req, res, next) => {
    const { classNumber, syllabusLink } = req.body;
    
    if (!classNumber || !syllabusLink) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['classNumber', 'syllabusLink']
        });
    }
    
    if (![9, 10].includes(parseInt(classNumber))) {
        return res.status(400).json({ error: 'classNumber must be 9 or 10' });
    }
    
    next();
};

// GET: Fetch all syllabus records
router.get('/', async (req, res) => {
    try {
        const syllabusRecords = await Syllabus.find().sort({ classNumber: 1 }).lean();
        
        res.json({
            success: true,
            count: syllabusRecords.length,
            data: syllabusRecords
        });
    } catch (err) {
        console.error('Error fetching syllabus:', err);
        res.status(500).json({ error: 'Failed to fetch syllabus records' });
    }
});

// GET: Fetch syllabus by class number
router.get('/:classNumber', async (req, res) => {
    try {
        const classNumber = parseInt(req.params.classNumber);
        
        if (![9, 10].includes(classNumber)) {
            return res.status(400).json({ error: 'classNumber must be 9 or 10' });
        }
        
        const syllabus = await Syllabus.findOne({ classNumber }).lean();
        
        if (!syllabus) {
            return res.status(404).json({ error: 'Syllabus not found for this class' });
        }
        
        res.json({ success: true, data: syllabus });
    } catch (err) {
        console.error('Error fetching syllabus:', err);
        res.status(500).json({ error: 'Failed to fetch syllabus' });
    }
});

// POST: Create or update syllabus for a class
router.post('/', validateSyllabus, async (req, res) => {
    try {
        const { classNumber, syllabusLink, academicYear } = req.body;
        
        // Use upsert to create or update
        const syllabus = await Syllabus.findOneAndUpdate(
            { classNumber: parseInt(classNumber) },
            { 
                syllabusLink,
                academicYear,
                lastUpdated: Date.now()
            },
            { 
                new: true, 
                upsert: true,
                runValidators: true
            }
        );
        
        res.status(201).json({
            success: true,
            message: 'Syllabus saved successfully',
            data: syllabus
        });
    } catch (err) {
        console.error('Error saving syllabus:', err);
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: Object.values(err.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({ error: 'Failed to save syllabus' });
    }
});

// PUT: Update syllabus for a class
router.put('/:classNumber', validateSyllabus, async (req, res) => {
    try {
        const classNumber = parseInt(req.params.classNumber);
        
        if (![9, 10].includes(classNumber)) {
            return res.status(400).json({ error: 'classNumber must be 9 or 10' });
        }
        
        const { syllabusLink, academicYear } = req.body;
        
        const updatedSyllabus = await Syllabus.findOneAndUpdate(
            { classNumber },
            { 
                syllabusLink,
                academicYear,
                lastUpdated: Date.now()
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedSyllabus) {
            return res.status(404).json({ error: 'Syllabus not found for this class' });
        }
        
        res.json({
            success: true,
            message: 'Syllabus updated successfully',
            data: updatedSyllabus
        });
    } catch (err) {
        console.error('Error updating syllabus:', err);
        res.status(400).json({ error: err.message });
    }
});

// DELETE: Delete syllabus for a class
router.delete('/:classNumber', async (req, res) => {
    try {
        const classNumber = parseInt(req.params.classNumber);
        
        if (![9, 10].includes(classNumber)) {
            return res.status(400).json({ error: 'classNumber must be 9 or 10' });
        }
        
        const deletedSyllabus = await Syllabus.findOneAndDelete({ classNumber });
        
        if (!deletedSyllabus) {
            return res.status(404).json({ error: 'Syllabus not found for this class' });
        }
        
        res.json({ 
            success: true,
            message: 'Syllabus deleted successfully' 
        });
    } catch (err) {
        console.error('Error deleting syllabus:', err);
        res.status(500).json({ error: 'Failed to delete syllabus' });
    }
});

module.exports = router;
