const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Content Studio API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/content', require('./routes/content'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/upload', require('../routes/upload'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Content Studio API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
