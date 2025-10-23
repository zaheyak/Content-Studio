const express = require('express');
const router = express.Router();
const contentPersistenceService = require('../services/contentPersistenceService');
const geminiService = require('../services/geminiService');

// Save lesson content format
router.post('/:lessonId/formats/:formatType', async (req, res) => {
  try {
    const { lessonId, formatType } = req.params;
    const { content, autoSave = false } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const savedContent = await contentPersistenceService.saveLessonContent(
      lessonId, 
      formatType, 
      content
    );

    // Auto-save if requested
    if (autoSave) {
      await contentPersistenceService.autoSave(lessonId, formatType, content);
    }

    res.json({
      success: true,
      data: savedContent
    });
  } catch (error) {
    console.error('Error saving lesson content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save lesson content'
    });
  }
});

// Load lesson content format
router.get('/:lessonId/formats/:formatType', async (req, res) => {
  try {
    const { lessonId, formatType } = req.params;
    
    const content = await contentPersistenceService.loadLessonContent(lessonId, formatType);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error loading lesson content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load lesson content'
    });
  }
});

// Load all lesson content formats
router.get('/:lessonId/formats', async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    // For now, return mock data if no content exists
    const allContent = await contentPersistenceService.loadAllLessonContent(lessonId);
    
    // If no content exists, return empty object
    if (!allContent || Object.keys(allContent).length === 0) {
      return res.json({
        success: true,
        data: {}
      });
    }
    
    res.json({
      success: true,
      data: allContent
    });
  } catch (error) {
    console.error('Error loading all lesson content:', error);
    // Return empty data instead of error for now
    res.json({
      success: true,
      data: {}
    });
  }
});

// Generate content using AI
router.post('/:lessonId/generate/:formatType', async (req, res) => {
  try {
    const { lessonId, formatType } = req.params;
    const { prompt, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    let generatedContent;
    
    switch (formatType) {
      case 'text':
        generatedContent = await geminiService.generateText(prompt, context);
        break;
      case 'code':
        generatedContent = await geminiService.generateCode(prompt, req.body.language || 'javascript');
        break;
      case 'presentation':
        generatedContent = await geminiService.generateSlides(prompt, req.body.slideCount || 4);
        break;
      case 'mindmap':
        generatedContent = await geminiService.generateMindMap(prompt);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported format type'
        });
    }

    // Auto-save generated content
    await contentPersistenceService.saveLessonContent(lessonId, formatType, {
      type: formatType,
      method: 'ai_generated',
      data: generatedContent,
      prompt,
      context,
      generatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: {
        content: generatedContent,
        formatType,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content'
    });
  }
});

// Save lesson progress
router.post('/:lessonId/progress', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { progress } = req.body;
    
    const savedProgress = await contentPersistenceService.saveLessonProgress(lessonId, progress);
    
    res.json({
      success: true,
      data: savedProgress
    });
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save lesson progress'
    });
  }
});

// Load lesson progress
router.get('/:lessonId/progress', async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    const progress = await contentPersistenceService.loadLessonProgress(lessonId);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error loading lesson progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load lesson progress'
    });
  }
});

module.exports = router;


