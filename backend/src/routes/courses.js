const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load mock data from JSON files
const loadCourses = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../../mock-data/courses.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading courses data:', error);
    return { data: [] };
  }
};

const saveCourses = (coursesData) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, '../../mock-data/courses.json'), 
      JSON.stringify(coursesData, null, 2), 
      'utf8'
    );
  } catch (error) {
    console.error('Error saving courses data:', error);
  }
};

// GET /api/courses - Get all courses
router.get('/', (req, res) => {
  const coursesData = loadCourses();
  res.json({
    success: true,
    data: coursesData.data,
    total: coursesData.data.length
  });
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', (req, res) => {
  const coursesData = loadCourses();
  const course = coursesData.data.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  res.json({
    success: true,
    data: course
  });
});

// POST /api/courses - Create new course
router.post('/', (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }

  const coursesData = loadCourses();
  const newCourse = {
    id: `course_${Date.now()}`,
    title,
    description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  coursesData.data.push(newCourse);
  saveCourses(coursesData);

  res.status(201).json({
    success: true,
    data: newCourse,
    message: 'Course created successfully'
  });
});

// PUT /api/courses/:id - Update course
router.put('/:id', (req, res) => {
  const coursesData = loadCourses();
  const course = coursesData.data.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const { title, description } = req.body;
  if (title) course.title = title;
  if (description) course.description = description;
  course.updated_at = new Date().toISOString();

  saveCourses(coursesData);

  res.json({
    success: true,
    data: course,
    message: 'Course updated successfully'
  });
});

// DELETE /api/courses/:id - Delete course
router.delete('/:id', (req, res) => {
  const coursesData = loadCourses();
  const courseIndex = coursesData.data.findIndex(c => c.id === req.params.id);
  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  coursesData.data.splice(courseIndex, 1);
  saveCourses(coursesData);

  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
});

module.exports = router;