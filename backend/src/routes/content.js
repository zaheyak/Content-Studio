const express = require('express');
const mockData = require('../services/mockDataService');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/content - Get all content
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, course_id, author_id } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (course_id) filters.course_id = course_id;
    if (author_id) filters.author_id = author_id;
    
    // If user is not admin, only show their content
    if (req.user.role !== 'ADMIN') {
      filters.author_id = req.user.id;
    }
    
    const content = await mockData.getContent(filters);
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/v1/content/:id - Get content by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        course: {
          select: { id: true, title: true }
        },
        versions: {
          orderBy: { created_at: 'desc' },
          take: 5
        }
      }
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Check if user has access to this content
    if (req.user.role !== 'ADMIN' && content.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/v1/content - Create new content
router.post('/', auth, authorize('TRAINER', 'ADMIN'), async (req, res) => {
  try {
    const { title, description, type, content_data, course_id, tags, metadata } = req.body;
    
    // Validation
    if (!title || !type || !content_data) {
      return res.status(400).json({
        success: false,
        error: 'Title, type, and content_data are required'
      });
    }

    if (!['TEXT', 'PRESENTATION', 'VIDEO', 'AUDIO', 'INTERACTIVE'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content type'
      });
    }

    // If course_id is provided, verify course exists and user has access
    if (course_id) {
      const course = await mockData.getCourseById(course_id);

      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }

      if (req.user.role !== 'ADMIN' && course.author_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to course'
        });
      }
    }

    const content = await mockData.createContent({
      title,
      description,
      type,
      content_data,
      course_id: course_id || null,
      tags: tags || [],
      metadata: metadata || {},
      author_id: req.user.id
    });

    // Content created successfully

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/v1/content/:id - Update content
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content_data, status, tags, metadata } = req.body;
    
    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id }
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Check if user has access to this content
    if (req.user.role !== 'ADMIN' && existingContent.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content_data !== undefined) updateData.content_data = content_data;
    if (status !== undefined) updateData.status = status;
    if (tags !== undefined) updateData.tags = tags;
    if (metadata !== undefined) updateData.metadata = metadata;

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        course: {
          select: { id: true, title: true }
        }
      }
    });

    // Create new version if content_data changed
    if (content_data !== undefined) {
      const latestVersion = await prisma.contentVersion.findFirst({
        where: { content_id: id },
        orderBy: { version_number: 'desc' }
      });

      await prisma.contentVersion.create({
        data: {
          content_id: id,
          version_number: (latestVersion?.version_number || 0) + 1,
          content_data,
          created_by: req.user.id
        }
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/v1/content/:id - Delete content
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id }
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Check if user has access to this content
    if (req.user.role !== 'ADMIN' && existingContent.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    await prisma.content.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;


