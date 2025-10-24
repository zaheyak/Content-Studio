import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CourseDetail from '../components/CourseDetail';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, lessons, hasLessonContent, openContentCreation, openNewLessonModal } = useApp();
  
  const selectedCourse = courses.find(course => course.id === courseId);
  const courseLessons = lessons.filter(lesson => lesson.courseId === courseId);

  const handleBackToCourses = () => {
    navigate('/courses');
  };

  if (!selectedCourse) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Course not found</h2>
        <button
          onClick={handleBackToCourses}
          className="px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <CourseDetail 
      selectedCourse={selectedCourse}
      courseLessons={courseLessons}
      hasLessonContent={hasLessonContent}
      onOpenContentCreation={openContentCreation}
      onBackToCourses={handleBackToCourses}
      onAddLesson={() => openNewLessonModal(selectedCourse.id, selectedCourse.title)}
    />
  );
};

export default CourseDetailPage;
