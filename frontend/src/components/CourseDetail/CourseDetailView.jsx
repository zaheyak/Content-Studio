import { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import NewLessonCreation from '../LessonCreation/NewLessonCreation';
import StepByStepContentBuilder from '../ContentCreation/StepByStepContentBuilder';
import LessonViewer from '../LessonViewer/LessonViewer';

export default function CourseDetailView({ course, onBack, onCourseUpdated }) {
  const [lessons, setLessons] = useState(course.lessons || []);
  const [content, setContent] = useState([]);
  const [activeTab, setActiveTab] = useState('lessons');
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [showContentBuilder, setShowContentBuilder] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLessonViewer, setShowLessonViewer] = useState(false);

  useEffect(() => {
    fetchCourseContent();
  }, [course.id]);

  const fetchCourseContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3001/api/v1/content?course_id=${course.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonCreated = (newLesson) => {
    setLessons(prev => [...prev, newLesson]);
    setShowCreateLesson(false);
    // Automatically start content creation workflow
    setSelectedLesson(newLesson);
    setShowContentBuilder(true);
  };

  const handleContentBuilderCompleted = (updatedLesson) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === updatedLesson.id ? updatedLesson : lesson
    ));
    setShowContentBuilder(false);
    setSelectedLesson(null);
    // Refresh content list
    fetchCourseContent();
  };

  const handleStartContentCreation = (lesson) => {
    setSelectedLesson(lesson);
    setShowContentBuilder(true);
  };

  const handleViewLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonViewer(true);
  };

  const handleBackFromLessonViewer = () => {
    setShowLessonViewer(false);
    setSelectedLesson(null);
  };

  const getLessonStatusIcon = (lesson) => {
    if (lesson.status === 'COMPLETED') {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else if (lesson.status === 'IN_PROGRESS') {
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    } else {
      return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCompletionPercentage = (lesson) => {
    if (!lesson.contentFormats) return 0;
    const completed = Object.values(lesson.contentFormats).filter(format => format.completed).length;
    return Math.round((completed / 6) * 100);
  };

  if (showLessonViewer && selectedLesson) {
    return (
      <LessonViewer
        lesson={selectedLesson}
        course={course}
        onBack={handleBackFromLessonViewer}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Courses
          </button>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-2 text-gray-600">{course.description}</p>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <PlayIcon className="h-4 w-4 mr-1" />
                {lessons.length} lessons
              </span>
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {course.metadata?.estimatedDuration || 'N/A'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowCreateLesson(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Lesson
          </button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlayIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Lessons</p>
              <p className="text-2xl font-semibold text-gray-900">{lessons.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {lessons.filter(l => l.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {lessons.filter(l => l.status === 'IN_PROGRESS').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lessons'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lessons
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Content
          </button>
        </nav>
      </div>

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Lessons</h2>
        
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <PlayIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No lessons yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first lesson to get started with this course.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateLesson(true)}
                className="btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create First Lesson
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="card hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getLessonStatusIcon(lesson)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {index + 1}. {lesson.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lesson.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          lesson.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lesson.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                      
                      {/* Content Format Progress */}
                      {lesson.contentFormats && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <span>Content Formats</span>
                            <span>{getCompletionPercentage(lesson)}% complete</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getCompletionPercentage(lesson)}%` }}
                            />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(lesson.contentFormats).map(([format, data]) => (
                              <span
                                key={format}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  data.completed 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {format.charAt(0).toUpperCase() + format.slice(1)}
                                {data.completed && <CheckCircleIcon className="h-3 w-3 ml-1" />}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {lesson.estimatedDuration}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      {lesson.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleViewLesson(lesson)}
                          className="flex-1 btn-primary text-sm"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Lesson
                        </button>
                      )}
                      <button
                        onClick={() => handleStartContentCreation(lesson)}
                        className="flex-1 btn-secondary text-sm"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        {lesson.status === 'DRAFT' ? 'Start Content Creation' : 'Edit Content'}
                      </button>
                      <button
                        onClick={() => console.log('Edit lesson:', lesson.id)}
                        className="flex-1 btn-gray text-sm"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit Lesson
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
            <button
              onClick={() => setShowCreateLesson(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Content
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No content yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create lessons to generate content for this course.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateLesson(true)}
                  className="btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create First Lesson
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <div key={item.id} className="card hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.type}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {item.metadata?.estimatedDuration || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => console.log('View content:', item.id)}
                        className="flex-1 btn-secondary text-sm"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => console.log('Edit content:', item.id)}
                        className="flex-1 btn-primary text-sm"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <NewLessonCreation
        isOpen={showCreateLesson}
        onClose={() => setShowCreateLesson(false)}
        onSuccess={handleLessonCreated}
        courseId={course.id}
        courseTitle={course.title}
      />

      <StepByStepContentBuilder
        isOpen={showContentBuilder}
        onClose={() => setShowContentBuilder(false)}
        onSuccess={handleContentBuilderCompleted}
        lesson={selectedLesson}
        course={course}
      />
    </div>
  );
}


