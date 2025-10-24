const ProcessContentUseCase = require('../../src/application/use-cases/ProcessContentUseCase');
const ContentType = require('../../src/domain/value-objects/ContentType');

describe('ProcessContentUseCase', () => {
  let useCase;
  let mockRepository;
  let mockAIService;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      update: jest.fn()
    };
    mockAIService = {
      enhanceText: jest.fn(),
      generatePresentation: jest.fn(),
      generateMindMap: jest.fn()
    };
    useCase = new ProcessContentUseCase(mockRepository, mockAIService);
  });

  describe('execute', () => {
    test('should process text content successfully', async () => {
      // Arrange
      const input = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Introduction to JavaScript',
        content: 'JavaScript is a programming language',
        format: 'markdown'
      };
      
      mockRepository.save.mockResolvedValue({
        id: 'content-123',
        lessonId: input.lessonId,
        trainerId: input.trainerId,
        type: new ContentType(input.type),
        title: input.title,
        content: input.content,
        format: input.format,
        toJSON: () => ({
          id: 'content-123',
          lessonId: input.lessonId,
          trainerId: input.trainerId,
          type: input.type,
          title: input.title,
          content: input.content,
          format: input.format
        })
      });

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.title).toBe(input.title);
      expect(result.message).toBe('Content created and processing started');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    test('should throw error for missing lesson ID', async () => {
      // Arrange
      const input = {
        lessonId: null,
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Introduction to JavaScript',
        content: 'JavaScript is a programming language',
        format: 'markdown'
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Lesson ID is required'
      );
    });

    test('should throw error for missing trainer ID', async () => {
      // Arrange
      const input = {
        lessonId: 'lesson-123',
        trainerId: null,
        type: 'text',
        title: 'Introduction to JavaScript',
        content: 'JavaScript is a programming language',
        format: 'markdown'
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Trainer ID is required'
      );
    });

    test('should throw error for invalid content type', async () => {
      // Arrange
      const input = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'invalid-type',
        title: 'Introduction to JavaScript',
        content: 'JavaScript is a programming language',
        format: 'markdown'
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Valid content type is required'
      );
    });

    test('should throw error for missing title', async () => {
      // Arrange
      const input = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: '',
        content: 'JavaScript is a programming language',
        format: 'markdown'
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Content title is required'
      );
    });

    test('should throw error for missing content', async () => {
      // Arrange
      const input = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Introduction to JavaScript',
        content: null,
        format: 'markdown'
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Content is required'
      );
    });

    test('should throw error for missing format', async () => {
      // Arrange
      const input = {
        lessonId: 'lesson-123',
        trainerId: 'trainer-123',
        type: 'text',
        title: 'Introduction to JavaScript',
        content: 'JavaScript is a programming language',
        format: ''
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Content format is required'
      );
    });

    test('should throw error for missing input', async () => {
      // Act & Assert
      await expect(useCase.execute(null)).rejects.toThrow(
        'Input is required'
      );
    });
  });
});
