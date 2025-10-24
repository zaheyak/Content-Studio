import React from 'react';

const CourseDetail = ({ 
  selectedCourse, 
  courseLessons, 
  hasLessonContent, 
  onOpenContentCreation, 
  onBackToCourses,
  onAddLesson 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-card border border-white/10 rounded-2xl p-6 backdrop-blur-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-text-primary">{selectedCourse.title}</h2>
          <button
            onClick={onBackToCourses}
            className="px-4 py-2 bg-transparent text-text-primary border border-white/20 rounded-xl hover:bg-white/10 hover:border-primary-cyan transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-cyan"
          >
            ← Back to Courses
          </button>
        </div>
        <p className="text-text-secondary">{selectedCourse.description}</p>
      </div>

      <div className="bg-gradient-card border border-white/10 rounded-2xl p-6 backdrop-blur-10">
        <h3 className="text-xl font-semibold text-text-primary mb-6">Lessons</h3>
        {courseLessons.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-book text-primary-cyan text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No lessons in this course yet</h3>
            <p className="text-text-secondary mb-6">Add your first lesson to get started.</p>
            <button
              onClick={onAddLesson}
              className="px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-cyan"
            >
              Add Lesson
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-bg-card border border-white/10 rounded-xl p-4 hover:border-primary-cyan/50 hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-text-primary mb-2">{lesson.title}</h4>
                <p className="text-text-secondary text-sm mb-4">{lesson.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                    hasLessonContent(lesson.id)
                      ? 'bg-badge-color/20 text-badge-color'
                      : 'bg-text-muted/20 text-text-muted'
                  }`}>
                    {hasLessonContent(lesson.id) ? 'Has Content' : 'No Content'}
                  </span>
                  <button
                    onClick={() => onOpenContentCreation(lesson)}
                    className="px-4 py-2 bg-gradient-primary text-white rounded-xl hover:shadow-glow hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                  >
                    {hasLessonContent(lesson.id) ? 'Edit Content' : 'Create Content'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
