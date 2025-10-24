const Course = require('../../src/domain/entities/Course');
const CourseStatus = require('../../src/domain/value-objects/CourseStatus');

describe('Course Domain Entity', () => {
  let course;

  beforeEach(() => {
    course = new Course(
      'course-123',
      'Introduction to JavaScript',
      'Learn the fundamentals of JavaScript programming',
      'trainer-456',
      CourseStatus.DRAFT
    );
  });

  describe('Constructor', () => {
    test('should create a course with valid data', () => {
      expect(course.id).toBe('course-123');
      expect(course.title).toBe('Introduction to JavaScript');
      expect(course.description).toBe('Learn the fundamentals of JavaScript programming');
      expect(course.trainerId).toBe('trainer-456');
      expect(course.status).toBe(CourseStatus.DRAFT);
      expect(course.lessons).toEqual([]);
    });

    test('should throw error for missing ID', () => {
      expect(() => {
        new Course(null, 'Title', 'Description', 'trainer-123');
      }).toThrow('Course ID is required');
    });

    test('should throw error for missing title', () => {
      expect(() => {
        new Course('course-123', '', 'Description', 'trainer-123');
      }).toThrow('Course title is required');
    });

    test('should throw error for missing trainer ID', () => {
      expect(() => {
        new Course('course-123', 'Title', 'Description', null);
      }).toThrow('Trainer ID is required');
    });

    test('should throw error for title too long', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => {
        new Course('course-123', longTitle, 'Description', 'trainer-123');
      }).toThrow('Course title cannot exceed 200 characters');
    });

    test('should throw error for description too long', () => {
      const longDescription = 'a'.repeat(1001);
      expect(() => {
        new Course('course-123', 'Title', longDescription, 'trainer-123');
      }).toThrow('Course description cannot exceed 1000 characters');
    });
  });

  describe('updateTitle', () => {
    test('should update title successfully', () => {
      const newTitle = 'Advanced JavaScript Concepts';
      course.updateTitle(newTitle);
      
      expect(course.title).toBe(newTitle);
      expect(course.updatedAt).toBeInstanceOf(Date);
    });

    test('should throw error for empty title', () => {
      expect(() => {
        course.updateTitle('');
      }).toThrow('Course title is required');
    });

    test('should throw error for title too long', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => {
        course.updateTitle(longTitle);
      }).toThrow('Course title cannot exceed 200 characters');
    });
  });

  describe('updateDescription', () => {
    test('should update description successfully', () => {
      const newDescription = 'Updated course description';
      course.updateDescription(newDescription);
      
      expect(course.description).toBe(newDescription);
      expect(course.updatedAt).toBeInstanceOf(Date);
    });

    test('should allow empty description', () => {
      course.updateDescription('');
      expect(course.description).toBe('');
    });

    test('should throw error for description too long', () => {
      const longDescription = 'a'.repeat(1001);
      expect(() => {
        course.updateDescription(longDescription);
      }).toThrow('Course description cannot exceed 1000 characters');
    });
  });

  describe('changeStatus', () => {
    test('should change status successfully', () => {
      course.changeStatus(CourseStatus.ACTIVE);
      expect(course.status).toBe(CourseStatus.ACTIVE);
      expect(course.updatedAt).toBeInstanceOf(Date);
    });

    test('should throw error for invalid status', () => {
      expect(() => {
        course.changeStatus('invalid-status');
      }).toThrow('Status must be a CourseStatus value object');
    });
  });

  describe('addLesson', () => {
    test('should add lesson successfully', () => {
      const lesson = { id: 'lesson-123', title: 'Lesson 1' };
      course.addLesson(lesson);
      
      expect(course.lessons).toHaveLength(1);
      expect(course.lessons[0]).toBe(lesson);
      expect(course.updatedAt).toBeInstanceOf(Date);
    });

    test('should throw error for invalid lesson', () => {
      expect(() => {
        course.addLesson(null);
      }).toThrow('Valid lesson is required');
    });
  });

  describe('removeLesson', () => {
    test('should remove lesson successfully', () => {
      const lesson = { id: 'lesson-123', title: 'Lesson 1' };
      course.addLesson(lesson);
      course.removeLesson('lesson-123');
      
      expect(course.lessons).toHaveLength(0);
      expect(course.updatedAt).toBeInstanceOf(Date);
    });

    test('should throw error for non-existent lesson', () => {
      expect(() => {
        course.removeLesson('non-existent');
      }).toThrow('Lesson not found');
    });
  });

  describe('canBePublished', () => {
    test('should return true for draft course with lessons', () => {
      const lesson = { id: 'lesson-123', title: 'Lesson 1' };
      course.addLesson(lesson);
      
      expect(course.canBePublished()).toBe(true);
    });

    test('should return false for draft course without lessons', () => {
      expect(course.canBePublished()).toBe(false);
    });

    test('should return false for non-draft course', () => {
      course.changeStatus(CourseStatus.ACTIVE);
      const lesson = { id: 'lesson-123', title: 'Lesson 1' };
      course.addLesson(lesson);
      
      expect(course.canBePublished()).toBe(false);
    });
  });

  describe('canBeArchived', () => {
    test('should return true for draft course', () => {
      expect(course.canBeArchived()).toBe(true);
    });

    test('should return true for active course', () => {
      course.changeStatus(CourseStatus.ACTIVE);
      expect(course.canBeArchived()).toBe(true);
    });

    test('should return false for archived course', () => {
      course.changeStatus(CourseStatus.ARCHIVED);
      expect(course.canBeArchived()).toBe(false);
    });
  });

  describe('getLessonCount', () => {
    test('should return correct lesson count', () => {
      expect(course.getLessonCount()).toBe(0);
      
      course.addLesson({ id: 'lesson-1', title: 'Lesson 1' });
      expect(course.getLessonCount()).toBe(1);
      
      course.addLesson({ id: 'lesson-2', title: 'Lesson 2' });
      expect(course.getLessonCount()).toBe(2);
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON representation', () => {
      const json = course.toJSON();
      
      expect(json).toEqual({
        id: 'course-123',
        title: 'Introduction to JavaScript',
        description: 'Learn the fundamentals of JavaScript programming',
        trainerId: 'trainer-456',
        status: 'draft',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        lessonCount: 0
      });
    });
  });
});
