const express = require('express');
const mockUsers = require('../data/mockUsers.json');

const router = express.Router();

// GET /api/v1/users - Get all users (mock data)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    
    let filteredUsers = mockUsers;
    if (role) {
      filteredUsers = mockUsers.filter(user => user.role === role);
    }
    
    const skip = (page - 1) * limit;
    const users = filteredUsers.slice(skip, skip + parseInt(limit));
    const total = filteredUsers.length;

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// GET /api/v1/users/mock - Get mock users for role selection
router.get('/mock', async (req, res) => {
  try {
    res.json({
      success: true,
      data: mockUsers
    });
  } catch (error) {
    console.error('Error fetching mock users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock users'
    });
  }
});

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// PUT /api/v1/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user in mock data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: mockUsers[userIndex]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = mockUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    mockUsers.splice(userIndex, 1);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

module.exports = router;

