import React from 'react';

const Lessons = ({ lessons, hasLessonContent, onOpenContentCreation, onNewLesson }) => {
  return (
    <div className="pt-20 space-y-6">
      {/* Page Title */}
      <div className="text-center bg-blue-500 p-8">
        <h1 className="text-5xl font-bold text-white mb-4">MY LESSONS</h1>
        <p className="text-white text-xl">Create and manage your educational lessons</p>
      </div>

      {/* Lessons Content */}
      <div className="bg-gradient-card border border-white/10 rounded-2xl p-6 backdrop-blur-10">
        <h2 className="text-xl font-semibold text-text-primary mb-6">All Lessons</h2>
      {lessons.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-book text-primary-cyan text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No lessons yet</h3>
          <p className="text-text-secondary mb-6">Create your first lesson to get started.</p>
          <button
            onClick={onNewLesson}
            className="px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-cyan"
          >
            Create Lesson
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-bg-card border border-white/10 rounded-xl p-4 hover:border-primary-cyan/50 hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2">{lesson.title}</h3>
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

export default Lessons;
