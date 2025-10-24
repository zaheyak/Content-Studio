import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import Courses from '../components/Courses';

const CoursesPage = () => {
  const navigate = useNavigate();
  const { courses, lessons, setCourses, setLessons, setError } = useApp();
  
  // Local state for course creation
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState({ title: '', description: '' });
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState('');

  const handleViewCourse = (course) => {
    navigate(`/courses/${course.id}`);
  };

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      const result = await dataService.createCourse(newCourse);
      setCourses([...courses, result]);
      setNewCourse({ title: '', description: '' });
      setCreatedCourseId(result.id);
      setShowAddLesson(true);
      setError(null);
    } catch (err) {
      setError('Failed to create course');
    }
  };

  const createLesson = async (e) => {
    e.preventDefault();
    try {
      const lessonData = {
        title: newLesson.title,
        description: newLesson.description,
        courseId: createdCourseId
      };
      const result = await dataService.createLesson(lessonData);
      setLessons([...lessons, result]);
      setNewLesson({ title: '', description: '' });
      setShowAddLesson(false);
      setCreatedCourseId('');
      setError(null);
    } catch (err) {
      setError('Failed to create lesson');
    }
  };

  return (
    <Courses 
      courses={courses}
      lessons={lessons}
      newCourse={newCourse}
      setNewCourse={setNewCourse}
      onCreateCourse={createCourse}
      onViewCourse={handleViewCourse}
      showAddLesson={showAddLesson}
      newLesson={newLesson}
      setNewLesson={setNewLesson}
      onCreateLesson={createLesson}
    />
  );
};

export default CoursesPage;
