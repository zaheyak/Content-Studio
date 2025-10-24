const CreateCourseUseCase = require('../../src/application/use-cases/CreateCourseUseCase');
const ProcessContentUseCase = require('../../src/application/use-cases/ProcessContentUseCase');
const MockAIService = require('../../src/infrastructure/external/MockAIService');

describe('Performance Tests', () => {
  let mockCourseRepository;
  let mockContentRepository;
  let aiService;
  let createCourseUseCase;
  let processContentUseCase;

  beforeEach(() => {
    mockCourseRepository = {
      save: jest.fn(),
      findByTrainerId: jest.fn(),
      findById: jest.fn()
    };
    
    mockContentRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findByLessonId: jest.fn()
    };

    aiService = new MockAIService();
    aiService.setProcessingTime(10); // Fast processing for tests

    createCourseUseCase = new CreateCourseUseCase(mockCourseRepository);
    processContentUseCase = new ProcessContentUseCase(mockContentRepository, aiService);
  });

  describe('Course Creation Performance', () => {
    test('should create course within acceptable time limit', async () => {
      const startTime = Date.now();
      
      const courseInput = {
        title: 'Performance Test Course',
        description: 'Testing course creation performance',
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

      await createCourseUseCase.execute(courseInput);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle multiple concurrent course creations', async () => {
      const startTime = Date.now();
      
      const courseInputs = Array.from({ length: 10 }, (_, i) => ({
        title: `Concurrent Course ${i + 1}`,
        description: `Testing concurrent course creation ${i + 1}`,
        trainerId: `trainer-${i + 1}`
      }));

      mockCourseRepository.findByTrainerId.mockResolvedValue([]);
      mockCourseRepository.save.mockImplementation(async (course) => ({
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
      }));

      const promises = courseInputs.map(input => createCourseUseCase.execute(input));
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(results).toHaveLength(10);
      expect(results.every(result => result.success)).toBe(true);
      expect(executionTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('Content Processing Performance', () => {
    test('should process content within acceptable time limit', async () => {
      const startTime = Date.now();
      
      const contentInput = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Performance Test Content',
        content: 'Testing content processing performance',
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

      await processContentUseCase.execute(contentInput);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle multiple concurrent content processing', async () => {
      const startTime = Date.now();
      
      const contentInputs = Array.from({ length: 5 }, (_, i) => ({
        lessonId: `lesson-${i + 1}`,
        trainerId: `trainer-${i + 1}`,
        type: 'text',
        title: `Concurrent Content ${i + 1}`,
        content: `Testing concurrent content processing ${i + 1}`,
        format: 'markdown'
      }));

      mockContentRepository.save.mockImplementation(async (content) => ({
        id: `content-${Date.now()}-${Math.random()}`,
        lessonId: content.lessonId,
        trainerId: content.trainerId,
        type: { value: content.type.value },
        title: content.title,
        content: content.content,
        format: content.format,
        toJSON: () => ({
          id: `content-${Date.now()}-${Math.random()}`,
          lessonId: content.lessonId,
          trainerId: content.trainerId,
          type: content.type.value,
          title: content.title,
          content: content.content,
          format: content.format
        })
      }));

      const promises = contentInputs.map(input => processContentUseCase.execute(input));
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(results).toHaveLength(5);
      expect(results.every(result => result.success)).toBe(true);
      expect(executionTime).toBeLessThan(3000); // Should complete within 3 seconds
    });
  });

  describe('AI Service Performance', () => {
    test('should enhance text within acceptable time limit', async () => {
      const startTime = Date.now();
      const text = 'This is a test text for performance testing';
      
      await aiService.enhanceText(text);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should generate presentation within acceptable time limit', async () => {
      const startTime = Date.now();
      const content = 'This is test content for presentation generation';
      
      await aiService.generatePresentation(content);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should generate mind map within acceptable time limit', async () => {
      const startTime = Date.now();
      const content = 'This is test content for mind map generation';
      
      await aiService.generateMindMap(content);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle multiple concurrent AI operations', async () => {
      const startTime = Date.now();
      const text = 'Test content for concurrent AI operations';
      
      const operations = [
        aiService.enhanceText(text),
        aiService.generatePresentation(text),
        aiService.generateMindMap(text),
        aiService.checkQuality(text),
        aiService.generateAudio(text)
      ];
      
      const results = await Promise.all(operations);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(results).toHaveLength(5);
      expect(executionTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Memory Usage', () => {
    test('should not exceed memory limits during bulk operations', async () => {
      const initialMemory = process.memoryUsage();
      
      // Simulate bulk operations
      const operations = Array.from({ length: 100 }, (_, i) => ({
        lessonId: `lesson-${i}`,
        trainerId: `trainer-${i}`,
        type: 'text',
        title: `Bulk Content ${i}`,
        content: `Bulk content data ${i}`.repeat(100), // Large content
        format: 'markdown'
      }));

      mockContentRepository.save.mockImplementation(async (content) => ({
        id: `content-${Date.now()}-${Math.random()}`,
        lessonId: content.lessonId,
        trainerId: content.trainerId,
        type: { value: content.type.value },
        title: content.title,
        content: content.content,
        format: content.format,
        toJSON: () => ({
          id: `content-${Date.now()}-${Math.random()}`,
          lessonId: content.lessonId,
          trainerId: content.trainerId,
          type: content.type.value,
          title: content.title,
          content: content.content,
          format: content.format
        })
      }));

      const promises = operations.map(input => processContentUseCase.execute(input));
      await Promise.all(promises);
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 100MB)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });
  });
});
