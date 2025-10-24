import React from 'react';
import { useApp } from '../context/AppContext';
import Lessons from '../components/Lessons';

const LessonsPage = () => {
  const { lessons, hasLessonContent, openContentCreation, handleNewLesson } = useApp();

  return (
    <Lessons 
      lessons={lessons}
      hasLessonContent={hasLessonContent}
      onOpenContentCreation={openContentCreation}
      onNewLesson={handleNewLesson}
    />
  );
};

export default LessonsPage;
