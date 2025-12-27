// server/index.js

// Load environment variables FIRST before anything else
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Performance & Security Middleware ---

// Enable gzip compression for all responses (reduces payload size by 60-80%)
app.use(compression({
    level: 6, // Compression level (1-9, 6 is a good balance)
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Security headers (helps prevent common attacks)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disable CSP for development
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));

// Body parsers with optimized limits
app.use(express.json({ limit: '5mb' })); // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Session configuration with optimized settings
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset session expiry on each request
    cookie: {
        secure: false, // Set to false for localhost (both http on port 8000 and 3000)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        domain: 'localhost' // Explicitly set domain for Firefox compatibility
    },
    name: 'sessionId' // Use a custom session name
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Performance: Add cache headers for API responses
app.use('/api', (req, res, next) => {
    // Set cache headers based on request method
    if (req.method === 'GET') {
        // Cache GET requests for 5 minutes
        res.set('Cache-Control', 'private, max-age=300');
        res.set('Vary', 'Accept-Encoding');
    } else {
        // No caching for mutations
        res.set('Cache-Control', 'no-store');
    }
    next();
});

// Request logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// --- Database Connection with Optimized Settings ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10, // Connection pool size
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000, // Socket timeout
            bufferCommands: false // Disable buffering for faster errors
        });
        console.log('✅ Successfully connected to MongoDB Atlas!');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

// --- Routes ---
const chapterRoutes = require('./routes/chapters');
const syllabusRoutes = require('./routes/syllabus');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');

app.get('/', (req, res) => {
    res.json({
        message: 'BMSCE API Server',
        version: '1.0.0',
        status: 'running',
        authenticated: req.isAuthenticated(),
        endpoints: {
            auth: '/auth',
            chapters: '/api/chapters',
            syllabus: '/api/syllabus',
            analytics: '/api/analytics'
        }
    });
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date() });
});

app.use('/auth', authRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// --- Start Server ---
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});