const express = require('express');
const router = express.Router();
const { lessonDataManager } = require('../data/lessonsData');
const fs = require('fs');
const path = require('path');

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
  
  try {
    // First try to load from JSON file
    const dataDir = path.join(__dirname, '../../data');
    const lessonFile = path.join(dataDir, `lesson-${lessonId}.json`);
    
    if (fs.existsSync(lessonFile)) {
      const lessonData = JSON.parse(fs.readFileSync(lessonFile, 'utf8'));
      console.log('Loaded lesson content from JSON file:', lessonId);
      
      // Add base URL for file access and fix file paths
      const baseUrl = process.env.API_URL || 'https://content-studio-production-76b6.up.railway.app';
      
      // Fix file paths to include full URL
      const fixFilePaths = (content) => {
        if (!content) return content;
        
        // Fix presentation files
        if (content.presentation_url && !content.presentation_url.startsWith('http')) {
          content.presentation_url = `${baseUrl}${content.presentation_url}`;
        }
        if (content.file?.path && !content.file.path.startsWith('http')) {
          content.file.path = `${baseUrl}${content.file.path}`;
        }
        
        // Fix mindmap files
        if (content.mindmap_url && !content.mindmap_url.startsWith('http')) {
          content.mindmap_url = `${baseUrl}${content.mindmap_url}`;
        }
        
        // Fix video and image files
        if (content.files && Array.isArray(content.files)) {
          content.files = content.files.map(file => ({
            ...file,
            path: file.path && !file.path.startsWith('http') ? `${baseUrl}${file.path}` : file.path
          }));
        }
        
        return content;
      };
      
      // Fix all content file paths
      const fixedContent = {};
      Object.keys(lessonData.content || {}).forEach(key => {
        fixedContent[key] = fixFilePaths(lessonData.content[key]);
      });
      
      lessonData.content = fixedContent;
      lessonData.baseUrl = baseUrl;
      
      return res.json({
        success: true,
        data: lessonData,
        message: 'Lesson content loaded successfully from JSON file'
      });
    }
    
    // If no JSON file, try JavaScript data structure
    const lessonContent = lessonDataManager.getLesson(lessonId);
    
    if (lessonContent) {
      console.log('Loaded lesson content from JS data:', lessonId);
      return res.json({
        success: true,
        data: lessonContent,
        message: 'Lesson content retrieved successfully from JS data'
      });
    }
    
    // Return empty lesson if no content found
    const emptyLessonContent = {
      lessonId: lessonId,
      lessonTitle: 'Untitled Lesson',
      courseId: null,
      courseTitle: null,
      content: {
        video: null,
        text: null,
        presentation: null,
        mindmap: null,
        code: null,
        images: null
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        totalContent: 0,
        completedContent: 0,
        progress: 0,
        estimatedTime: '0 minutes',
        difficulty: 'beginner'
      }
    };

    res.json({
      success: true,
      data: emptyLessonContent,
      message: 'No lesson content found - returning empty lesson'
    });
  } catch (error) {
    console.error('Error loading lesson content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load lesson content',
      error: error.message
    });
  }
});

