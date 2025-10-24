import React from 'react';

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
  return (
    <div className="space-y-6 pt-20">
      {/* Page Title */}
      <div className="text-center bg-red-500 p-8">
        <h1 className="text-5xl font-bold text-white mb-4">MY COURSES</h1>
        <p className="text-white text-xl">Create and manage your educational courses</p>
      </div>

      {/* Create New Course */}
      <div className="bg-gradient-card border border-white/10 rounded-2xl p-6 backdrop-blur-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Create New Course</h2>
        <form onSubmit={onCreateCourse} className="space-y-4">
          <input
            type="text"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            placeholder="Course Title"
            className="w-full px-4 py-3 bg-bg-card border border-white/10 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-all duration-300"
          />
          <textarea
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            placeholder="Course Description"
            rows={3}
            className="w-full px-4 py-3 bg-bg-card border border-white/10 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-cyan transition-all duration-300 resize-none"
          />
          <button
            type="submit"
            disabled={!newCourse.title.trim()}
            className="px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-cyan"
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
            className="bg-gradient-card border border-white/10 rounded-2xl p-6 backdrop-blur-10 hover:border-primary-cyan/50 hover:shadow-hover hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            onClick={() => onViewCourse(course)}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-2">{course.title}</h3>
            <p className="text-text-secondary text-sm mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center px-3 py-1 bg-primary-cyan/20 text-primary-cyan text-xs font-medium rounded-full">
                {lessons.filter(l => l.courseId === course.id).length} lessons
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewCourse(course);
                }}
                className="px-4 py-2 bg-transparent text-text-primary border border-white/20 rounded-xl hover:bg-white/10 hover:border-primary-cyan transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-cyan"
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
