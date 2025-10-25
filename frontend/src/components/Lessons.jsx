import React from 'react';
import { useApp } from '../context/AppContext';

const Lessons = ({ lessons, hasLessonContent, onOpenContentCreation, onNewLesson }) => {
  const { theme } = useApp();
  
  return (
    <div className="pt-20 space-y-6">
      {/* Page Title */}
      <div className="text-center  from-emerald-600 via-emerald-700 to-emerald-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-4 drop-shadow-lg" style={{ 
            background: 'var(--gradient-primary)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>MY LESSONS</h1>
          <p className="text-xl font-medium" style={{ 
            background: 'var(--gradient-primary)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Create and manage your educational lessons with EDUCORE AI</p>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Lessons Content */}
      <div className={`border rounded-2xl p-6 shadow-lg ${theme === 'day-mode' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <h2 className="text-xl font-semibold mb-6" style={{ 
          background: 'var(--gradient-primary)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>All Lessons</h2>
      {lessons.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${theme === 'day-mode' ? 'from-emerald-100 to-emerald-200' : 'from-emerald-900/20 to-emerald-800/20'}`}>
                <i className={`fas fa-book text-2xl ${theme === 'day-mode' ? 'text-emerald-600' : 'text-emerald-400'}`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ 
                background: 'var(--gradient-primary)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>No lessons yet</h3>
              <p className={`mb-6 ${theme === 'day-mode' ? 'text-gray-600' : 'text-white'}`}>Create your first lesson to get started with EDUCORE AI.</p>
              <button
                onClick={onNewLesson}
                className={`px-8 py-4 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-lg ${theme === 'day-mode' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'}`}
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
              className={`border rounded-xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group ${theme === 'day-mode' ? 'bg-white border-gray-200 hover:border-emerald-300' : 'bg-gray-800 border-gray-700 hover:border-emerald-600'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 transition-colors group-hover:scale-105" style={{ 
                    background: 'var(--gradient-primary)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{lesson.title}</h3>
                  <p className={`text-sm leading-relaxed ${theme === 'day-mode' ? 'text-gray-600' : 'text-white'}`}>{lesson.description}</p>
                </div>
                <div className="ml-4">
                  <i className="fas fa-book text-emerald-500 text-xl"></i>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                  hasLessonContent(lesson.id)
                    ? theme === 'day-mode' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-900/20 text-emerald-400'
                    : theme === 'day-mode' ? 'bg-gray-100 text-gray-600' : 'bg-gray-700 text-gray-400'
                }`}>
                  <i className={`fas ${hasLessonContent(lesson.id) ? 'fa-check-circle' : 'fa-circle'} mr-1`}></i>
                  {hasLessonContent(lesson.id) ? 'Has Content' : 'No Content'}
                </span>
                <button
                  onClick={() => onOpenContentCreation(lesson)}
                  className={`px-4 py-2 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold ${theme === 'day-mode' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'}`}
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
