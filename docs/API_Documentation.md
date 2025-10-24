# Content Studio API Documentation

## Overview
The Content Studio API provides endpoints for AI-assisted content creation, course management, and educational content processing. Built with Node.js, Express, and following Onion Architecture principles.

## Base URL
- **Development**: `http://localhost:3001`
- **Staging**: `https://content-studio-staging.railway.app`
- **Production**: `https://content-studio.railway.app`

## Authentication
All API endpoints require authentication via JWT tokens in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Content Types
- **Request**: `application/json`
- **Response**: `application/json`

## Error Handling
All errors follow a consistent format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details"
  }
}
```

## Rate Limiting
- **Rate Limit**: 1000 requests per hour per API key
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Health Check

### GET /health
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "message": "Content Studio Backend is healthy",
  "timestamp": "2024-01-23T22:30:00Z",
  "version": "1.0.0"
}
```

---

## Course Management

### GET /api/courses
Get all courses for the authenticated trainer.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "course-123",
      "title": "Introduction to JavaScript",
      "description": "Learn JavaScript fundamentals",
      "trainerId": "trainer-456",
      "status": "draft",
      "createdAt": "2024-01-23T20:00:00Z",
      "updatedAt": "2024-01-23T20:00:00Z",
      "lessonCount": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### GET /api/courses/:id
Get a specific course by ID.

**Parameters:**
- `id` (string): Course ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "course-123",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript fundamentals",
    "trainerId": "trainer-456",
    "status": "draft",
    "createdAt": "2024-01-23T20:00:00Z",
    "updatedAt": "2024-01-23T20:00:00Z",
    "lessonCount": 5,
    "lessons": [
      {
        "id": "lesson-123",
        "title": "JavaScript Basics",
        "description": "Introduction to JavaScript syntax",
        "order": 1,
        "status": "draft"
      }
    ]
  }
}
```

### POST /api/courses
Create a new course.

**Request Body:**
```json
{
  "title": "Introduction to JavaScript",
  "description": "Learn JavaScript fundamentals"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "course-123",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript fundamentals",
    "trainerId": "trainer-456",
    "status": "draft",
    "createdAt": "2024-01-23T20:00:00Z",
    "updatedAt": "2024-01-23T20:00:00Z",
    "lessonCount": 0
  },
  "message": "Course created successfully"
}
```

### PUT /api/courses/:id
Update an existing course.

**Parameters:**
- `id` (string): Course ID

**Request Body:**
```json
{
  "title": "Advanced JavaScript Concepts",
  "description": "Deep dive into JavaScript"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "course-123",
    "title": "Advanced JavaScript Concepts",
    "description": "Deep dive into JavaScript",
    "trainerId": "trainer-456",
    "status": "draft",
    "createdAt": "2024-01-23T20:00:00Z",
    "updatedAt": "2024-01-23T22:30:00Z",
    "lessonCount": 5
  },
  "message": "Course updated successfully"
}
```

### DELETE /api/courses/:id
Delete a course.

**Parameters:**
- `id` (string): Course ID

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## Lesson Management

### GET /api/lessons
Get all lessons for the authenticated trainer.

**Query Parameters:**
- `courseId` (string, optional): Filter by course ID
- `status` (string, optional): Filter by status
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lesson-123",
      "courseId": "course-123",
      "title": "JavaScript Basics",
      "description": "Introduction to JavaScript syntax",
      "order": 1,
      "status": "draft",
      "createdAt": "2024-01-23T20:00:00Z",
      "updatedAt": "2024-01-23T20:00:00Z",
      "contentCount": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### GET /api/lessons/:id
Get a specific lesson by ID.

**Parameters:**
- `id` (string): Lesson ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "lesson-123",
    "courseId": "course-123",
    "title": "JavaScript Basics",
    "description": "Introduction to JavaScript syntax",
    "order": 1,
    "status": "draft",
    "createdAt": "2024-01-23T20:00:00Z",
    "updatedAt": "2024-01-23T20:00:00Z",
    "contentCount": 3,
    "content": [
      {
        "id": "content-123",
        "type": "text",
        "title": "JavaScript Variables",
        "content": "Variables in JavaScript...",
        "format": "markdown",
        "status": "completed"
      }
    ]
  }
}
```

### POST /api/lessons
Create a new lesson.

**Request Body:**
```json
{
  "courseId": "course-123",
  "title": "JavaScript Basics",
  "description": "Introduction to JavaScript syntax",
  "order": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "lesson-123",
    "courseId": "course-123",
    "title": "JavaScript Basics",
    "description": "Introduction to JavaScript syntax",
    "order": 1,
    "status": "draft",
    "createdAt": "2024-01-23T20:00:00Z",
    "updatedAt": "2024-01-23T20:00:00Z",
    "contentCount": 0
  },
  "message": "Lesson created successfully"
}
```

