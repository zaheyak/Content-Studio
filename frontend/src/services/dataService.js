// Data service for API calls
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`

export const dataService = {
  // Course management
  async getCourses() {
    const response = await fetch(`${API_BASE_URL}/courses`)
    const data = await response.json()
    return data.data || []
  },

  async createCourse(courseData) {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData)
    })
    const result = await response.json()
    
    if (result.success) {
      return result.data
    } else {
      throw new Error(result.message || 'Failed to create course')
    }
  },

  // Lesson management
  async getLessons() {
    const response = await fetch(`${API_BASE_URL}/lessons`)
    const data = await response.json()
    return data.data || []
  },

  async createLesson(lessonData) {
    const response = await fetch(`${API_BASE_URL}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonData)
    })
    const result = await response.json()
    
    if (result.success) {
      return result.data
    } else {
      throw new Error(result.message || 'Failed to create lesson')
    }
  }
}
