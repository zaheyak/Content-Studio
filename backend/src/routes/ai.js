const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// Generate text content
router.post('/generate-text', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const generatedText = await geminiService.generateText(prompt, context);
    
    res.json({
      success: true,
      data: {
        content: generatedText,
        wordCount: generatedText.split(' ').length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Text generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate text content'
    });
  }
});

// Generate code
router.post('/generate-code', async (req, res) => {
  try {
    const { prompt, language = 'javascript' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const generatedCode = await geminiService.generateCode(prompt, language);
    
    res.json({
      success: true,
      data: {
        code: generatedCode,
        language,
        lineCount: generatedCode.split('\n').length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate code'
    });
  }
});

// Generate presentation slides
router.post('/generate-slides', async (req, res) => {
  try {
    const { prompt, slideCount = 4 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const generatedSlides = await geminiService.generateSlides(prompt, slideCount);
    
    res.json({
      success: true,
      data: {
        slides: generatedSlides.slides || generatedSlides,
        slideCount: generatedSlides.slides?.length || generatedSlides.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Slide generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate slides'
    });
  }
});

// Generate mind map
router.post('/generate-mindmap', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const generatedMindMap = await geminiService.generateMindMap(prompt);
    
    res.json({
      success: true,
      data: {
        nodes: generatedMindMap.nodes,
        connections: generatedMindMap.connections,
        nodeCount: generatedMindMap.nodes.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Mind map generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate mind map'
    });
  }
});

// Transcribe video/audio
router.post('/transcribe', async (req, res) => {
  try {
    const { audioFile } = req.body;
    
    if (!audioFile) {
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      });
    }

    const transcription = await geminiService.transcribeVideo(audioFile);
    
    res.json({
      success: true,
      data: {
        transcription,
        wordCount: transcription.split(' ').length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transcribe audio'
    });
  }
});

module.exports = router;

