import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function NewCourseSetup({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'BEGINNER'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const difficultyLevels = [
    { value: 'BEGINNER', label: 'Beginner', description: 'No prior experience required' },
    { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some experience recommended' },
    { value: 'ADVANCED', label: 'Advanced', description: 'Strong foundation required' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate course creation for microservice
      const newCourse = {
        id: `course_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        author_id: 'current_user',
        metadata: {
          difficulty: formData.difficulty
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate successful creation
      setTimeout(() => {
        onSuccess(newCourse);
        setFormData({
          title: '',
          description: '',
          difficulty: 'BEGINNER'
        });
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Create New Course</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Course Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter course title"
                required
              />
            </div>

            {/* Course Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe what this course covers and what students will learn"
                required
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level *
              </label>
              <div className="space-y-3">
                {difficultyLevels.map((level) => (
                  <label key={level.value} className="flex items-start">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level.value}
                      checked={formData.difficulty === level.value}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

