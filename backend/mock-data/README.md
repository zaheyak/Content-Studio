# Content Studio Mock Data

This directory contains mock JSON data files for testing and development of the Content Studio microservice.

## File Structure

### Core Content Files

- **`lesson-content-example.json`** - Complete lesson content example with all content types
- **`course-content-structure.json`** - Course-level content organization and structure

### Content Type Specific Files

- **`video-content-mock.json`** - Video content including uploads, AI generation, and YouTube processing
- **`presentation-content-mock.json`** - Presentation slides with animations and settings
- **`mindmap-content-mock.json`** - Interactive mind map nodes and connections
- **`code-content-mock.json`** - Code snippets, exercises, and programming examples
- **`image-content-mock.json`** - Image content including uploads and AI generation

## Content Structure

### Lesson Content Example
```json
{
  "lessonId": "lesson_1234567890",
  "lessonTitle": "Variables and Data Types",
  "courseId": "course_456",
  "courseTitle": "JavaScript Fundamentals",
  "content": {
    "video": { ... },
    "text": { ... },
    "presentation": { ... },
    "mindmap": { ... },
    "code": { ... },
    "images": { ... }
  },
  "folders": { ... }
}
```

### Content Types

#### Video Content
- **Uploaded Videos**: File details, transcription, metadata
- **AI Generated Videos**: Avatar videos with prompts and settings
- **YouTube Videos**: Processed YouTube content with transcription

#### Text Content
- **Manual Content**: Trainer-written text
- **AI Generated**: AI-assisted content creation
- **Formatted Text**: Markdown support with syntax highlighting

#### Presentation Content
- **Slides**: Individual slide content with notes
- **Settings**: Theme, colors, animations, transitions
- **Metadata**: Duration, version, creation dates

#### Mind Map Content
- **Nodes**: Interactive nodes with positions, colors, shapes
- **Connections**: Relationships between nodes
- **Settings**: Layout, spacing, colors, animations

#### Code Content
- **Snippets**: Code examples with syntax highlighting
- **Exercises**: Programming exercises with solutions
- **Settings**: Editor theme, font, syntax highlighting

#### Image Content
- **Uploaded Images**: File details, dimensions, metadata
- **AI Generated**: AI-created images with prompts
- **Settings**: Format restrictions, compression, thumbnails

## Usage

### For Development
```javascript
// Load mock data in your development environment
const mockContent = require('./mock-data/lesson-content-example.json');
```

### For Testing
```javascript
// Use mock data in your tests
const { loadMockData } = require('./mock-data/loader');
const lessonContent = loadMockData('lesson-content-example');
```

### For API Responses
```javascript
// Return mock data from API endpoints
app.get('/api/lessons/:id/content', (req, res) => {
  const mockData = require('./mock-data/lesson-content-example.json');
  res.json(mockData);
});
```

## File Paths

All content includes organized file paths:
```
/content/
├── lesson_1234567890/
│   ├── videos/
│   ├── text/
│   ├── presentations/
│   ├── mindmaps/
│   ├── code/
│   └── images/
```

## Metadata

Each content type includes:
- **Creation/Update timestamps**
- **File sizes and formats**
- **Content statistics**
- **Processing status**
- **User preferences**

## Integration

These mock files can be used to:
1. **Test frontend components** with realistic data
2. **Develop API endpoints** with sample responses
3. **Create database schemas** based on content structure
4. **Validate content processing** workflows
5. **Demo the application** with sample content

## Updates

When adding new content types or features:
1. Update the relevant mock data file
2. Add new fields to the structure
3. Update this README with new information
4. Test with the updated mock data
