import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, handleNewLesson } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 shadow-lg h-32" >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* EDUCORE AI Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-[80px] w-auto  relative">
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/logo/${theme === 'day-mode' ? 'light' : 'dark'}`}
                alt="EDUCORE AI Logo"
                className="h-full w-auto object-contain mb-4 transition-all duration-300 hover:scale-105 drop-shadow-lg hover:drop-shadow-xl"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xl font-bold text-gray-800 dark:text-white leading-tight font-display bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                EDUCORE AI
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <button 
              onClick={() => navigate('/')}
              className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
              }`}
            >
              <i className="fas fa-home w-4 h-4 flex-shrink-0"></i>
              <span>Home</span>
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname.startsWith('/courses') 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
              }`}
            >
              <i className="fas fa-graduation-cap w-4 h-4 flex-shrink-0"></i>
              <span>Courses</span>
            </button>
            <button 
              onClick={() => navigate('/lessons')}
              className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === '/lessons' 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
              }`}
            >
              <i className="fas fa-book w-4 h-4 flex-shrink-0"></i>
              <span>Lessons</span>
            </button>
            <button 
              onClick={() => navigate('/analytics')}
              className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === '/analytics' 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
              }`}
            >
              <i className="fas fa-chart-line w-4 h-4 flex-shrink-0"></i>
              <span>Analytics</span>
            </button>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center gap-6">
            {/* Create Course Button */}
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 hover:border-emerald-700 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-plus w-4 h-4"></i>
              Create Course
            </button>

            {/* Create Lesson Button */}
            <button
              onClick={() => {
                navigate('/lessons');
                handleNewLesson();
              }}
              className="px-4 py-2 bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-700 dark:hover:border-emerald-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-plus w-4 h-4"></i>
              Create Lesson
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Toggle Theme"
            >
              <i className={`fas ${theme === 'day-mode' ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;