const mockCourses = require('../data/mockCourses.json');
const mockUsers = require('../data/mockUsers.json');

class MockDataService {
  // Course methods
  getCourses(filters = {}) {
    let courses = [...mockCourses];
    
    // Apply filters
    if (filters.status) {
      courses = courses.filter(course => course.status === filters.status);
    }
    
    if (filters.author_id) {
      courses = courses.filter(course => course.author_id === filters.author_id);
    }
    
    return courses;
  }
  
  getCourseById(id) {
    return mockCourses.find(course => course.id === id);
  }
  
  createCourse(courseData) {
    const newCourse = {
      id: `course_${Date.now()}`,
      ...courseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lessons: [],
      metadata: {
        difficulty: courseData.difficulty || 'BEGINNER',
        estimatedDuration: courseData.estimatedDuration || 'N/A',
        tags: courseData.tags || [],
        language: 'en'
      }
    };
    
    mockCourses.push(newCourse);
    return newCourse;
  }
  
  updateCourse(id, updateData) {
    const courseIndex = mockCourses.findIndex(course => course.id === id);
    if (courseIndex === -1) return null;
    
    mockCourses[courseIndex] = {
      ...mockCourses[courseIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    return mockCourses[courseIndex];
  }
  
  deleteCourse(id) {
    const courseIndex = mockCourses.findIndex(course => course.id === id);
    if (courseIndex === -1) return false;
    
    mockCourses.splice(courseIndex, 1);
    return true;
  }
  
  // User methods
  getUsers(filters = {}) {
    let users = [...mockUsers];
    
    if (filters.role) {
      users = users.filter(user => user.role === filters.role);
    }
    
    return users;
  }
  
  getUserById(id) {
    return mockUsers.find(user => user.id === id);
  }
  
  // Content methods
  getContentByCourseId(courseId) {
    const course = this.getCourseById(courseId);
    if (!course) return [];
    
    // Extract all content from lessons
    const content = [];
    course.lessons.forEach(lesson => {
      if (lesson.content_data && lesson.content_data.contentFormats) {
        Object.entries(lesson.content_data.contentFormats).forEach(([format, data]) => {
          if (data.completed && data.data) {
            content.push({
              id: `${lesson.id}_${format}`,
              lesson_id: lesson.id,
              format_type: format,
              content_data: data.data,
              created_at: lesson.created_at,
              updated_at: lesson.updated_at
            });
          }
        });
      }
    });
    
    return content;
  }
  
  // Enrollment methods
  getEnrollments(userId) {
    // Mock enrollments - in a real app, this would come from a database
    const mockEnrollments = [
      {
        id: 'enrollment_1',
        user_id: userId,
        course_id: 'course_1',
        enrollment_date: '2024-01-15T10:00:00Z',
        status: 'ACTIVE',
        progress: 75,
        last_accessed: '2024-01-22T14:30:00Z'
      },
      {
        id: 'enrollment_2',
        user_id: userId,
        course_id: 'course_2',
        enrollment_date: '2024-01-10T08:00:00Z',
        status: 'COMPLETED',
        progress: 100,
        last_accessed: '2024-01-20T16:45:00Z'
      }
    ];
    
    return mockEnrollments.filter(enrollment => enrollment.user_id === userId);
  }
  
  createEnrollment(enrollmentData) {
    const newEnrollment = {
      id: `enrollment_${Date.now()}`,
      ...enrollmentData,
      enrollment_date: new Date().toISOString(),
      status: 'ACTIVE',
      progress: 0,
      last_accessed: new Date().toISOString()
    };
    
    return newEnrollment;
  }
}

module.exports = new MockDataService();

