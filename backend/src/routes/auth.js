const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mockData = require('../services/mockDataService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/v1/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'LEARNER' } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    if (!['TRAINER', 'LEARNER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be TRAINER, LEARNER, or ADMIN'
      });
    }

    // Check if user already exists
    const existingUser = await mockData.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
    const user = await mockData.createUser({
      name,
      email,
      password,
      role
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        ...user,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
});

// POST /api/v1/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await mockData.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password (simple comparison for mock data)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
});

// POST /api/v1/auth/logout - Logout user
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// GET /api/v1/auth/me - Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profile_data: req.user.profile_data,
        preferences: req.user.preferences
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;


