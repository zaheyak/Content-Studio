import { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  PlayIcon, 
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function LearnerDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const [coursesResponse, contentResponse, enrollmentsResponse] = await Promise.all([
        fetch('http://localhost:3001/api/v1/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/v1/content', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/v1/enrollments', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const coursesData = await coursesResponse.json();
      const contentData = await contentResponse.json();
      const enrollmentsData = await enrollmentsResponse.json();

      if (coursesData.success) {
        setCourses(coursesData.data);
      }
      if (contentData.success) {
        setContent(contentData.data);
      }
      if (enrollmentsData.success) {
        setEnrolledCourses(enrollmentsData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE':
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'TEXT':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'VIDEO':
        return <PlayIcon className="h-5 w-5" />;
      case 'AUDIO':
        return <ClockIcon className="h-5 w-5" />;
      default:
        return <BookOpenIcon className="h-5 w-5" />;
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ course_id: courseId })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh enrolled courses
        fetchDashboardData();
        alert('Successfully enrolled in course!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Error enrolling in course');
    }
  };

  const handleViewContent = (contentId) => {
    // TODO: Implement content viewing
    console.log('Viewing content:', contentId);
    alert('Content viewer coming soon!');
  };

  const handleStartCourse = (courseId) => {
    // TODO: Implement course start functionality
    console.log('Starting course:', courseId);
    alert('Course player coming soon!');
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
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
              Continue your learning journey and discover new courses.
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{enrolledCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{enrolledCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <StarIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Achievements</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'browse'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Browse Courses
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'enrolled'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Content
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'browse' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Available Courses</h2>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {course.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.content?.length || 0} lessons</span>
                    <span>{new Date(course.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEnrollCourse(course.id)}
                      className="flex-1 btn-primary text-sm"
                    >
                      <BookOpenIcon className="h-4 w-4 mr-1" />
                      Enroll
                    </button>
                    <button 
                      onClick={() => handleViewContent(course.id)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'enrolled' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Enrolled Courses</h2>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No enrolled courses</h3>
              <p className="mt-1 text-sm text-gray-500">
                Browse courses to start your learning journey.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {course.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.content?.length || 0} lessons</span>
                    <span>Progress: 0%</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleStartCourse(course.id)}
                      className="flex-1 btn-primary text-sm"
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Continue
                    </button>
                    <button 
                      onClick={() => handleViewContent(course.id)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'content' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Content Library</h2>
          </div>

          {content.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No content available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Content will appear here as you enroll in courses.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <div key={item.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getContentIcon(item.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {item.type.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500">
                      <HeartIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{item.tags?.length || 0} tags</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewContent(item.id)}
                      className="flex-1 btn-primary text-sm"
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => handleViewContent(item.id)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


