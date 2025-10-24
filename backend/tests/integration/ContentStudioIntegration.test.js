const CreateCourseUseCase = require('../../src/application/use-cases/CreateCourseUseCase');
const ProcessContentUseCase = require('../../src/application/use-cases/ProcessContentUseCase');
const MockAIService = require('../../src/infrastructure/external/MockAIService');

describe('Content Studio Integration Tests', () => {
  let mockCourseRepository;
  let mockContentRepository;
  let aiService;
  let createCourseUseCase;
  let processContentUseCase;

  beforeEach(() => {
    // Mock repositories
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

    // Initialize AI service
    aiService = new MockAIService();
    aiService.setProcessingTime(10); // Fast processing for tests

    // Initialize use cases
    createCourseUseCase = new CreateCourseUseCase(mockCourseRepository);
    processContentUseCase = new ProcessContentUseCase(mockContentRepository, aiService);
  });

  describe('Complete Content Creation Workflow', () => {
    test('should handle complete course and content creation workflow', async () => {
      // Step 1: Create course
      const courseInput = {
        title: 'Advanced JavaScript Concepts',
        description: 'Learn advanced JavaScript programming techniques',
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

      // Step 2: Process text content
      const textContentInput = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'JavaScript Fundamentals',
        content: 'JavaScript is a versatile programming language',
        format: 'markdown'
      };

      mockContentRepository.save.mockResolvedValue({
        id: 'content-123',
        lessonId: textContentInput.lessonId,
        trainerId: textContentInput.trainerId,
        type: { value: textContentInput.type },
        title: textContentInput.title,
        content: textContentInput.content,
        format: textContentInput.format,
        toJSON: () => ({
          id: 'content-123',
          lessonId: textContentInput.lessonId,
          trainerId: textContentInput.trainerId,
          type: textContentInput.type,
          title: textContentInput.title,
          content: textContentInput.content,
          format: textContentInput.format
        })
      });

      const textContentResult = await processContentUseCase.execute(textContentInput);
      expect(textContentResult.success).toBe(true);
      expect(textContentResult.data.title).toBe(textContentInput.title);

      // Step 3: Process presentation content
      const presentationContentInput = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'presentation',
        title: 'JavaScript Concepts Presentation',
        content: 'Key concepts in JavaScript programming',
        format: 'json'
      };

      mockContentRepository.save.mockResolvedValue({
        id: 'content-124',
        lessonId: presentationContentInput.lessonId,
        trainerId: presentationContentInput.trainerId,
        type: { value: presentationContentInput.type },
        title: presentationContentInput.title,
        content: presentationContentInput.content,
        format: presentationContentInput.format,
        toJSON: () => ({
          id: 'content-124',
          lessonId: presentationContentInput.lessonId,
          trainerId: presentationContentInput.trainerId,
          type: presentationContentInput.type,
          title: presentationContentInput.title,
          content: presentationContentInput.content,
          format: presentationContentInput.format
        })
      });

      const presentationContentResult = await processContentUseCase.execute(presentationContentInput);
      expect(presentationContentResult.success).toBe(true);
      expect(presentationContentResult.data.title).toBe(presentationContentInput.title);

      // Step 4: Process mind map content
      const mindMapContentInput = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'mindmap',
        title: 'JavaScript Concepts Mind Map',
        content: 'Visual representation of JavaScript concepts',
        format: 'json'
      };

      mockContentRepository.save.mockResolvedValue({
        id: 'content-125',
        lessonId: mindMapContentInput.lessonId,
        trainerId: mindMapContentInput.trainerId,
        type: { value: mindMapContentInput.type },
        title: mindMapContentInput.title,
        content: mindMapContentInput.content,
        format: mindMapContentInput.format,
        toJSON: () => ({
          id: 'content-125',
          lessonId: mindMapContentInput.lessonId,
          trainerId: mindMapContentInput.trainerId,
          type: mindMapContentInput.type,
          title: mindMapContentInput.title,
          content: mindMapContentInput.content,
          format: mindMapContentInput.format
        })
      });

      const mindMapContentResult = await processContentUseCase.execute(mindMapContentInput);
      expect(mindMapContentResult.success).toBe(true);
      expect(mindMapContentResult.data.title).toBe(mindMapContentInput.title);

      // Verify all content was created
      expect(mockContentRepository.save).toHaveBeenCalledTimes(3);
    });
  });

  describe('AI Service Integration', () => {
    test('should integrate with AI service for content processing', async () => {
      // Test AI service functionality
      const text = 'Original educational content';
      const enhancedText = await aiService.enhanceText(text);
      expect(enhancedText).toContain('Enhanced:');
      expect(enhancedText).toContain(text);

      const presentation = await aiService.generatePresentation(text);
      expect(presentation).toHaveProperty('slides');
      expect(presentation.slides).toHaveLength(3);

      const mindMap = await aiService.generateMindMap(text);
      expect(mindMap).toHaveProperty('nodes');
      expect(mindMap).toHaveProperty('connections');

      const quality = await aiService.checkQuality(text);
      expect(quality).toHaveProperty('overallScore');
      expect(quality.overallScore).toBeGreaterThan(0);

      const audio = await aiService.generateAudio(text);
      expect(audio).toHaveProperty('audioUrl');
      expect(audio).toHaveProperty('duration');

      const video = await aiService.generateVideo(text);
      expect(video).toHaveProperty('videoUrl');
      expect(video).toHaveProperty('duration');
    });
  });

  describe('Error Handling', () => {
    test('should handle repository errors gracefully', async () => {
      // Mock repository error
      mockCourseRepository.save.mockRejectedValue(new Error('Database connection failed'));

      const courseInput = {
        title: 'Test Course',
        description: 'Test Description',
        trainerId: 'trainer-123'
      };

      mockCourseRepository.findByTrainerId.mockResolvedValue([]);

      await expect(createCourseUseCase.execute(courseInput)).rejects.toThrow(
        'Database connection failed'
      );
    });

    test('should handle AI service errors gracefully', async () => {
      // Mock AI service error
      aiService.enhanceText = jest.fn().mockRejectedValue(new Error('AI service unavailable'));

      const contentInput = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Test Content',
        content: 'Test content',
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

      // Content creation should succeed, but AI processing will fail
      const result = await processContentUseCase.execute(contentInput);
      expect(result.success).toBe(true);
    });
  });
});
