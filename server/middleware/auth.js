// server/middleware/auth.js

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Please log in to access this resource'
    });
};

// Middleware to check if user has BMSCE email
const isBMSCEEmail = (req, res, next) => {
    if (req.isAuthenticated() && req.user.email.endsWith('@bmsce.ac.in')) {
        return next();
    }
    res.status(403).json({ 
        error: 'Forbidden',
        message: 'Only BMSCE students can access this resource'
    });
};

module.exports = {
    isAuthenticated,
    isBMSCEEmail
};
