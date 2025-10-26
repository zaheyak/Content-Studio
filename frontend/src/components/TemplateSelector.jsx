import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const TemplateSelector = ({ onSelectTemplate }) => {
  console.log('TemplateSelector component loaded');
  const { theme } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Default function if onSelectTemplate is not provided
  const defaultTemplateHandler = onSelectTemplate || (() => {
    console.log('No onSelectTemplate provided, using default handler');
  });

  // Mock templates with all lesson formats in different orders
  const templates = [
    {
      id: 'learning-flow',
      name: 'Learning Flow',
      description: 'Traditional learning progression from video to practice',
      formats: [
        { name: 'Video', icon: '🎥', color: theme === 'day-mode' ? 'bg-red-100 text-red-600' : 'bg-red-900/20 text-red-400' },
        { name: 'Explanation', icon: '🧾', color: theme === 'day-mode' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/20 text-blue-400' },
        { name: 'Code', icon: '💻', color: theme === 'day-mode' ? 'bg-green-100 text-green-600' : 'bg-green-900/20 text-green-400' },
        { name: 'Mind Map', icon: '🧠', color: theme === 'day-mode' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/20 text-purple-400' },
        { name: 'Image', icon: '🖼️', color: theme === 'day-mode' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-900/20 text-yellow-400' },
        { name: 'Presentation', icon: '📊', color: theme === 'day-mode' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-900/20 text-indigo-400' }
      ]
    },
    {
      id: 'code-first',
      name: 'Code First',
      description: 'Start with hands-on coding, then explain concepts',
      formats: [
        { name: 'Code', icon: '💻', color: theme === 'day-mode' ? 'bg-green-100 text-green-600' : 'bg-green-900/20 text-green-400' },
        { name: 'Explanation', icon: '🧾', color: theme === 'day-mode' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/20 text-blue-400' },
        { name: 'Mind Map', icon: '🧠', color: theme === 'day-mode' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/20 text-purple-400' },
        { name: 'Video', icon: '🎥', color: theme === 'day-mode' ? 'bg-red-100 text-red-600' : 'bg-red-900/20 text-red-400' },
        { name: 'Presentation', icon: '📊', color: theme === 'day-mode' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-900/20 text-indigo-400' },
        { name: 'Image', icon: '🖼️', color: theme === 'day-mode' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-900/20 text-yellow-400' }
      ]
    },
    {
      id: 'visual-first',
      name: 'Visual First',
      description: 'Lead with visual content to engage learners',
      formats: [
        { name: 'Image', icon: '🖼️', color: theme === 'day-mode' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-900/20 text-yellow-400' },
        { name: 'Mind Map', icon: '🧠', color: theme === 'day-mode' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/20 text-purple-400' },
        { name: 'Video', icon: '🎥', color: theme === 'day-mode' ? 'bg-red-100 text-red-600' : 'bg-red-900/20 text-red-400' },
        { name: 'Explanation', icon: '🧾', color: theme === 'day-mode' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/20 text-blue-400' },
        { name: 'Code', icon: '💻', color: theme === 'day-mode' ? 'bg-green-100 text-green-600' : 'bg-green-900/20 text-green-400' },
        { name: 'Presentation', icon: '📊', color: theme === 'day-mode' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-900/20 text-indigo-400' }
      ]
    },
    {
      id: 'presentation-mode',
      name: 'Presentation Mode',
      description: 'Structured presentation followed by interactive content',
      formats: [
        { name: 'Presentation', icon: '📊', color: theme === 'day-mode' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-900/20 text-indigo-400' },
        { name: 'Video', icon: '🎥', color: theme === 'day-mode' ? 'bg-red-100 text-red-600' : 'bg-red-900/20 text-red-400' },
        { name: 'Explanation', icon: '🧾', color: theme === 'day-mode' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/20 text-blue-400' },
        { name: 'Code', icon: '💻', color: theme === 'day-mode' ? 'bg-green-100 text-green-600' : 'bg-green-900/20 text-green-400' },
        { name: 'Mind Map', icon: '🧠', color: theme === 'day-mode' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/20 text-purple-400' },
        { name: 'Image', icon: '🖼️', color: theme === 'day-mode' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-900/20 text-yellow-400' }
      ]
    },
    {
      id: 'mind-map-central',
      name: 'Mind Map Central',
      description: 'Start with mind mapping to organize knowledge',
      formats: [
        { name: 'Mind Map', icon: '🧠', color: theme === 'day-mode' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/20 text-purple-400' },
        { name: 'Video', icon: '🎥', color: theme === 'day-mode' ? 'bg-red-100 text-red-600' : 'bg-red-900/20 text-red-400' },
        { name: 'Explanation', icon: '🧾', color: theme === 'day-mode' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/20 text-blue-400' },
        { name: 'Code', icon: '💻', color: theme === 'day-mode' ? 'bg-green-100 text-green-600' : 'bg-green-900/20 text-green-400' },
        { name: 'Presentation', icon: '📊', color: theme === 'day-mode' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-900/20 text-indigo-400' },
        { name: 'Image', icon: '🖼️', color: theme === 'day-mode' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-900/20 text-yellow-400' }
      ]
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Call the template select handler if provided
      if (onSelectTemplate) {
        onSelectTemplate(selectedTemplate);
      }
      // Navigate to lesson content view with the selected template
      const lessonId = 'default-lesson'; // You can get this from context or props
      window.location.href = `/lesson-content/${lessonId}?template=${selectedTemplate.id}`;
    }
  };

  const handleKeyDown = (e, template) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTemplateSelect(template);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Choose Your Lesson Template
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select a template to structure your lesson content and create engaging learning experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Templates Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  onKeyDown={(e) => handleKeyDown(e, template)}
                  className={`
                    relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300
                    hover:shadow-xl hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-blue-500/50
                    backdrop-blur-sm
                    ${selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-xl ring-2 ring-blue-500/20'
                      : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-gray-800'
                    }
                  `}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${template.name} template`}
                >
                  {/* Selection indicator */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Template header */}
                  <div className="mb-5">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {template.name}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Format icons */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    {template.formats.map((format, index) => (
                      <div
                        key={index}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                          transition-all duration-200 hover:scale-105
                          ${format.color}
                        `}
                      >
                        <span className="text-lg">{format.icon}</span>
                        <span className="font-semibold">{format.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Format order indicator */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {template.formats.map((format, index) => (
                      <div key={index} className="flex items-center flex-shrink-0">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                          transition-all duration-200
                          ${selectedTemplate?.id === template.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }
                        `}>
                          {index + 1}
                        </div>
                        <span className="text-xl ml-2">{format.icon}</span>
                        {index < template.formats.length - 1 && (
                          <div className="w-6 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 mx-2 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            {selectedTemplate ? (
              <div className="sticky top-6">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedTemplate.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-6 mb-8">
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedTemplate.description}
                    </p>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
                        Content Flow
                      </h4>
                      <div className="space-y-3">
                        {selectedTemplate.formats.map((format, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 transition-all duration-200 hover:shadow-md"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                              {index + 1}
                            </div>
                            <span className="text-2xl">{format.icon}</span>
                            <span className="font-semibold text-gray-900 dark:text-white text-lg">
                              {format.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleUseTemplate}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>✨</span>
                      Use This Template
                      <span>🚀</span>
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="sticky top-6">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      Select a Template
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Click on a template card to see the preview and content flow
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>💡</span>
                      <span>Choose the perfect structure for your lesson</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard navigation hint */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <span className="text-lg">⌨️</span>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Use <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Tab</kbd> to navigate and <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to select
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
