// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- 1. IMPORT CORS
require('dotenv').config();

const app = express();
const PORT = 3000;

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});

// --- Middleware ---
app.use(cors()); // <-- 2. USE CORS. This allows requests from other origins.
app.use(express.json());

// --- Routes ---
const chapterRoutes = require('./routes/chapters');
app.use('/api/chapters', chapterRoutes); // <-- 3. YOUR API ROUTE

// --- Test Route ---
app.get('/', (req, res) => {
    res.send("Hello World! The backend server is running.");
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});