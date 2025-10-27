import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, handleNewLesson } = useApp();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b shadow-lg h-20 backdrop-blur-md ${theme === 'day-mode' ? 'bg-white/95 border-gray-200' : 'bg-slate-900/95 border-gray-600'}`} >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* EDUCORE AI Logo */}
          <div className="flex items-center space-x-4">
             <div className="flex-shrink-0 h-20 w-auto relative">
               <img
                 src={`${import.meta.env.VITE_API_URL || 'https://content-studio-production-76b6.up.railway.app'}/api/logo/${theme === 'day-mode' ? 'light' : 'dark'}`}
                 alt="EDUCORE AI Logo"
                 className="h-full w-auto object-contain transition-all duration-300 "
               />
            </div>
            <div className="flex flex-col justify-center">
                    
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <button 
              onClick={() => navigate('/')}
              className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === '/' 
                  ? theme === 'day-mode' ? 'text-emerald-600 bg-emerald-100' : 'text-emerald-400 bg-emerald-900/20' 
                  : theme === 'day-mode' ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50' : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
              }`}
            >
              <i className={`fas fa-home w-4 h-4 flex-shrink-0 ${location.pathname === '/' ? (theme === 'day-mode' ? 'text-emerald-600' : 'text-emerald-400') : (theme === 'day-mode' ? 'text-gray-600' : 'text-gray-300')}`}></i>
              <span>Home</span>
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname.startsWith('/courses') 
                  ? theme === 'day-mode' ? 'text-emerald-600 bg-emerald-100' : 'text-emerald-400 bg-emerald-900/20' 
                  : theme === 'day-mode' ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50' : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
              }`}
            >
              <i className={`fas fa-graduation-cap w-4 h-4 flex-shrink-0 ${location.pathname.startsWith('/courses') ? (theme === 'day-mode' ? 'text-emerald-600' : 'text-emerald-400') : (theme === 'day-mode' ? 'text-gray-600' : 'text-gray-300')}`}></i>
              <span>Courses</span>
            </button>
            <button 
              onClick={() => navigate('/lessons')}
              className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === '/lessons' 
                  ? theme === 'day-mode' ? 'text-emerald-600 bg-emerald-100' : 'text-emerald-400 bg-emerald-900/20' 
                  : theme === 'day-mode' ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50' : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
              }`}
            >
              <i className={`fas fa-book w-4 h-4 flex-shrink-0 ${location.pathname === '/lessons' ? (theme === 'day-mode' ? 'text-emerald-600' : 'text-emerald-400') : (theme === 'day-mode' ? 'text-gray-600' : 'text-gray-300')}`}></i>
              <span>Lessons</span>
            </button>
           
          </nav>
    {/* Theme Toggle */}
    <button
              onClick={toggleTheme}
              className={`w-10 h-10 border rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme === 'day-mode' ? 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-emerald-100' : 'bg-gray-800 border-gray-700 text-white hover:bg-emerald-900/20'}`}
              title="Toggle Theme"
            >
              <i className={`fas ${theme === 'day-mode' ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
            </button>
          {/* Header Controls */}
          <div className="flex items-center gap-6">
            {/* Create Course Button */}
            <button
              onClick={() => navigate('/courses')}
              className={`px-4 py-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium flex items-center gap-2 ${theme === 'day-mode' ? 'bg-transparent text-emerald-600 border border-emerald-600 hover:bg-emerald-50 hover:border-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500 hover:border-emerald-600 shadow-lg'}`}
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
              className={`px-4 py-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium flex items-center gap-2 ${theme === 'day-mode' ? 'bg-transparent text-emerald-600 border border-emerald-600 hover:bg-emerald-50 hover:border-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500 hover:border-emerald-600 shadow-lg'}`}
            >
              <i className="fas fa-plus w-4 h-4"></i>
              Create Lesson
            </button>

        
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;