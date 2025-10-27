const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();



const app = express();
const PORT = process.env.PORT || 3001;
// ✅ בדיקה האם ה-OpenAI API Key נטען
console.log("OpenAI key detected:", !!process.env.OPENAI_API_KEY);
console.log("Environment variables with 'API' in name:", Object.keys(process.env).filter(key => key.includes('API')));
console.log("All environment variables:", Object.keys(process.env).sort());
// DEBUG: Show OpenAI SDK info
try {
  // Try to get package info without the .js extension
  const pkg = require("openai/package.json");
  console.log("📦 OpenAI SDK version:", pkg.version);
} catch (pkgErr) {
  console.log("📦 Could not read OpenAI package.json, but SDK should still work");
}

try {
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("🤖 OpenAI model test: Ready for requests");
  } else {
    console.log("🤖 OpenAI model test: NO API key");
  }
} catch (err) {
  console.error("❌ OpenAI SDK initialization error:", err.message);
}

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

// Logo endpoint
app.get('/api/logo/:type', (req, res) => {
  const { type } = req.params;
  const logoPath = path.join(__dirname, '../uploads/content');
  
  let logoFile;
  if (type === 'dark') {
    logoFile = 'logo-dark.jpg';
  } else if (type === 'light') {
    logoFile = 'logo-light.jpg';
  } else {
    return res.status(400).json({ error: 'Invalid logo type. Use "dark" or "light"' });
  }
  
  const fullPath = path.join(logoPath, logoFile);
  
  // Check if file exists
  if (!require('fs').existsSync(fullPath)) {
    return res.status(404).json({ error: 'Logo file not found' });
  }
  
  // Send the logo file
  res.sendFile(fullPath);
});

// Logo info endpoint
app.get('/api/logo', (req, res) => {
  const logoPath = path.join(__dirname, '../uploads/content');
  const fs = require('fs');
  
  const logos = {
    dark: fs.existsSync(path.join(logoPath, 'logo-dark.jpg')),
    light: fs.existsSync(path.join(logoPath, 'logo-light.jpg'))
  };
  
  res.json({
    success: true,
    data: {
      logos,
      darkUrl: '/api/logo/dark',
      lightUrl: '/api/logo/light'
    }
  });
});

// API Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/content', require('./routes/content'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/upload', require('./routes/upload'));

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
