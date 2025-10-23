import { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function NewLessonCreation({ isOpen, onClose, onSuccess, courseId, courseTitle }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedDuration: '',
    lessonType: 'LECTURE',
    prerequisites: '',
    learningOutcomes: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOutcome, setNewOutcome] = useState('');

  const lessonTypes = [
    { value: 'LECTURE', label: 'Lecture', description: 'Traditional teaching format' },
    { value: 'HANDS_ON', label: 'Hands-on', description: 'Practical exercises and labs' },
    { value: 'DISCUSSION', label: 'Discussion', description: 'Interactive group discussion' },
    { value: 'ASSESSMENT', label: 'Assessment', description: 'Quiz or test' },
    { value: 'PROJECT', label: 'Project', description: 'Project-based learning' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate lesson creation for microservice
      const newLesson = {
        id: `lesson_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        type: 'LESSON',
        course_id: courseId,
        content_data: {
          lessonType: formData.lessonType,
          estimatedDuration: formData.estimatedDuration,
          prerequisites: formData.prerequisites,
          learningOutcomes: formData.learningOutcomes,
          contentFormats: {
            video: { completed: false, required: true },
            text: { completed: false, required: true },
            presentation: { completed: false, required: true },
            mindmap: { completed: false, required: true },
            code: { completed: false, required: true },
            images: { completed: false, required: true }
          },
          completionStatus: 'IN_PROGRESS'
        },
        tags: ['lesson'],
        metadata: {
          lessonType: formData.lessonType,
          estimatedDuration: formData.estimatedDuration
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate successful creation
      setTimeout(() => {
        onSuccess(newLesson);
        setFormData({
          title: '',
          description: '',
          estimatedDuration: '',
          lessonType: 'LECTURE',
          prerequisites: '',
          learningOutcomes: []
        });
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Error creating lesson');
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

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setFormData({
        ...formData,
        learningOutcomes: [...formData.learningOutcomes, newOutcome.trim()]
      });
      setNewOutcome('');
    }
  };

  const removeOutcome = (index) => {
    setFormData({
      ...formData,
      learningOutcomes: formData.learningOutcomes.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Create New Lesson</h3>
            <p className="text-sm text-gray-500 mt-1">Course: {courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Name *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter lesson name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe what this lesson covers"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lessonType" className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Type *
                </label>
                <select
                  id="lessonType"
                  name="lessonType"
                  value={formData.lessonType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {lessonTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 30 minutes, 1 hour"
                />
              </div>
            </div>

            <div>
              <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="What should students know before this lesson?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Outcomes
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Define what students will be able to do after completing this lesson.
              </p>
              
              <div className="space-y-3">
                {formData.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1 p-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-700">{outcome}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOutcome(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    placeholder="Add a learning outcome..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addOutcome}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


