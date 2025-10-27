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

  // Load lesson content from standalone lesson files
  loadLessonContent(lessonId) {
    // First try to load from dynamically created files
    const dynamicFile = `lesson-${lessonId}-content.json`;
    try {
      const content = this.loadMockData(dynamicFile);
      if (content && content.lessonId === lessonId) {
        console.log('Loaded lesson content from dynamic file:', dynamicFile);
        return content;
      }
    } catch (error) {
      console.log(`Dynamic file ${dynamicFile} not found, trying static files...`);
    }
    
    // Fallback to static files - only if lessonId matches exactly
    const contentFiles = [
      'standalone-lesson-1-content.json',
      'standalone-lesson-2-content.json', 
      'standalone-lesson-3-content.json'
    ];
    
    for (const file of contentFiles) {
      try {
        const content = this.loadMockData(file);
        if (content && content.lessonId === lessonId) {
          console.log('Loaded lesson content from static file:', file);
          return content;
        }
      } catch (error) {
        console.error(`Error loading lesson content from ${file}:`, error.message);
      }
    }
    
    // If no specific lesson found, return null instead of fallback
    console.log(`No lesson content found for lessonId: ${lessonId}`);
    return null;
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
  loadLessonContent: (lessonId) => mockDataLoader.loadLessonContent(lessonId),
  getContentStats: () => mockDataLoader.getContentStats()
};
