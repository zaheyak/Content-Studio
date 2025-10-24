import React from 'react'
import { useApp } from '../context/AppContext'
import NewLessonCreation from './NewLessonCreation'
import ContentCreationWorkflow from './ContentCreation/ContentCreationWorkflow'
import TemplateSelector from './TemplateSelector'

const ModalsManager = () => {
  const {
    showNewLessonModal,
    showContentCreation,
    showTemplateSelector,
    selectedLesson,
    selectedCourse,
    closeNewLessonModal,
    closeContentCreation,
    handleContentComplete,
    openNewLessonModal,
    handleTemplateSelect,
    closeTemplateSelector
  } = useApp()

  return (
    <>
      {/* New Lesson Creation Modal */}
      {showNewLessonModal && (
        <NewLessonCreation
          isOpen={showNewLessonModal}
          onClose={closeNewLessonModal}
          onNavigateToContent={(lesson) => {
            openNewLessonModal(lesson.id, lesson.title);
          }}
          courseId={selectedCourse?.id}
          courseTitle={selectedCourse?.title}
        />
      )}

      {/* Content Creation Workflow Modal */}
      {showContentCreation && selectedLesson && (
        <ContentCreationWorkflow
          lesson={selectedLesson}
          course={selectedCourse}
          onClose={closeContentCreation}
          onComplete={handleContentComplete}
        />
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <TemplateSelector onSelectTemplate={handleTemplateSelect} />
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeTemplateSelector}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ModalsManager
