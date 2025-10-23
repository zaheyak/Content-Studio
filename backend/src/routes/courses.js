const express = require('express');
const mockCourses = require('../data/mockCourses.json');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/courses - Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const { status, author_id, page = 1, limit = 10 } = req.query;
    
    const where = {};
    
    if (status) where.status = status;
    if (author_id) where.author_id = author_id;
    
    // If user is not admin, only show their courses
    if (req.user.role !== 'ADMIN') {
      where.author_id = req.user.id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await mockData.getCourses(where);

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/v1/courses/:id - Get course by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        content: {
          orderBy: { created_at: 'desc' },
          include: {
            author: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check if user has access to this course
    if (req.user.role !== 'ADMIN' && course.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/v1/courses - Create new course
router.post('/', auth, authorize('TRAINER', 'ADMIN'), async (req, res) => {
  try {
    const { title, description, status = 'DRAFT', metadata } = req.body;
    
    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    if (!['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const course = await mockData.createCourse({
      title,
      description,
      status,
      author_id: req.user.id,
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/v1/courses/:id - Update course
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, metadata } = req.body;
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check if user has access to this course
    if (req.user.role !== 'ADMIN' && existingCourse.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (metadata !== undefined) updateData.metadata = metadata;

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        content: {
          select: { id: true, title: true, type: true, status: true }
        }
      }
    });

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/v1/courses/:id - Delete course
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check if user has access to this course
    if (req.user.role !== 'ADMIN' && existingCourse.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    await prisma.course.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/v1/courses/:id/content - Get course content
router.get('/:id/content', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, status, page = 1, limit = 10 } = req.query;
    
    // Check if course exists and user has access
    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    if (req.user.role !== 'ADMIN' && course.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const where = { course_id: id };
    if (type) where.type = type;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.content.count({ where })
    ]);

    res.json({
      success: true,
      data: content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get course content error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;


