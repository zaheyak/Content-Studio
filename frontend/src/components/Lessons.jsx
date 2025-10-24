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
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">All Lessons</h2>
      {lessons.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-book text-blue-600 dark:text-blue-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No lessons yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first lesson to get started.</p>
          <button
            onClick={onNewLesson}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Lesson
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{lesson.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{lesson.description}</p>
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                  hasLessonContent(lesson.id)
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {hasLessonContent(lesson.id) ? 'Has Content' : 'No Content'}
                </span>
                <button
                  onClick={() => onOpenContentCreation(lesson)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
