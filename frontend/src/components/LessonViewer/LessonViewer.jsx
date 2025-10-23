import React, { useState, useEffect } from 'react';
import {
  VideoCameraIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  MapIcon,
  CodeBracketIcon,
  PhotoIcon,
  PlayIcon,
  EyeIcon,
  DownloadIcon,
  ShareIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export default function LessonViewer({ lesson, course, onBack }) {
  const [activeFormat, setActiveFormat] = useState('overview');
  const [lessonContent, setLessonContent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLessonContent();
  }, [lesson.id]);

  const loadLessonContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3001/api/v1/lesson-content/${lesson.id}/formats`);
      const data = await response.json();
      
      if (data.success) {
        setLessonContent(data.data);
      } else {
        setError(data.error || 'Failed to load lesson content');
      }
    } catch (err) {
      console.error('Error loading lesson content:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatIcons = {
    video: VideoCameraIcon,
    text: DocumentTextIcon,
    presentation: PresentationChartBarIcon,
    mindmap: MapIcon,
    code: CodeBracketIcon,
    images: PhotoIcon
  };

  const formatNames = {
    video: 'Video Content',
    text: 'Text & Explanations',
    presentation: 'Presentation Slides',
    mindmap: 'Mind Map',
    code: 'Code Snippets',
    images: 'Images & Visuals'
  };

  const getFormatPreview = (formatType, content) => {
    if (!content || !content.data) return null;
    
    switch (formatType) {
      case 'video':
        return content.data.transcription ? 
          `${content.data.transcription.substring(0, 200)}...` : 
          'Video content available';
      case 'text':
        return content.data.content ? 
          `${content.data.content.substring(0, 200)}...` : 
          'Text content available';
      case 'presentation':
        return content.data.slides ? 
          `${content.data.slides.length} slides` : 
          'Presentation available';
      case 'mindmap':
        return content.data.nodes ? 
          `${content.data.nodes.length} nodes, ${content.data.connections?.length || 0} connections` : 
          'Mind map available';
      case 'code':
        return content.data.code ? 
          `${content.data.code.substring(0, 200)}...` : 
          'Code available';
      case 'images':
        return content.data.files ? 
          `${content.data.files.length} images` : 
          'Images available';
      default:
        return 'Content available';
    }
  };

  const renderFormatContent = (formatType, content) => {
    if (!content || !content.data) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {formatIcons[formatType] && React.createElement(formatIcons[formatType], { className: "h-12 w-12 mx-auto" })}
          </div>
          <p className="text-gray-500">No {formatNames[formatType]} available</p>
        </div>
      );
    }

    switch (formatType) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Video Transcription</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{content.data.transcription}</p>
            </div>
            {content.data.notes && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Key Notes</h4>
                <p className="text-blue-700">{content.data.notes}</p>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="prose max-w-none">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Detailed Explanation</h4>
              <div className="text-gray-700 whitespace-pre-wrap">{content.data.content}</div>
            </div>
          </div>
        );

      case 'presentation':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.data.slides?.map((slide, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Slide {index + 1}</h4>
                    <span className="text-xs text-gray-500">{slide.id}</span>
                  </div>
                  <h5 className="font-medium text-gray-800 mb-2">{slide.title}</h5>
                  <p className="text-sm text-gray-600 mb-3">{slide.content}</p>
                  {slide.notes && (
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500">Notes: {slide.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'mindmap':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Interactive Mind Map</h4>
              <div className="text-sm text-gray-600 mb-4">
                {content.data.nodes?.length || 0} nodes, {content.data.connections?.length || 0} connections
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <MapIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Interactive mind map visualization would be rendered here</p>
              </div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-white">Code Snippet</h4>
                <span className="text-xs text-gray-400">{content.data.language || 'javascript'}</span>
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{content.data.code}</code>
              </pre>
            </div>
            {content.data.explanation && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Code Explanation</h4>
                <p className="text-blue-700">{content.data.explanation}</p>
              </div>
            )}
          </div>
        );

      case 'images':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.data.files?.map((file, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-3">
                    <div className="flex items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900">{file.name}</h4>
                  <p className="text-sm text-gray-500">{file.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">Content format not supported</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const availableFormats = Object.keys(lessonContent);
  const completedFormats = availableFormats.filter(format => 
    lessonContent[format]?.content?.completed
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Course
          </button>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span className="flex items-center">
            <BookOpenIcon className="h-4 w-4 mr-1" />
            {course.title}
          </span>
          <span className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {lesson.metadata?.estimatedDuration || 'N/A'}
          </span>
          <span className="flex items-center">
            <UserIcon className="h-4 w-4 mr-1" />
            {course.author_name || 'Unknown Author'}
          </span>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlayIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Content Formats</p>
              <p className="text-2xl font-semibold text-gray-900">{availableFormats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedFormats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {availableFormats.length > 0 ? Math.round((completedFormats.length / availableFormats.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Format Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveFormat('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeFormat === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            {availableFormats.map((format) => (
              <button
                key={format}
                onClick={() => setActiveFormat(format)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeFormat === format
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {formatIcons[format] && React.createElement(formatIcons[format], { className: "h-4 w-4 mr-2" })}
                {formatNames[format]}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {activeFormat === 'overview' ? (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lesson Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFormats.map((format) => (
                <div key={format} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {formatIcons[format] && React.createElement(formatIcons[format], { className: "h-5 w-5 text-gray-600 mr-2" })}
                    <h4 className="font-medium text-gray-900">{formatNames[format]}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {getFormatPreview(format, lessonContent[format])}
                  </p>
                  <button
                    onClick={() => setActiveFormat(format)}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {formatNames[activeFormat]}
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
            {renderFormatContent(activeFormat, lessonContent[activeFormat])}
          </div>
        )}
      </div>
    </div>
  );
}

