const MockAIService = require('../../src/infrastructure/external/MockAIService');

describe('MockAIService', () => {
  let aiService;

  beforeEach(() => {
    aiService = new MockAIService();
    aiService.setProcessingTime(10); // Fast processing for tests
  });

  describe('enhanceText', () => {
    test('should enhance text successfully', async () => {
      const text = 'Original text content';
      const result = await aiService.enhanceText(text);
      
      expect(result).toContain('Enhanced:');
      expect(result).toContain(text);
      expect(result).toContain('AI assistance');
    });
  });

  describe('generatePresentation', () => {
    test('should generate presentation successfully', async () => {
      const content = 'This is a long content that will be used to generate a presentation with multiple slides and sections.';
      const result = await aiService.generatePresentation(content);
      
      expect(result).toHaveProperty('slides');
      expect(result.slides).toHaveLength(3);
      expect(result.slides[0]).toHaveProperty('title', 'Introduction');
      expect(result.slides[0]).toHaveProperty('content');
      expect(result.slides[0]).toHaveProperty('notes');
      expect(result).toHaveProperty('format', 'json');
    });
  });

  describe('generateMindMap', () => {
    test('should generate mind map successfully', async () => {
      const content = 'Main topic with concepts and ideas';
      const result = await aiService.generateMindMap(content);
      
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('connections');
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0]).toHaveProperty('id', 'root');
      expect(result.nodes[0]).toHaveProperty('label', 'Main Topic');
      expect(result.nodes[0]).toHaveProperty('position');
      expect(result.nodes[0]).toHaveProperty('children');
      expect(result).toHaveProperty('format', 'json');
    });
  });

  describe('translateContent', () => {
    test('should translate content successfully', async () => {
      const content = 'Hello world';
      const targetLanguage = 'es';
      const result = await aiService.translateContent(content, targetLanguage);
      
      expect(result).toContain('[Translated to es]');
      expect(result).toContain(content);
    });
  });

  describe('checkQuality', () => {
    test('should check content quality successfully', async () => {
      const content = 'High quality educational content';
      const result = await aiService.checkQuality(content);
      
      expect(result).toHaveProperty('originality');
      expect(result).toHaveProperty('clarity');
      expect(result).toHaveProperty('difficulty');
      expect(result).toHaveProperty('structure');
      expect(result).toHaveProperty('overallScore');
      expect(result).toHaveProperty('suggestions');
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.overallScore).toBeLessThanOrEqual(1);
    });
  });

  describe('generateAudio', () => {
    test('should generate audio successfully', async () => {
      const text = 'This is a text that will be converted to audio';
      const result = await aiService.generateAudio(text);
      
      expect(result).toHaveProperty('audioUrl');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('format', 'mp3');
      expect(result).toHaveProperty('quality', 'high');
      expect(result.audioUrl).toContain('mock-audio-service.com');
      expect(result.duration).toBeGreaterThan(0);
    });
  });

  describe('generateVideo', () => {
    test('should generate video successfully', async () => {
      const content = 'This is content that will be converted to video';
      const result = await aiService.generateVideo(content);
      
      expect(result).toHaveProperty('videoUrl');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('format', 'mp4');
      expect(result).toHaveProperty('quality', '1080p');
      expect(result).toHaveProperty('thumbnail');
      expect(result.videoUrl).toContain('mock-video-service.com');
      expect(result.duration).toBeGreaterThan(0);
    });
  });

  describe('getStatus', () => {
    test('should return service status', () => {
      const status = aiService.getStatus();
      
      expect(status).toHaveProperty('status', 'healthy');
      expect(status).toHaveProperty('processingTime', 10);
      expect(status).toHaveProperty('lastCheck');
      expect(new Date(status.lastCheck)).toBeInstanceOf(Date);
    });
  });

  describe('setProcessingTime', () => {
    test('should set processing time', () => {
      aiService.setProcessingTime(500);
      const status = aiService.getStatus();
      
      expect(status.processingTime).toBe(500);
    });
  });
});
