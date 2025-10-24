const CreateCourseUseCase = require('../../src/application/use-cases/CreateCourseUseCase');
const ProcessContentUseCase = require('../../src/application/use-cases/ProcessContentUseCase');
const MockAIService = require('../../src/infrastructure/external/MockAIService');

describe('Enhanced Integration Tests', () => {
  let mockCourseRepository;
  let mockContentRepository;
  let aiService;
  let createCourseUseCase;
  let processContentUseCase;

  beforeEach(() => {
    // Enhanced mock repositories with more realistic behavior
    mockCourseRepository = {
      save: jest.fn(),
      findByTrainerId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn()
    };
    
    mockContentRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findByLessonId: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn()
    };

    aiService = new MockAIService();
    aiService.setProcessingTime(10);

    createCourseUseCase = new CreateCourseUseCase(mockCourseRepository);
    processContentUseCase = new ProcessContentUseCase(mockContentRepository, aiService);
  });

  describe('Complete Content Creation Workflow', () => {
    test('should handle end-to-end content creation with AI processing', async () => {
      // Step 1: Create course
      const courseInput = {
        title: 'Advanced JavaScript Programming',
        description: 'Comprehensive course on modern JavaScript development',
        trainerId: 'trainer-123'
      };

      mockCourseRepository.findByTrainerId.mockResolvedValue([]);
      mockCourseRepository.save.mockResolvedValue({
        id: 'course-123',
        title: courseInput.title,
        description: courseInput.description,
        trainerId: courseInput.trainerId,
        status: 'draft',
        toJSON: () => ({
          id: 'course-123',
          title: courseInput.title,
          description: courseInput.description,
          trainerId: courseInput.trainerId,
          status: 'draft'
        })
      });

      const courseResult = await createCourseUseCase.execute(courseInput);
      expect(courseResult.success).toBe(true);
      expect(courseResult.data.title).toBe(courseInput.title);

      // Step 2: Create multiple content types
      const contentTypes = [
        {
          type: 'text',
          title: 'JavaScript Fundamentals',
          content: 'Introduction to JavaScript programming concepts',
          format: 'markdown'
        },
        {
          type: 'presentation',
          title: 'JavaScript Concepts Presentation',
          content: 'Key concepts in JavaScript programming',
          format: 'json'
        },
        {
          type: 'mindmap',
          title: 'JavaScript Learning Path',
          content: 'Visual representation of JavaScript learning journey',
          format: 'json'
        }
      ];

      const contentResults = [];
      for (const contentInput of contentTypes) {
        const fullContentInput = {
          lessonId: 'lesson-123',
          trainerId: 'trainer-123',
          ...contentInput
        };

        mockContentRepository.save.mockResolvedValue({
          id: `content-${Date.now()}-${Math.random()}`,
          lessonId: fullContentInput.lessonId,
          trainerId: fullContentInput.trainerId,
          type: { value: fullContentInput.type },
          title: fullContentInput.title,
          content: fullContentInput.content,
          format: fullContentInput.format,
          toJSON: () => ({
            id: `content-${Date.now()}-${Math.random()}`,
            lessonId: fullContentInput.lessonId,
            trainerId: fullContentInput.trainerId,
            type: fullContentInput.type,
            title: fullContentInput.title,
            content: fullContentInput.content,
            format: fullContentInput.format
          })
        });

        const result = await processContentUseCase.execute(fullContentInput);
        contentResults.push(result);
      }

      expect(contentResults).toHaveLength(3);
      expect(contentResults.every(result => result.success)).toBe(true);
    });

    test('should handle content processing with different AI services', async () => {
      const contentInput = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Multi-format Content',
        content: 'This content will be processed by multiple AI services',
        format: 'markdown'
      };

      mockContentRepository.save.mockResolvedValue({
        id: 'content-123',
        lessonId: contentInput.lessonId,
        trainerId: contentInput.trainerId,
        type: { value: contentInput.type },
        title: contentInput.title,
        content: contentInput.content,
        format: contentInput.format,
        toJSON: () => ({
          id: 'content-123',
          lessonId: contentInput.lessonId,
          trainerId: contentInput.trainerId,
          type: contentInput.type,
          title: contentInput.title,
          content: contentInput.content,
          format: contentInput.format
        })
      });

      const result = await processContentUseCase.execute(contentInput);
      expect(result.success).toBe(true);

      // Test AI service integration
      const enhancedText = await aiService.enhanceText(contentInput.content);
      expect(enhancedText).toContain('Enhanced:');

      const presentation = await aiService.generatePresentation(contentInput.content);
      expect(presentation).toHaveProperty('slides');

      const mindMap = await aiService.generateMindMap(contentInput.content);
      expect(mindMap).toHaveProperty('nodes');

      const quality = await aiService.checkQuality(contentInput.content);
      expect(quality).toHaveProperty('overallScore');
    });
  });

  describe('Error Recovery and Resilience', () => {
    test('should handle AI service failures gracefully', async () => {
      const contentInput = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Test Content',
        content: 'Content for testing AI failure',
        format: 'markdown'
      };

      mockContentRepository.save.mockResolvedValue({
        id: 'content-123',
        lessonId: contentInput.lessonId,
        trainerId: contentInput.trainerId,
        type: { value: contentInput.type },
        title: contentInput.title,
        content: contentInput.content,
        format: contentInput.format,
        toJSON: () => ({
          id: 'content-123',
          lessonId: contentInput.lessonId,
          trainerId: contentInput.trainerId,
          type: contentInput.type,
          title: contentInput.title,
          content: contentInput.content,
          format: contentInput.format
        })
      });

      // Mock AI service failure
      aiService.enhanceText = jest.fn().mockRejectedValue(new Error('AI service unavailable'));

      const result = await processContentUseCase.execute(contentInput);
      expect(result.success).toBe(true);
    });

    test('should handle database connection failures', async () => {
      const courseInput = {
        title: 'Test Course',
        description: 'Testing database failure',
        trainerId: 'trainer-123'
      };

      mockCourseRepository.findByTrainerId.mockResolvedValue([]);
      mockCourseRepository.save.mockRejectedValue(new Error('Database connection failed'));

      await expect(createCourseUseCase.execute(courseInput)).rejects.toThrow('Database connection failed');
    });

    test('should handle partial system failures', async () => {
      const contentInput = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Test Content',
        content: 'Content for testing partial failure',
        format: 'markdown'
      };

      mockContentRepository.save.mockResolvedValue({
        id: 'content-123',
        lessonId: contentInput.lessonId,
        trainerId: contentInput.trainerId,
        type: { value: contentInput.type },
        title: contentInput.title,
        content: contentInput.content,
        format: contentInput.format,
        toJSON: () => ({
          id: 'content-123',
          lessonId: contentInput.lessonId,
          trainerId: contentInput.trainerId,
          type: contentInput.type,
          title: contentInput.title,
          content: contentInput.content,
          format: contentInput.format
        })
      });

      // Mock partial AI service failure
      aiService.enhanceText = jest.fn().mockResolvedValue('Enhanced content');
      aiService.generatePresentation = jest.fn().mockRejectedValue(new Error('Presentation service down'));

      const result = await processContentUseCase.execute(contentInput);
      expect(result.success).toBe(true);
    });
  });

  describe('Data Consistency and Integrity', () => {
    test('should maintain data consistency across operations', async () => {
      const courseInput = {
        title: 'Consistency Test Course',
        description: 'Testing data consistency',
        trainerId: 'trainer-123'
      };

      mockCourseRepository.findByTrainerId.mockResolvedValue([]);
      mockCourseRepository.save.mockResolvedValue({
        id: 'course-123',
        title: courseInput.title,
        description: courseInput.description,
        trainerId: courseInput.trainerId,
        status: 'draft',
        toJSON: () => ({
          id: 'course-123',
          title: courseInput.title,
          description: courseInput.description,
          trainerId: courseInput.trainerId,
          status: 'draft'
        })
      });

      const courseResult = await createCourseUseCase.execute(courseInput);
      expect(courseResult.success).toBe(true);

      // Verify course data integrity
      expect(courseResult.data.title).toBe(courseInput.title);
      expect(courseResult.data.description).toBe(courseInput.description);
      expect(courseResult.data.trainerId).toBe(courseInput.trainerId);
    });

    test('should handle concurrent data modifications', async () => {
      const courseInput = {
        title: 'Concurrent Test Course',
        description: 'Testing concurrent modifications',
        trainerId: 'trainer-123'
      };

      mockCourseRepository.findByTrainerId.mockResolvedValue([]);
      mockCourseRepository.save.mockImplementation(async (course) => {
        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          id: `course-${Date.now()}-${Math.random()}`,
          title: course.title,
          description: course.description,
          trainerId: course.trainerId,
          status: 'draft',
          toJSON: () => ({
            id: `course-${Date.now()}-${Math.random()}`,
            title: course.title,
            description: course.description,
            trainerId: course.trainerId,
            status: 'draft'
          })
        };
      });

      const promises = Array.from({ length: 5 }, () => createCourseUseCase.execute(courseInput));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      expect(results.every(result => result.success)).toBe(true);
    });
  });

  describe('AI Service Integration', () => {
    test('should process content through multiple AI services', async () => {
      const content = 'JavaScript is a versatile programming language';
      
      const results = await Promise.all([
        aiService.enhanceText(content),
        aiService.generatePresentation(content),
        aiService.generateMindMap(content),
        aiService.checkQuality(content),
        aiService.translateContent(content, 'es'),
        aiService.generateAudio(content),
        aiService.generateVideo(content)
      ]);

      expect(results).toHaveLength(7);
      expect(results[0]).toContain('Enhanced:');
      expect(results[1]).toHaveProperty('slides');
      expect(results[2]).toHaveProperty('nodes');
      expect(results[3]).toHaveProperty('overallScore');
      expect(results[4]).toContain('[Translated to es]');
      expect(results[5]).toHaveProperty('audioUrl');
      expect(results[6]).toHaveProperty('videoUrl');
    });

    test('should handle AI service rate limiting', async () => {
      const content = 'Test content for rate limiting';
      const startTime = Date.now();

      const promises = Array.from({ length: 10 }, () => aiService.enhanceText(content));
      const results = await Promise.all(promises);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(results).toHaveLength(10);
      expect(executionTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('System Monitoring and Health', () => {
    test('should provide system health information', async () => {
      const healthStatus = aiService.getStatus();
      
      expect(healthStatus).toHaveProperty('status', 'healthy');
      expect(healthStatus).toHaveProperty('processingTime');
      expect(healthStatus).toHaveProperty('lastCheck');
      expect(new Date(healthStatus.lastCheck)).toBeInstanceOf(Date);
    });

    test('should handle system overload gracefully', async () => {
      const content = 'Test content for overload testing';
      const startTime = Date.now();

      // Simulate high load
      const promises = Array.from({ length: 50 }, () => aiService.enhanceText(content));
      const results = await Promise.all(promises);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(results).toHaveLength(50);
      expect(executionTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });
});
