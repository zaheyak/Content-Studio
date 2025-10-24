// Mock Data Loader Utility
const fs = require('fs');
const path = require('path');

class MockDataLoader {
  constructor() {
    this.dataDir = __dirname;
  }

  // Load a specific mock data file
  loadMockData(filename) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading mock data from ${filename}:`, error.message);
      return null;
    }
  }

  // Load all mock data files
  loadAllMockData() {
    const files = fs.readdirSync(this.dataDir)
      .filter(file => file.endsWith('.json'))
      .filter(file => file !== 'loader.js');

    const mockData = {};
    
    files.forEach(file => {
      const key = file.replace('.json', '').replace('-', '_');
      mockData[key] = this.loadMockData(file);
    });

    return mockData;
  }

  // Get lesson content by ID
  getLessonContent(lessonId) {
    const lessonData = this.loadMockData('lesson-content-example.json');
    if (lessonData && lessonData.lessonId === lessonId) {
      return lessonData;
    }
    return null;
  }

  // Get course content structure
  getCourseContent(courseId) {
    const courseData = this.loadMockData('course-content-structure.json');
    if (courseData && courseData.courseId === courseId) {
      return courseData;
    }
    return null;
  }

  // Get content by type
  getContentByType(contentType) {
    const typeMap = {
      'video': 'video-content-mock.json',
      'presentation': 'presentation-content-mock.json',
      'mindmap': 'mindmap-content-mock.json',
      'code': 'code-content-mock.json',
      'images': 'image-content-mock.json'
    };

    const filename = typeMap[contentType];
    if (filename) {
      return this.loadMockData(filename);
    }
    return null;
  }

  // Generate mock lesson content
  generateMockLesson(lessonId, title, courseId, courseTitle) {
    const baseContent = this.loadMockData('lesson-content-example.json');
    
    return {
      ...baseContent,
      lessonId,
      lessonTitle: title,
      courseId,
      courseTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Get content statistics
  getContentStats() {
    const allData = this.loadAllMockData();
    const stats = {
      totalFiles: Object.keys(allData).length,
      contentTypes: ['video', 'text', 'presentation', 'mindmap', 'code', 'images'],
      lastUpdated: new Date().toISOString()
    };

    return stats;
  }
}

// Export singleton instance
const mockDataLoader = new MockDataLoader();

module.exports = {
  MockDataLoader,
  mockDataLoader,
  loadMockData: (filename) => mockDataLoader.loadMockData(filename),
  loadAllMockData: () => mockDataLoader.loadAllMockData(),
  getLessonContent: (lessonId) => mockDataLoader.getLessonContent(lessonId),
  getCourseContent: (courseId) => mockDataLoader.getCourseContent(courseId),
  getContentByType: (contentType) => mockDataLoader.getContentByType(contentType),
  generateMockLesson: (lessonId, title, courseId, courseTitle) => 
    mockDataLoader.generateMockLesson(lessonId, title, courseId, courseTitle),
  getContentStats: () => mockDataLoader.getContentStats()
};
