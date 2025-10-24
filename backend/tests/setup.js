// Jest setup file
// Global test configuration

// Set test timeout
jest.setTimeout(10000);

// Global test utilities
global.testUtils = {
  createMockCourse: (overrides = {}) => ({
    id: 'course-123',
    title: 'Test Course',
    description: 'Test Description',
    trainerId: 'trainer-123',
    status: 'draft',
    ...overrides
  }),
  
  createMockLesson: (overrides = {}) => ({
    id: 'lesson-123',
    courseId: 'course-123',
    title: 'Test Lesson',
    description: 'Test Description',
    order: 1,
    status: 'draft',
    ...overrides
  }),
  
  createMockContent: (overrides = {}) => ({
    id: 'content-123',
    lessonId: 'lesson-123',
    trainerId: 'trainer-123',
    type: 'text',
    title: 'Test Content',
    content: 'Test content data',
    format: 'markdown',
    ...overrides
  })
};
