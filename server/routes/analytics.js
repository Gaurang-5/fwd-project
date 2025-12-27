// server/routes/analytics.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET: Analytics Overview
router.get('/overview', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        
        // Users registered in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({ 
            createdAt: { $gte: sevenDaysAgo } 
        });

        // Users who logged in today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeToday = await User.countDocuments({ 
            lastLogin: { $gte: today } 
        });

        // Users who logged in this week
        const activeThisWeek = await User.countDocuments({ 
            lastLogin: { $gte: sevenDaysAgo } 
        });

        // Get registration trend (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const registrationTrend = await User.aggregate([
            {
                $match: { createdAt: { $gte: thirtyDaysAgo } }
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                newUsersThisWeek,
                activeToday,
                activeThisWeek,
                registrationTrend
            }
        });
    } catch (err) {
        console.error('Error fetching analytics overview:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// GET: All Users List
router.get('/users', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            sortBy = 'lastLogin', 
            order = 'desc',
            search = ''
        } = req.query;

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const totalUsers = await User.countDocuments(query);
        
        const users = await User.find(query)
            .select('-__v')
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .lean();

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalUsers / parseInt(limit)),
                    totalUsers,
                    usersPerPage: parseInt(limit)
                }
            }
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET: User Activity Stats
router.get('/activity', async (req, res) => {
    try {
        const now = new Date();
        
        // Active users by time period
        const periods = {
            today: new Date(now.setHours(0, 0, 0, 0)),
            thisWeek: new Date(now.setDate(now.getDate() - 7)),
            thisMonth: new Date(now.setMonth(now.getMonth() - 1)),
        };

        const activity = {};
        for (const [period, date] of Object.entries(periods)) {
            activity[period] = await User.countDocuments({ 
                lastLogin: { $gte: date } 
            });
        }

        // Most recent logins
        const recentLogins = await User.find()
            .select('name email lastLogin picture')
            .sort({ lastLogin: -1 })
            .limit(10)
            .lean();

        res.json({
            success: true,
            data: {
                activity,
                recentLogins
            }
        });
    } catch (err) {
        console.error('Error fetching activity stats:', err);
        res.status(500).json({ error: 'Failed to fetch activity stats' });
    }
});

module.exports = router;
