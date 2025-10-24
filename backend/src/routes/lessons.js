const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load mock data from JSON files
const loadLessons = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../../mock-data/lessons.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading lessons data:', error);
    return { data: [] };
  }
};

const saveLessons = (lessonsData) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, '../../mock-data/lessons.json'), 
      JSON.stringify(lessonsData, null, 2), 
      'utf8'
    );
  } catch (error) {
    console.error('Error saving lessons data:', error);
  }
};

// GET /api/lessons - Get all lessons (optionally filter by courseId)
router.get('/', (req, res) => {
  const { courseId } = req.query;
  const lessonsData = loadLessons();
  
  let lessons = lessonsData.data;
  if (courseId) {
    lessons = lessons.filter(lesson => lesson.courseId === courseId);
  }

  res.json({
    success: true,
    data: lessons,
    total: lessons.length
  });
});

// GET /api/lessons/:id - Get specific lesson
router.get('/:id', (req, res) => {
  const lessonsData = loadLessons();
  const lesson = lessonsData.data.find(l => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }
  res.json({
    success: true,
    data: lesson
  });
});

// POST /api/lessons - Create new lesson
router.post('/', (req, res) => {
  const { courseId, title, description } = req.body;
  
  if (!courseId || !title || !description) {
    return res.status(400).json({
      success: false,
      message: 'CourseId, title and description are required'
    });
  }

  const lessonsData = loadLessons();
  const newLesson = {
    id: `lesson_${Date.now()}`,
    courseId,
    title,
    description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  lessonsData.data.push(newLesson);
  saveLessons(lessonsData);

  res.status(201).json({
    success: true,
    data: newLesson,
    message: 'Lesson created successfully'
  });
});

// PUT /api/lessons/:id - Update lesson
router.put('/:id', (req, res) => {
  const lessonsData = loadLessons();
  const lesson = lessonsData.data.find(l => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }

  const { title, description } = req.body;
  if (title) lesson.title = title;
  if (description) lesson.description = description;
  lesson.updated_at = new Date().toISOString();

  saveLessons(lessonsData);

  res.json({
    success: true,
    data: lesson,
    message: 'Lesson updated successfully'
  });
});

// DELETE /api/lessons/:id - Delete lesson
router.delete('/:id', (req, res) => {
  const lessonsData = loadLessons();
  const lessonIndex = lessonsData.data.findIndex(l => l.id === req.params.id);
  if (lessonIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }

  lessonsData.data.splice(lessonIndex, 1);
  saveLessons(lessonsData);

  res.json({
    success: true,
    message: 'Lesson deleted successfully'
  });
});

module.exports = router;