// POST /api/content/lesson/:lessonId - Save lesson content
router.post('/lesson/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  const contentData = req.body;
  
  try {
    // Create upload directories for this lesson if they don't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    const lessonDir = path.join(uploadsDir, 'lessons', lessonId);
    const contentTypes = ['presentations', 'mindmaps', 'images', 'videos', 'texts', 'codes'];
    
    // Create lesson directory and subdirectories
    if (!fs.existsSync(lessonDir)) {
      fs.mkdirSync(lessonDir, { recursive: true });
      console.log('Created lesson directory:', lessonDir);
    }
    
    // Create subdirectories for each content type
    contentTypes.forEach(type => {
      const typeDir = path.join(lessonDir, type);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
        console.log('Created content type directory:', typeDir);
      }
    });
    
    // Create or update lesson in JavaScript data structure
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
    
    // Update lesson in JavaScript data structure
    const updatedLesson = lessonDataManager.updateLesson(lessonId, lessonContent);
    
    // Also save to JSON file for persistence
    const dataDir = path.join(__dirname, '../../data');
    const lessonFile = path.join(dataDir, `lesson-${lessonId}.json`);
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save lesson to JSON file
    fs.writeFileSync(lessonFile, JSON.stringify(updatedLesson, null, 2));
    console.log('Lesson content saved to JSON file:', lessonFile);
    
    console.log('Lesson content saved to JS data structure:', lessonId);
    console.log('Created upload directories for lesson:', lessonId);
    
    res.json({
      success: true,
      data: updatedLesson,
      message: 'Lesson content saved successfully to both JS data structure and JSON file'
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

// GET /api/content/lesson/:lessonId/full - Get complete lesson data with all content
router.get('/lesson/:lessonId/full', (req, res) => {
  const { lessonId } = req.params;
  
  try {
    // Load lesson content
    const dataDir = path.join(__dirname, '../../data');
    const lessonFile = path.join(dataDir, `lesson-${lessonId}.json`);
    
    let lessonData = null;
    
    if (fs.existsSync(lessonFile)) {
      lessonData = JSON.parse(fs.readFileSync(lessonFile, 'utf8'));
    } else {
      // Try JavaScript data structure
      lessonData = lessonDataManager.getLesson(lessonId);
    }
    
    if (!lessonData) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    // Add comprehensive metadata and fix file paths
    const baseUrl = process.env.API_URL || 'https://content-studio-production-76b6.up.railway.app';
    const contentCount = Object.keys(lessonData.content || {}).filter(key => lessonData.content[key] !== null).length;
    
    // Fix file paths to include full URL
    const fixFilePaths = (content) => {
      if (!content) return content;
      
      // Fix presentation files
      if (content.presentation_url && !content.presentation_url.startsWith('http')) {
        content.presentation_url = `${baseUrl}${content.presentation_url}`;
      }
      if (content.file?.path && !content.file.path.startsWith('http')) {
        content.file.path = `${baseUrl}${content.file.path}`;
      }
      
      // Fix mindmap files
      if (content.mindmap_url && !content.mindmap_url.startsWith('http')) {
        content.mindmap_url = `${baseUrl}${content.mindmap_url}`;
      }
      
      // Fix video files
      if (content.files && Array.isArray(content.files)) {
        content.files = content.files.map(file => ({
          ...file,
          path: file.path && !file.path.startsWith('http') ? `${baseUrl}${file.path}` : file.path
        }));
      }
      
      return content;
    };
    
    // Fix all content file paths
    const fixedContent = {};
    Object.keys(lessonData.content || {}).forEach(key => {
      fixedContent[key] = fixFilePaths(lessonData.content[key]);
    });
    
    const fullLessonData = {
      ...lessonData,
      content: fixedContent,
      baseUrl,
      metadata: {
        ...lessonData.metadata,
        totalContent: contentCount,
        completedContent: contentCount,
        progress: contentCount > 0 ? 100 : 0,
        lastUpdated: lessonData.updatedAt || new Date().toISOString(),
        hasVideo: !!(lessonData.content?.video),
        hasText: !!(lessonData.content?.text),
        hasPresentation: !!(lessonData.content?.presentation),
        hasMindmap: !!(lessonData.content?.mindmap),
        hasCode: !!(lessonData.content?.code),
        hasImages: !!(lessonData.content?.images)
      }
    };
    
    console.log('Loaded full lesson data for:', lessonId);
    res.json({
      success: true,
      data: fullLessonData,
      message: 'Complete lesson data loaded successfully'
    });
    
  } catch (error) {
    console.error('Error loading full lesson data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load lesson data',
      error: error.message
    });
  }
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
