const express = require('express');
const mockData = require('../services/mockDataService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/enrollments - Get user enrollments
router.get('/', auth, async (req, res) => {
  try {
    const { status, course_id } = req.query;
    
    const filters = { user_id: req.user.id };
    if (status) filters.status = status;
    if (course_id) filters.course_id = course_id;
    
    const enrollments = await mockData.getEnrollments(filters);
    
    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/v1/enrollments - Enroll in a course
router.post('/', auth, async (req, res) => {
  try {
    const { course_id } = req.body;
    
    if (!course_id) {
      return res.status(400).json({
        success: false,
        error: 'Course ID is required'
      });
    }
    
    // Check if course exists
    const course = await mockData.getCourseById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    // Check if already enrolled
    const existingEnrollments = await mockData.getEnrollments({
      user_id: req.user.id,
      course_id: course_id
    });
    
    if (existingEnrollments.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Already enrolled in this course'
      });
    }
    
    const enrollment = await mockData.createEnrollment(req.user.id, course_id);
    
    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/v1/enrollments/:courseId - Update enrollment progress
router.put('/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress, status, notes } = req.body;
    
    const updateData = {};
    if (progress !== undefined) updateData.progress = progress;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    // If progress is 100%, mark as completed
    if (progress === 100) {
      updateData.status = 'COMPLETED';
      updateData.completion_date = new Date().toISOString();
      updateData.certificate_issued = true;
    }
    
    const enrollment = await mockData.updateEnrollment(req.user.id, courseId, updateData);
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
    }
    
    res.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/v1/enrollments/:courseId - Unenroll from course
router.delete('/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const deleted = await mockData.deleteEnrollment(req.user.id, courseId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;

