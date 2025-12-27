// server/config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Extract email from profile
        const email = profile.emails[0].value;
        
        // Check if email ends with @bmsce.ac.in
        if (!email.endsWith('@bmsce.ac.in')) {
            return done(null, false, { 
                message: 'Access denied. Only BMSCE email addresses (@bmsce.ac.in) are allowed.' 
            });
        }

        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // Update last login
            user.lastLogin = Date.now();
            await user.save();
            return done(null, user);
        }

        // Create new user
        user = await User.create({
            googleId: profile.id,
            email: email,
            name: profile.displayName,
            picture: profile.photos[0]?.value
        });

        done(null, user);
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        done(err, null);
    }
}));

module.exports = passport;