---

## Content Management

### GET /api/content
Get all content for the authenticated trainer.

**Query Parameters:**
- `lessonId` (string, optional): Filter by lesson ID
- `type` (string, optional): Filter by content type
- `status` (string, optional): Filter by status
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "content-123",
      "lessonId": "lesson-123",
      "trainerId": "trainer-456",
      "type": "text",
      "title": "JavaScript Variables",
      "content": "Variables in JavaScript...",
      "format": "markdown",
      "status": "completed",
      "createdAt": "2024-01-23T20:00:00Z",
      "updatedAt": "2024-01-23T20:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### POST /api/content
Create new content.

**Request Body:**
```json
{
  "lessonId": "lesson-123",
  "type": "text",
  "title": "JavaScript Variables",
  "content": "Variables in JavaScript...",
  "format": "markdown"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "content-123",
    "lessonId": "lesson-123",
    "trainerId": "trainer-456",
    "type": "text",
    "title": "JavaScript Variables",
    "content": "Variables in JavaScript...",
    "format": "markdown",
    "status": "processing",
    "createdAt": "2024-01-23T20:00:00Z",
    "updatedAt": "2024-01-23T20:00:00Z"
  },
  "message": "Content created and processing started"
}
```

---

## AI Processing

### POST /api/ai/enhance
Enhance text content using AI.

**Request Body:**
```json
{
  "content": "Original text content to enhance",
  "options": {
    "style": "professional",
    "language": "en"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalContent": "Original text content to enhance",
    "enhancedContent": "Enhanced: Original text content to enhance\n\nThis content has been improved with AI assistance for better clarity and structure.",
    "processingTime": 1.2,
    "confidence": 0.95
  }
}
```

### POST /api/ai/presentation
Generate presentation from content.

**Request Body:**
```json
{
  "content": "Content to convert to presentation",
  "options": {
    "slideCount": 10,
    "style": "modern"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "slides": [
      {
        "title": "Introduction",
        "content": "Overview: Content to convert...",
        "notes": "Key points to discuss"
      },
      {
        "title": "Main Concepts",
        "content": "Core concepts: Content to convert...",
        "notes": "Detailed explanations"
      }
    ],
    "format": "json",
    "processingTime": 2.1
  }
}
```

### POST /api/ai/mindmap
Generate mind map from content.

**Request Body:**
```json
{
  "content": "Content to convert to mind map",
  "options": {
    "depth": 3,
    "style": "hierarchical"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "root",
        "label": "Main Topic",
        "position": { "x": 0, "y": 0 },
        "children": [
          {
            "id": "concept1",
            "label": "Concept 1",
            "position": { "x": -100, "y": 100 }
          }
        ]
      }
    ],
    "connections": [
      { "from": "root", "to": "concept1" }
    ],
    "format": "json",
    "processingTime": 1.8
  }
}
```

### POST /api/ai/translate
Translate content to target language.

**Request Body:**
```json
{
  "content": "Content to translate",
  "targetLanguage": "es",
  "sourceLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalContent": "Content to translate",
    "translatedContent": "[Translated to es] Content to translate",
    "sourceLanguage": "en",
    "targetLanguage": "es",
    "confidence": 0.98
  }
}
```

### POST /api/ai/quality
Check content quality and provide suggestions.

**Request Body:**
```json
{
  "content": "Content to analyze"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originality": 0.95,
    "clarity": 0.88,
    "difficulty": 0.75,
    "structure": 0.92,
    "overallScore": 0.88,
    "suggestions": [
      "Consider adding more examples",
      "Simplify complex sentences",
      "Add visual elements"
    ]
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `AI_SERVICE_ERROR` | 502 | AI service unavailable |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## SDKs and Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://content-studio.railway.app',
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  }
});

// Create a course
const course = await api.post('/api/courses', {
  title: 'My Course',
  description: 'Course description'
});

// Enhance content with AI
const enhanced = await api.post('/api/ai/enhance', {
  content: 'Original content'
});
```

### Python
```python
import requests

headers = {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
}

# Create a course
response = requests.post(
    'https://content-studio.railway.app/api/courses',
    json={'title': 'My Course', 'description': 'Course description'},
    headers=headers
)
```

### cURL Examples
```bash
# Health check
curl -X GET https://content-studio.railway.app/health

# Create course
curl -X POST https://content-studio.railway.app/api/courses \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Course", "description": "Course description"}'

# Enhance content
curl -X POST https://content-studio.railway.app/api/ai/enhance \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"content": "Original content"}'
```

---

## Support

- **Documentation**: [GitHub Repository](https://github.com/your-org/content-studio)
- **Issues**: [GitHub Issues](https://github.com/your-org/content-studio/issues)
- **Email**: api-support@contentstudio.com
- **Status**: [Status Page](https://status.contentstudio.com)
