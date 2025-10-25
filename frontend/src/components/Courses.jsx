import React from 'react';
import { useApp } from '../context/AppContext';

const Courses = ({ 
  courses, 
  lessons, 
  newCourse, 
  setNewCourse, 
  onCreateCourse, 
  onViewCourse,
  showAddLesson,
  newLesson,
  setNewLesson,
  onCreateLesson 
}) => {
  const { theme } = useApp();
  return (
    <div className="space-y-6 pt-20">
      {/* Page Title */}
      <div className="text-center bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg" style={{ 
            background: 'var(--gradient-primary)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>MY COURSES</h1>
          <p className="text-xl font-medium" style={{ 
            background: 'var(--gradient-primary)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Create and manage your educational courses</p>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Create New Course */}
      <div className={`border rounded-2xl p-6 shadow-lg ${theme === 'day-mode' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <h2 className="text-xl font-semibold mb-4" style={{ 
          background: 'var(--gradient-primary)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Create New Course</h2>
        <form onSubmit={onCreateCourse} className="space-y-4">
          <input
            type="text"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            placeholder="Course Title"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 ${theme === 'day-mode' ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500' : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'}`}
          />
          <textarea
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            placeholder="Course Description"
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 resize-none ${theme === 'day-mode' ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500' : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'}`}
          />
          <button
            type="submit"
            disabled={!newCourse.title.trim()}
            className={`px-6 py-3 rounded-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme === 'day-mode' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white hover:shadow-xl' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'}`}
          >
            Create Course
          </button>
        </form>

        {showAddLesson && (
          <div className="mt-6 p-4 bg-primary-cyan/10 border border-primary-cyan/20 rounded-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Course Created! Add your first lesson:
            </h3>
            <form onSubmit={onCreateLesson} className="space-y-3">
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="Lesson Title"
                className="w-full px-4 py-3 bg-bg-card border border-white/10 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-all duration-300"
              />
              <textarea
                value={newLesson.description}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                placeholder="Lesson Description"
                rows={2}
                className="w-full px-4 py-3 bg-bg-card border border-white/10 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-all duration-300 resize-none"
              />
              <button
                type="submit"
                disabled={!newLesson.title.trim()}
                className="px-4 py-2 bg-gradient-primary text-white rounded-xl hover:shadow-glow hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-cyan"
              >
                Add Lesson
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer ${theme === 'day-mode' ? 'bg-white border-gray-200 hover:border-emerald-300' : 'bg-gray-800 border-gray-700 hover:border-emerald-600'}`}
              onClick={() => onViewCourse(course)}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ 
                background: 'var(--gradient-primary)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{course.title}</h3>
              <p className={`text-sm mb-4 ${theme === 'day-mode' ? 'text-gray-600' : 'text-white'}`}>{course.description}</p>
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${theme === 'day-mode' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-900/20 text-emerald-400'}`}>
                  {lessons.filter(l => l.courseId === course.id).length} lessons
                </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewCourse(course);
                }}
                className={`px-4 py-2 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme === 'day-mode' ? 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-emerald-500' : 'bg-transparent text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-emerald-500'}`}
              >
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
