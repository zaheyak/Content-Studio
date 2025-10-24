import React from 'react';

const Lessons = ({ lessons, hasLessonContent, onOpenContentCreation, onNewLesson }) => {
  return (
    <div className="pt-20 space-y-6">
      {/* Page Title */}
      <div className="text-center bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">MY LESSONS</h1>
          <p className="text-white/90 text-xl font-medium">Create and manage your educational lessons with EDUCORE AI</p>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Lessons Content */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">All Lessons</h2>
      {lessons.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-book text-emerald-600 dark:text-emerald-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No lessons yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first lesson to get started with EDUCORE AI.</p>
              <button
                onClick={onNewLesson}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-lg"
              >
                <i className="fas fa-plus mr-2"></i>
                Create Lesson
              </button>
            </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{lesson.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{lesson.description}</p>
                </div>
                <div className="ml-4">
                  <i className="fas fa-book text-emerald-500 text-xl"></i>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                  hasLessonContent(lesson.id)
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  <i className={`fas ${hasLessonContent(lesson.id) ? 'fa-check-circle' : 'fa-circle'} mr-1`}></i>
                  {hasLessonContent(lesson.id) ? 'Has Content' : 'No Content'}
                </span>
                <button
                  onClick={() => onOpenContentCreation(lesson)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                >
                  <i className="fas fa-edit mr-1"></i>
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
