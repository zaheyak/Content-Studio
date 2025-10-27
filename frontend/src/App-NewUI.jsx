import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { 
  Shell, 
  TopNav, 
  Layout, 
  Card, 
  Button, 
  Input, 
  TextArea, 
  Badge,
  Grid,
  Flex,
  EmptyState
} from './components/UI'
import NewLessonCreation from './components/NewLessonCreation'
import ContentCreationWorkflow from './components/ContentCreation/ContentCreationWorkflow'

function App() {
  const [courses, setCourses] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newCourse, setNewCourse] = useState({ title: '', description: '' })
  const [newLesson, setNewLesson] = useState({ title: '', description: '' })
  const [activeTab, setActiveTab] = useState('courses')
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [createdCourseId, setCreatedCourseId] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseLessons, setCourseLessons] = useState([])
  const [showNewLessonModal, setShowNewLessonModal] = useState(false)
  const [showContentCreation, setShowContentCreation] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Mock data for now
      const mockCourses = [
        { id: '1', title: 'JavaScript Fundamentals', description: 'Learn the basics of JavaScript programming' },
        { id: '2', title: 'React Development', description: 'Build modern web applications with React' }
      ]
      const mockLessons = [
        { id: '1', title: 'Variables and Data Types', description: 'Understanding JavaScript variables', courseId: '1' },
        { id: '2', title: 'Functions and Scope', description: 'Working with functions in JavaScript', courseId: '1' }
      ]
      
      setCourses(mockCourses)
      setLessons(mockLessons)
      setLoading(false)
    } catch (err) {
      setError('Failed to load data')
      setLoading(false)
    }
  }

  const createCourse = async (e) => {
    e.preventDefault()
    try {
      const courseData = {
        id: `course_${Date.now()}`,
        title: newCourse.title,
        description: newCourse.description,
        created_at: new Date().toISOString()
      }
      
      setCourses([...courses, courseData])
      setNewCourse({ title: '', description: '' })
      setCreatedCourseId(courseData.id)
      setShowAddLesson(true)
      setError(null)
    } catch (err) {
      setError('Failed to create course')
    }
  }

  const createLesson = async (e) => {
    e.preventDefault()
    try {
      const lessonData = {
        id: `lesson_${Date.now()}`,
        title: newLesson.title,
        description: newLesson.description,
        courseId: createdCourseId || newLesson.courseId || '',
        created_at: new Date().toISOString()
      }
      
      setLessons([...lessons, lessonData])
      setNewLesson({ title: '', description: '' })
      setError(null)
      
      if (showAddLesson) {
        setShowAddLesson(false)
        setCreatedCourseId('')
      }
      
      setSelectedLesson(lessonData)
      setShowContentCreation(true)
    } catch (err) {
      setError('Failed to create lesson')
    }
  }

  const openContentCreation = (lesson) => {
    setSelectedLesson(lesson)
    setShowContentCreation(true)
  }

  const hasLessonContent = (lessonId) => {
    // Content is now managed by backend, not localStorage
    // This function can be used for UI state management if needed
    return false
  }

  const handleLessonCreated = (lesson) => {
    setLessons([...lessons, lesson])
  }

  const closeNewLessonModal = () => {
    setShowNewLessonModal(false)
    setSelectedCourse(null)
  }

  const closeContentCreation = () => {
    setShowContentCreation(false)
    setSelectedLesson(null)
  }

  const handleContentComplete = (result) => {
    console.log('Content completed:', result)
    closeContentCreation()
  }

  const handleNewLesson = () => {
    setShowNewLessonModal(true)
  }

  const handlePublish = () => {
    alert('Publish functionality coming soon!')
  }

  if (loading) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <TopNav onNewLesson={handleNewLesson} onPublish={handlePublish} />
      
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tab Navigation */}
          <Card>
            <Flex gap="0.5rem">
              <Button
                variant={activeTab === 'courses' ? 'solid' : 'ghost'}
                onClick={() => setActiveTab('courses')}
              >
                Courses
              </Button>
              <Button
                variant={activeTab === 'lessons' ? 'solid' : 'ghost'}
                onClick={() => setActiveTab('lessons')}
              >
                Lessons
              </Button>
            </Flex>
          </Card>

          {/* Error Display */}
          {error && (
            <Card style={{ backgroundColor: '#fee2e2', borderColor: '#f87171' }}>
              <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                {error}
              </div>
            </Card>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <Card title="Create New Course" style={{ marginBottom: '1.5rem' }}>
                <form onSubmit={createCourse}>
                  <Grid cols={1} gap="1rem">
                    <Input
                      value={newCourse.title}
                      onChange={(value) => setNewCourse({ ...newCourse, title: value })}
                      placeholder="Course Title"
                    />
                    <TextArea
                      value={newCourse.description}
                      onChange={(value) => setNewCourse({ ...newCourse, description: value })}
                      placeholder="Course Description"
                      rows={3}
                    />
                    <Button type="submit" disabled={!newCourse.title.trim()}>
                      Create Course
                    </Button>
                  </Grid>
                </form>

                {showAddLesson && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
                      Course Created! Add your first lesson:
                    </h3>
                    <form onSubmit={createLesson}>
                      <Grid cols={1} gap="0.75rem">
                        <Input
                          value={newLesson.title}
                          onChange={(value) => setNewLesson({ ...newLesson, title: value })}
                          placeholder="Lesson Title"
                        />
                        <TextArea
                          value={newLesson.description}
                          onChange={(value) => setNewLesson({ ...newLesson, description: value })}
                          placeholder="Lesson Description"
                          rows={2}
                        />
                        <Button type="submit" disabled={!newLesson.title.trim()}>
                          Add Lesson
                        </Button>
                      </Grid>
                    </form>
                  </div>
                )}
              </Card>

              <Grid cols={1} gap="1rem">
                {courses.map((course) => (
                  <Card key={course.id} title={course.title}>
                    <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>
                      {course.description}
                    </p>
                    <Flex justify="space-between" align="center">
                      <Badge tone="blue">
                        {lessons.filter(l => l.courseId === course.id).length} lessons
                      </Badge>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCourse(course)
                          setCourseLessons(lessons.filter(l => l.courseId === course.id))
                          setActiveTab('course-detail')
                        }}
                      >
                        View Course
                      </Button>
                    </Flex>
                  </Card>
                ))}
              </Grid>
            </div>
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div>
              <Card title="All Lessons">
                {lessons.length === 0 ? (
                  <EmptyState
                    title="No lessons yet"
                    description="Create your first lesson to get started."
                    action={<Button onClick={handleNewLesson}>Create Lesson</Button>}
                  />
                ) : (
                  <Grid cols={1} gap="1rem">
                    {lessons.map((lesson) => (
                      <Card key={lesson.id} title={lesson.title}>
                        <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>
                          {lesson.description}
                        </p>
                        <Flex justify="space-between" align="center">
                          <Badge tone="green">
                            {hasLessonContent(lesson.id) ? 'Has Content' : 'No Content'}
                          </Badge>
                          <Button
                            onClick={() => openContentCreation(lesson)}
                          >
                            {hasLessonContent(lesson.id) ? 'Edit Content' : 'Create Content'}
                          </Button>
                        </Flex>
                      </Card>
                    ))}
                  </Grid>
                )}
              </Card>
            </div>
          )}

          {/* Course Detail View */}
          {activeTab === 'course-detail' && selectedCourse && (
            <div>
              <Card title={selectedCourse.title}>
                <p style={{ margin: '0 0 1.5rem 0', color: '#64748b' }}>
                  {selectedCourse.description}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('courses')}
                  style={{ marginBottom: '1.5rem' }}
                >
                  ← Back to Courses
                </Button>
              </Card>

              <Card title="Lessons">
                {courseLessons.length === 0 ? (
                  <EmptyState
                    title="No lessons in this course yet"
                    description="Add your first lesson to get started."
                    action={
                      <Button onClick={() => setShowNewLessonModal(true)}>
                        Add Lesson
                      </Button>
                    }
                  />
                ) : (
                  <Grid cols={1} gap="1rem">
                    {courseLessons.map((lesson) => (
                      <Card key={lesson.id} title={lesson.title}>
                        <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>
                          {lesson.description}
                        </p>
                        <Flex justify="space-between" align="center">
                          <Badge tone="green">
                            {hasLessonContent(lesson.id) ? 'Has Content' : 'No Content'}
                          </Badge>
                          <Button
                            onClick={() => openContentCreation(lesson)}
                          >
                            {hasLessonContent(lesson.id) ? 'Edit Content' : 'Create Content'}
                          </Button>
                        </Flex>
                      </Card>
                    ))}
                  </Grid>
                )}
              </Card>
            </div>
          )}
        </div>
      </Layout>

      {/* Modals */}
      {showNewLessonModal && (
        <NewLessonCreation
          isOpen={showNewLessonModal}
          onClose={closeNewLessonModal}
          onSuccess={handleLessonCreated}
          onNavigateToContent={(lesson) => {
            setSelectedLesson(lesson);
            setShowContentCreation(true);
          }}
          courseId={selectedCourse?.id}
          courseTitle={selectedCourse?.title}
        />
      )}

      {showContentCreation && selectedLesson && (
        <ContentCreationWorkflow
          lesson={selectedLesson}
          course={selectedCourse}
          onClose={closeContentCreation}
          onComplete={handleContentComplete}
        />
      )}
    </Shell>
  )
}

export default App
