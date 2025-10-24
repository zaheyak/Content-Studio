const CreateCourseUseCase = require('../../src/application/use-cases/CreateCourseUseCase');

describe('CreateCourseUseCase', () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByTrainerId: jest.fn()
    };
    useCase = new CreateCourseUseCase(mockRepository);
  });

  describe('execute', () => {
    test('should create course successfully', async () => {
      // Arrange
      const input = {
        title: 'Introduction to JavaScript',
        description: 'Learn JavaScript fundamentals',
        trainerId: 'trainer-123'
      };
      
      mockRepository.findByTrainerId.mockResolvedValue([]);
      mockRepository.save.mockResolvedValue({
        id: 'course-123',
        title: input.title,
        description: input.description,
        trainerId: input.trainerId,
        status: 'draft',
        toJSON: () => ({
          id: 'course-123',
          title: input.title,
          description: input.description,
          trainerId: input.trainerId,
          status: 'draft'
        })
      });

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.title).toBe(input.title);
      expect(result.data.description).toBe(input.description);
      expect(result.data.trainerId).toBe(input.trainerId);
      expect(result.message).toBe('Course created successfully');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    test('should throw error for duplicate title', async () => {
      // Arrange
      const input = {
        title: 'Introduction to JavaScript',
        description: 'Learn JavaScript fundamentals',
        trainerId: 'trainer-123'
      };
      
      mockRepository.findByTrainerId.mockResolvedValue([
        { title: 'Introduction to JavaScript' }
      ]);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'A course with this title already exists'
      );
    });

    test('should throw error for missing title', async () => {
      // Arrange
      const input = {
        title: '',
        description: 'Learn JavaScript fundamentals',
        trainerId: 'trainer-123'
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Course title is required'
      );
    });

    test('should throw error for missing trainer ID', async () => {
      // Arrange
      const input = {
        title: 'Introduction to JavaScript',
        description: 'Learn JavaScript fundamentals',
        trainerId: null
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Trainer ID is required'
      );
    });

    test('should throw error for title too long', async () => {
      // Arrange
      const input = {
        title: 'a'.repeat(201),
        description: 'Learn JavaScript fundamentals',
        trainerId: 'trainer-123'
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Course title cannot exceed 200 characters'
      );
    });

    test('should throw error for description too long', async () => {
      // Arrange
      const input = {
        title: 'Introduction to JavaScript',
        description: 'a'.repeat(1001),
        trainerId: 'trainer-123'
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        'Course description cannot exceed 1000 characters'
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
