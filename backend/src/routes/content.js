const express = require('express');
const router = express.Router();

// GET /api/content - Get content by type or lesson
router.get('/', (req, res) => {
  const { lessonId, type } = req.query;
  
  // Mock data for now - will be replaced with database queries
  const content = [
    {
      id: 'content-1',
      lessonId: lessonId || 'lesson-1',
      type: type || 'text',
      title: 'Introduction to Variables',
      content: 'JavaScript variables are containers for storing data values...',
      format: 'text',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 'content-2',
      lessonId: lessonId || 'lesson-1',
      type: 'presentation',
      title: 'Variables Presentation',
      content: 'https://example.com/presentation.pdf',
      format: 'pdf',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    }
  ];

  res.json({
    success: true,
    data: content,
    total: content.length
  });
});

// GET /api/content/lesson/:lessonId - Get all content for a specific lesson
router.get('/lesson/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  
  // Try to load from mock data first
  const { loadLessonContent } = require('../../mock-data/loader');
  const lessonContent = loadLessonContent(lessonId);
  
  if (lessonContent) {
    console.log('Loaded lesson content from mock data:', lessonId);
    return res.json({
      success: true,
      data: lessonContent,
      message: 'Lesson content retrieved successfully from mock data'
    });
  }
  
  // Fallback to default mock data
  const defaultLessonContent = {
    lessonId: lessonId,
    lesson: {
      id: lessonId,
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming',
      courseId: 'course-1'
    },
    content: {
      video: {
        id: 'content-video-1',
        type: 'video',
        title: 'Introduction Video',
        content: 'Welcome to JavaScript Fundamentals! In this lesson, we will cover...',
        url: 'https://example.com/video1.mp4',
        duration: '15:30',
        format: 'mp4',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      text: {
        id: 'content-text-1',
        type: 'text',
        title: 'Lesson Explanation',
        content: 'JavaScript is a high-level, interpreted programming language. It is primarily used for web development and can be used on both the client and server side...',
        format: 'text',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      presentation: {
        id: 'content-presentation-1',
        type: 'presentation',
        title: 'Key Concepts',
        content: 'https://example.com/presentation.pdf',
        slides: 25,
        format: 'pdf',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      mindmap: {
        id: 'content-mindmap-1',
        type: 'mindmap',
        title: 'Knowledge Map',
        content: 'https://example.com/mindmap.json',
        nodes: 12,
        format: 'json',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      code: {
        id: 'content-code-1',
        type: 'code',
        title: 'Code Examples',
        content: '// Basic JavaScript examples\nconst greeting = "Hello, World!";\nconsole.log(greeting);',
        language: 'javascript',
        format: 'js',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      images: {
        id: 'content-images-1',
        type: 'images',
        title: 'Visual Aids',
        content: [
          'https://example.com/image1.png',
          'https://example.com/image2.jpg'
        ],
        count: 2,
        format: 'png,jpg',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      }
    },
    template: {
      id: 'learning-flow',
      name: 'Learning Flow',
      description: 'Traditional learning progression from video to practice',
      formats: [
        { name: 'Video', icon: '🎥', order: 1 },
        { name: 'Explanation', icon: '🧾', order: 2 },
        { name: 'Code', icon: '💻', order: 3 },
        { name: 'Mind Map', icon: '🧠', order: 4 },
        { name: 'Image', icon: '🖼️', order: 5 },
        { name: 'Presentation', icon: '📊', order: 6 }
      ]
    },
    metadata: {
      totalContent: 6,
      completedContent: 4,
      progress: 67,
      estimatedTime: '45 minutes',
      difficulty: 'beginner',
      tags: ['javascript', 'programming', 'fundamentals']
    }
  };

  res.json({
    success: true,
    data: defaultLessonContent,
    message: 'Lesson content retrieved successfully (default)'
  });
});

// POST /api/content/lesson/:lessonId - Save lesson content
router.post('/lesson/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  const contentData = req.body;
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Create content structure
    const lessonContent = {
      lessonId: lessonId,
      lessonTitle: contentData.lessonTitle || 'Untitled Lesson',
      courseId: contentData.courseId || null,
      courseTitle: contentData.courseTitle || null,
      content: contentData.content || {},
      template: contentData.template || {
        id: 'learning-flow',
        name: 'Learning Flow',
        description: 'Traditional learning progression from video to practice',
        formats: [
          { name: 'Video', icon: '🎥', order: 1 },
          { name: 'Explanation', icon: '🧾', order: 2 },
          { name: 'Code', icon: '💻', order: 3 },
          { name: 'Mind Map', icon: '🧠', order: 4 },
          { name: 'Image', icon: '🖼️', order: 5 },
          { name: 'Presentation', icon: '📊', order: 6 }
        ]
      },
      createdAt: contentData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        totalContent: Object.keys(contentData.content || {}).length,
        completedContent: Object.values(contentData.content || {}).filter(c => c !== null).length,
        progress: Math.round((Object.values(contentData.content || {}).filter(c => c !== null).length / 6) * 100),
        estimatedTime: '45 minutes',
        difficulty: 'beginner'
      }
    };
    
    // Save to JSON file
    const contentPath = path.join(__dirname, '../../mock-data', `lesson-${lessonId}-content.json`);
    fs.writeFileSync(contentPath, JSON.stringify(lessonContent, null, 2));
    
    console.log('Lesson content saved to:', contentPath);
    
    res.json({
      success: true,
      data: lessonContent,
      message: 'Lesson content saved successfully'
    });
  } catch (error) {
    console.error('Error saving lesson content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save lesson content',
      error: error.message
    });
  }
});

// POST /api/content/upload - Upload content (manual upload)
router.post('/upload', (req, res) => {
  const { lessonId, type, content, metadata } = req.body;
  
  // Mock upload processing - will be replaced with actual file handling
  const uploadedContent = {
    id: `content-${Date.now()}`,
    lessonId,
    type,
    content,
    metadata,
    status: 'processing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: uploadedContent,
    message: 'Content uploaded successfully'
  });
});

// POST /api/content/generate - Generate content using AI
router.post('/generate', (req, res) => {
  const { lessonId, type, prompt, options } = req.body;
  
  // Mock AI generation - will be replaced with actual AI integration
  const generatedContent = {
    id: `content-${Date.now()}`,
    lessonId,
    type,
    content: `AI-generated content based on prompt: ${prompt}`,
    format: type,
    status: 'generated',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiMetadata: {
      model: 'gpt-4',
      prompt: prompt,
      options: options
    }
  };

  res.status(201).json({
    success: true,
    data: generatedContent,
    message: 'Content generated successfully'
  });
});

// GET /api/content/:id - Get specific content
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  // Mock data for now
  const content = {
    id,
    lessonId: 'lesson-1',
    type: 'text',
    title: 'Introduction to Variables',
    content: 'JavaScript variables are containers for storing data values...',
    format: 'text',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  };

  res.json({
    success: true,
    data: content
  });
});

// PUT /api/content/:id - Update content
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { content, metadata } = req.body;
  
  // Mock update - will be replaced with database operations
  const updatedContent = {
    id,
    content,
    metadata,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: updatedContent,
    message: 'Content updated successfully'
  });
});

// DELETE /api/content/:id - Delete content
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // Mock deletion - will be replaced with database operations
  res.json({
    success: true,
    message: 'Content deleted successfully'
  });
});

module.exports = router;
