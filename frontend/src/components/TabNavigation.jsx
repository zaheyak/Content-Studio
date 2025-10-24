import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl p-4 backdrop-blur-10">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'courses'
              ? 'bg-gradient-primary text-white shadow-glow'
              : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/10'
          }`}
        >
          <i className="fas fa-graduation-cap mr-2"></i>
          Courses
        </button>
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'lessons'
              ? 'bg-gradient-primary text-white shadow-glow'
              : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/10'
          }`}
        >
          <i className="fas fa-book mr-2"></i>
          Lessons
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
