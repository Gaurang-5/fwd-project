// server/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                // Only allow @bmsce.ac.in emails
                return v.endsWith('@bmsce.ac.in');
            },
            message: 'Only BMSCE email addresses (@bmsce.ac.in) are allowed'
        }
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
