import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  PlayIcon, 
  DocumentTextIcon, 
  PresentationChartBarIcon,
  MapIcon,
  CodeBracketIcon,
  PhotoIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Import content creation components
import VideoContentCreation from './VideoContentCreation';
import TextContentCreation from './TextContentCreation';
import PresentationContentCreation from './PresentationContentCreation';
import MindMapContentCreation from './MindMapContentCreation';
import CodeContentCreation from './CodeContentCreation';
import ImageContentCreation from './ImageContentCreation';

export default function ContentCreationWorkflow({ isOpen, onClose, onSuccess, lesson, course }) {
  const [currentFormat, setCurrentFormat] = useState(null);
  const [completedFormats, setCompletedFormats] = useState(new Set());
  const [contentData, setContentData] = useState({
    video: null,
    text: null,
    presentation: null,
    mindmap: null,
    code: null,
    images: null
  });
  const [settings, setSettings] = useState({
    video: { useAI: true, transcription: true, avatar: false },
    text: { useAI: true, generateExplanations: true, generateSummaries: true },
    presentation: { useAI: true, autoGenerate: true, template: 'default' },
    mindmap: { useAI: true, autoGenerate: true },
    code: { useAI: true, generateExamples: true, includeComments: true },
    images: { useAI: true, generateVisuals: true, style: 'professional' }
  });
  const [lessonCompletion, setLessonCompletion] = useState(false);

  const contentFormats = [
    {
      id: 'video',
      name: 'Video',
      icon: PlayIcon,
      description: 'Upload video for transcription or generate AI avatar video',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'text',
      name: 'Text & Explanations',
      icon: DocumentTextIcon,
      description: 'Create text content manually or use AI for explanations',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'presentation',
      name: 'Presentation (Slides)',
      icon: PresentationChartBarIcon,
      description: 'Build slides manually or let AI generate presentations',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'mindmap',
      name: 'Mind Map',
      icon: MapIcon,
      description: 'Generate visual mind maps manually or with AI',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'code',
      name: 'Code Snippets',
      icon: CodeBracketIcon,
      description: 'Add code samples manually or request AI generation',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'images',
      name: 'Images & Visuals',
      icon: PhotoIcon,
      description: 'Upload custom images or use AI to create visuals',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  useEffect(() => {
    // Load default settings from Directory Service (simulated)
    loadDefaultSettings();
  }, []);

  const loadDefaultSettings = () => {
    // In a real app, this would fetch from Directory Service
    // For now, we'll use the default settings
    console.log('Loading default settings from Directory Service...');
  };

  const handleFormatSelect = (formatId) => {
    setCurrentFormat(formatId);
  };

  const handleContentComplete = (formatId, content) => {
    setContentData(prev => ({
      ...prev,
      [formatId]: content
    }));
    setCompletedFormats(prev => {
      const newCompleted = new Set([...prev, formatId]);
      // Check if all required formats are completed
      if (newCompleted.size === contentFormats.length) {
        setLessonCompletion(true);
      }
      return newCompleted;
    });
  };

  const handleSettingsChange = (formatId, newSettings) => {
    setSettings(prev => ({
      ...prev,
      [formatId]: { ...prev[formatId], ...newSettings }
    }));
  };

  const handleSaveAndContinue = async () => {
    try {
      // Check if all formats are completed
      if (completedFormats.size < contentFormats.length) {
        alert(`Please complete all content formats before marking the lesson as ready. Missing: ${contentFormats.length - completedFormats.size} formats.`);
        return;
      }

      // Simulate saving content for microservice
      const updatedLesson = {
        ...lesson,
        content_data: {
          ...lesson.content_data,
          contentFormats: {
            video: { completed: true, required: true, data: contentData.video },
            text: { completed: true, required: true, data: contentData.text },
            presentation: { completed: true, required: true, data: contentData.presentation },
            mindmap: { completed: true, required: true, data: contentData.mindmap },
            code: { completed: true, required: true, data: contentData.code },
            images: { completed: true, required: true, data: contentData.images }
          },
          completionStatus: 'COMPLETED',
          allFormatsCompleted: true
        },
        updated_at: new Date().toISOString()
      };

      // Simulate successful save
      setTimeout(() => {
        onSuccess(updatedLesson);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    }
  };

  const getCompletionPercentage = () => {
    return Math.round((completedFormats.size / contentFormats.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Content Creation Workflow</h3>
            <p className="text-sm text-gray-500 mt-1">
              Lesson: {lesson?.title} | Course: {course?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(95vh-140px)]">
          {/* Sidebar - Format Selection */}
          <div className="w-1/3 border-r bg-gray-50 p-6 overflow-y-auto">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Content Formats</h4>
              <div className="text-xs text-gray-500 mb-2">
                Progress: {getCompletionPercentage()}% complete
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
              {completedFormats.size < contentFormats.length && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  ⚠️ All {contentFormats.length} content formats must be completed before marking the lesson as ready.
                </div>
              )}
              {completedFormats.size === contentFormats.length && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  ✅ All content formats completed! You can now mark the lesson as ready.
                </div>
              )}
            </div>

            <div className="space-y-3">
              {contentFormats.map((format) => {
                const Icon = format.icon;
                const isCompleted = completedFormats.has(format.id);
                const isSelected = currentFormat === format.id;
                
                return (
                  <button
                    key={format.id}
                    onClick={() => handleFormatSelect(format.id)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50' 
                        : isCompleted
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-md ${format.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{format.name}</span>
                          {isCompleted && <CheckIcon className="h-4 w-4 text-green-600" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                      </div>
                      {isSelected && (
                        <ArrowRightIcon className="h-4 w-4 text-primary-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Settings Panel */}
            {currentFormat && (
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h5 className="text-sm font-medium text-gray-900 mb-3">Settings</h5>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings[currentFormat]?.useAI || false}
                      onChange={(e) => handleSettingsChange(currentFormat, { useAI: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-xs text-gray-700">Use AI assistance</span>
                  </label>
                  
                  {currentFormat === 'video' && (
                    <>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings[currentFormat]?.transcription || false}
                          onChange={(e) => handleSettingsChange(currentFormat, { transcription: e.target.checked })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-xs text-gray-700">Auto transcription</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings[currentFormat]?.avatar || false}
                          onChange={(e) => handleSettingsChange(currentFormat, { avatar: e.target.checked })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-xs text-gray-700">Generate avatar video</span>
                      </label>
                    </>
                  )}
                  
                  {currentFormat === 'text' && (
                    <>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings[currentFormat]?.generateExplanations || false}
                          onChange={(e) => handleSettingsChange(currentFormat, { generateExplanations: e.target.checked })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-xs text-gray-700">Generate explanations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings[currentFormat]?.generateSummaries || false}
                          onChange={(e) => handleSettingsChange(currentFormat, { generateSummaries: e.target.checked })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-xs text-gray-700">Generate summaries</span>
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentFormat ? (
              <div>
                {currentFormat === 'video' && (
                  <VideoContentCreation
                    lesson={lesson}
                    settings={settings.video}
                    onComplete={(content) => handleContentComplete('video', content)}
                    onSettingsChange={(newSettings) => handleSettingsChange('video', newSettings)}
                  />
                )}
                
                {currentFormat === 'text' && (
                  <TextContentCreation
                    lesson={lesson}
                    settings={settings.text}
                    onComplete={(content) => handleContentComplete('text', content)}
                    onSettingsChange={(newSettings) => handleSettingsChange('text', newSettings)}
                  />
                )}
                
                {currentFormat === 'presentation' && (
                  <PresentationContentCreation
                    lesson={lesson}
                    settings={settings.presentation}
                    onComplete={(content) => handleContentComplete('presentation', content)}
                    onSettingsChange={(newSettings) => handleSettingsChange('presentation', newSettings)}
                  />
                )}
                
                {currentFormat === 'mindmap' && (
                  <MindMapContentCreation
                    lesson={lesson}
                    settings={settings.mindmap}
                    onComplete={(content) => handleContentComplete('mindmap', content)}
                    onSettingsChange={(newSettings) => handleSettingsChange('mindmap', newSettings)}
                  />
                )}
                
                {currentFormat === 'code' && (
                  <CodeContentCreation
                    lesson={lesson}
                    settings={settings.code}
                    onComplete={(content) => handleContentComplete('code', content)}
                    onSettingsChange={(newSettings) => handleSettingsChange('code', newSettings)}
                  />
                )}
                
                {currentFormat === 'images' && (
                  <ImageContentCreation
                    lesson={lesson}
                    settings={settings.images}
                    onComplete={(content) => handleContentComplete('images', content)}
                    onSettingsChange={(newSettings) => handleSettingsChange('images', newSettings)}
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a Content Format</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a content format from the sidebar to start creating your lesson content.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {completedFormats.size} of {contentFormats.length} formats completed
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndContinue}
              disabled={completedFormats.size < contentFormats.length}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                completedFormats.size < contentFormats.length
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'text-white bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {completedFormats.size < contentFormats.length 
                ? `Complete All Formats (${completedFormats.size}/${contentFormats.length})`
                : 'Mark Lesson as Ready'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


