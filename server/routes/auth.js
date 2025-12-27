// server/routes/auth.js

const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// @route   GET /auth/google
// @desc    Initiate Google OAuth
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account' // Force account selection
    })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login?error=access_denied',
        failureMessage: true
    }),
    (req, res) => {
        // Successful authentication - redirect to frontend homepage
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
        res.redirect(`${frontendUrl}/frontend/pages/index.html`);
    }
);

// @route   GET /auth/user
// @desc    Get current user info
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                picture: req.user.picture
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

// @route   GET /auth/logout
// @desc    Logout user
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Session destruction failed' });
            }
            res.clearCookie('sessionId'); // Clear the custom session cookie
            res.json({ message: 'Logged out successfully' });
        });
    });
});

// @route   GET /auth/check
// @desc    Check authentication status
router.get('/check', (req, res) => {
    res.json({ 
        authenticated: req.isAuthenticated(),
        user: req.isAuthenticated() ? {
            name: req.user.name,
            email: req.user.email,
            picture: req.user.picture
        } : null
    });
});

module.exports = router;
