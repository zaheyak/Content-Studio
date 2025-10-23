import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  BookOpenIcon,
  PlayIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import NewCourseSetup from '../CourseCreation/NewCourseSetup';
import CourseDetailView from '../CourseDetail/CourseDetailView';

export default function TrainerDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/v1/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed status color function - no publishing status in microservice

  const handleCourseCreated = (newCourse) => {
    setCourses(prev => [newCourse, ...prev]);
    setShowCreateCourse(false);
  };

  const handleEditCourse = (courseId) => {
    console.log('Edit course:', courseId);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    fetchDashboardData(); // Refresh data
  };

  const handleCourseUpdated = (updatedCourse) => {
    setCourses(prev => prev.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  // Show course detail view if a course is selected
  if (selectedCourse) {
    return (
      <CourseDetailView 
        course={selectedCourse}
        onBack={handleBackToCourses}
        onCourseUpdated={handleCourseUpdated}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your courses and create new educational content.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Switch Role
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlayIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Lessons</p>
              <p className="text-2xl font-semibold text-gray-900">
                {courses.reduce((total, course) => total + (course.lessons?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Content Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {courses.reduce((total, course) => total + (course.contents?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Management */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Course Management</h2>
        <p className="text-sm text-gray-600">Create and manage your courses. Add lessons within each course.</p>
      </div>

      {/* Courses List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
          <button
            onClick={() => setShowCreateCourse(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first course.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateCourse(true)}
                className="btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Course
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          {course.lessons?.length || 0} lessons
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {course.metadata?.estimatedDuration || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCourse(course)}
                        className="flex-1 btn-secondary text-sm"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Course
                      </button>
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="flex-1 btn-primary text-sm"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <NewCourseSetup
        isOpen={showCreateCourse}
        onClose={() => setShowCreateCourse(false)}
        onSuccess={handleCourseCreated}
      />
    </div>
  );
}

