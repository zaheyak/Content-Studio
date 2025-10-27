import React from 'react';
import { useApp } from '../context/AppContext';
import Lessons from '../components/Lessons';

const LessonsPage = () => {
  const { lessons, hasLessonContent, openContentCreation, handleNewLesson } = useApp();
  
  // Filter out lessons that belong to courses - only show standalone lessons
  const standaloneLessons = lessons.filter(lesson => !lesson.courseId || lesson.courseId === null || lesson.courseId === '');

  return (
    <Lessons 
      lessons={standaloneLessons}
      hasLessonContent={hasLessonContent}
      onOpenContentCreation={openContentCreation}
      onNewLesson={handleNewLesson}
    />
  );
};

export default LessonsPage;
