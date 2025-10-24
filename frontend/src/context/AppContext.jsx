import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // Global state
  const [courses, setCourses] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState('day-mode')

  // Modal states
  const [showNewLessonModal, setShowNewLessonModal] = useState(false)
  const [showContentCreation, setShowContentCreation] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
    document.body.className = theme
  }, [theme])

  // Data loading function
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Fetch courses from API
      const coursesResponse = await fetch('http://localhost:3001/api/courses')
      const coursesData = await coursesResponse.json()
      setCourses(coursesData.data || [])
      
      // Fetch lessons from API
      const lessonsResponse = await fetch('http://localhost:3001/api/lessons')
      const lessonsData = await lessonsResponse.json()
      setLessons(lessonsData.data || [])
      
      setLoading(false)
    } catch (err) {
      setError('Failed to load data')
      setLoading(false)
    }
  }

  // Theme management
  const toggleTheme = () => {
    setTheme(theme === 'day-mode' ? 'night-mode' : 'day-mode')
  }

  // Lesson content management
  const hasLessonContent = (lessonId) => {
    const saved = localStorage.getItem(`content_${lessonId}`)
    if (saved) {
      const parsedContent = JSON.parse(saved)
      return Object.values(parsedContent.content).some(content => content !== null)
    }
    return false
  }

  // Modal management
  const openContentCreation = (lesson) => {
    setSelectedLesson(lesson)
    setShowContentCreation(true)
  }

  const closeContentCreation = () => {
    setShowContentCreation(false)
    setSelectedLesson(null)
  }

  const handleNewLesson = () => {
    setShowNewLessonModal(true)
  }

  const closeNewLessonModal = () => {
    setShowNewLessonModal(false)
    setSelectedCourse(null)
  }

  const handleLessonCreated = (lesson) => {
    setLessons([...lessons, lesson])
  }

  const handleContentComplete = (result) => {
    console.log('Content completed:', result)
    console.log('Closing content creation...')
    closeContentCreation()
    console.log('Opening template selector...')
    // Navigate to template selector after content creation is complete
    setShowTemplateSelector(true)
    console.log('Template selector should be open now')
  }

  const openNewLessonModal = (courseId = null, courseTitle = null) => {
    setSelectedCourse({ id: courseId, title: courseTitle })
    setShowNewLessonModal(true)
  }

  const handleTemplateSelect = (template) => {
    console.log('Template selected:', template)
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    
    // Navigate to lesson content view organized by template
    const lessonId = selectedLesson?.id || 'default-lesson'
    window.location.href = `/lesson-content/${lessonId}`
  }

  const closeTemplateSelector = () => {
    setShowTemplateSelector(false)
  }

  const value = {
    // State
    courses,
    setCourses,
    lessons,
    setLessons,
    loading,
    setLoading,
    error,
    setError,
    theme,
    setTheme,
    showNewLessonModal,
    setShowNewLessonModal,
    showContentCreation,
    setShowContentCreation,
    showTemplateSelector,
    setShowTemplateSelector,
    selectedLesson,
    setSelectedLesson,
    selectedCourse,
    setSelectedCourse,
    selectedTemplate,
    setSelectedTemplate,
    
    // Functions
    loadData,
    toggleTheme,
    hasLessonContent,
    openContentCreation,
    closeContentCreation,
    handleNewLesson,
    closeNewLessonModal,
    handleLessonCreated,
    handleContentComplete,
    openNewLessonModal,
    handleTemplateSelect,
    closeTemplateSelector
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
