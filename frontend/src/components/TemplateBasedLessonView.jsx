import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TemplateBasedLessonView = () => {
  const { selectedTemplate, selectedLesson, selectedCourse } = useApp();
  const { lessonId } = useParams();
  const [lessonContent, setLessonContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonContent = async () => {
      // Get lesson ID from URL params or context
      const currentLessonId = lessonId || selectedLesson?.id;
      
      if (!currentLessonId) {
        setError('No lesson ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/content/lesson/${currentLessonId}`);
        const data = await response.json();
        
        if (data.success) {
          setLessonContent(data.data);
        } else {
          setError('Failed to load lesson content');
        }
      } catch (err) {
        console.error('Error fetching lesson content:', err);
        setError('Error loading lesson content');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonContent();
  }, [lessonId, selectedLesson?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Lesson Content</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch your lesson content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Content</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedTemplate || !selectedLesson || !lessonContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Template Selected</h2>
          <p className="text-gray-600 dark:text-gray-300">Please select a template to view the lesson content.</p>
        </div>
      </div>
    );
  }

  const getContentForFormat = (formatName) => {
    const formatKey = formatName.toLowerCase().replace(' ', '');
    return lessonContent.content[formatKey] || { title: formatName, content: "Content for " + formatName };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {lessonContent.lesson.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Following the <strong>{lessonContent.template.name}</strong> template structure
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
            {lessonContent.lesson.description}
          </p>
          {lessonContent.metadata && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>⏱️ {lessonContent.metadata.estimatedTime}</span>
              <span>📊 {lessonContent.metadata.progress}% Complete</span>
              <span>🎯 {lessonContent.metadata.difficulty}</span>
            </div>
          )}
        </div>

        {/* Template Structure Indicator */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
            Template Structure: {lessonContent.template.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{lessonContent.template.description}</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {lessonContent.template.formats.map((format, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {format.order}
                </div>
                <span className="text-xl ml-2">{format.icon}</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                  {format.name}
                </span>
                {index < lessonContent.template.formats.length - 1 && (
                  <div className="w-6 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 mx-2 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Content Organized by Template */}
        <div className="space-y-8">
          {lessonContent.template.formats.map((format, index) => {
            const content = getContentForFormat(format.name);
            return (
              <div
                key={index}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{format.icon}</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {content.title}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                        {format.name}
                      </span>
                    </div>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {content.content}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
                        <span>📖</span>
                        View {format.name} Content
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
              <span className="flex items-center gap-2">
                <span>✅</span>
                Complete Lesson
                <span>🎉</span>
              </span>
            </button>
            
            <button className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
              <span className="flex items-center gap-2">
                <span>📝</span>
                Edit Content
                <span>✏️</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBasedLessonView;
