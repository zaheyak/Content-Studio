import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'
import BackgroundAnimation from './components/BackgroundAnimation'
import ModalsManager from './components/ModalsManager'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import LessonsPage from './pages/LessonsPage'
import CourseDetailPage from './pages/CourseDetailPage'
import TemplateBasedLessonView from './components/TemplateBasedLessonView'
import TemplateSelector from './components/TemplateSelector'
function AppContent() {
  const { loading, error, theme } = useApp()

  // Clear old localStorage on first load
  React.useEffect(() => {
    const hasCleared = localStorage.getItem('localStorage_cleared_v1');
    if (!hasCleared) {
      // Clear all old content_ keys
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('content_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('localStorage_cleared_v1', 'true');
      console.log('✅ Cleared old localStorage data');
    }
  }, []);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className={`min-h-screen text-gray-800 transition-colors duration-300 ${theme === 'day-mode' ? 'bg-gray-50' : 'bg-slate-900 text-white'}`}>
        <BackgroundAnimation />
        
        <Header />

        <main className="pt-24">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="text-red-600 text-sm font-medium">
                  {error}
                </div>
              </div>
            )}

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/template-selector" element={<TemplateSelector />} />
              <Route path="/lesson-content/:lessonId?" element={<TemplateBasedLessonView />} />
            </Routes>
          </div>
        </main>

        <ModalsManager />
      </div>
    </Router>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App