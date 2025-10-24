import { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { theme } from '../theme';

export default function NewLessonCreation({ isOpen, onClose, onNavigateToContent, courseId, courseTitle }) {
  const { setLessons, setError } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    learningOutcomes: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOutcome, setNewOutcome] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const lessonData = {
        title: formData.title,
        description: formData.description,
        courseId: courseId || '',
        learningOutcomes: formData.learningOutcomes
      };

      const result = await dataService.createLesson(lessonData);
      setLessons(prev => [...prev, result]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        learningOutcomes: []
      });
      
      onClose();
      
      // Navigate to content creation
      if (onNavigateToContent) {
        onNavigateToContent(result);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      setError('Failed to create lesson');
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

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      boxShadow: theme.shadows.large,
      maxWidth: '48rem',
      width: '100%',
      margin: '0 1rem',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderBottom: `1px solid ${theme.colors.border}`
    },
    headerContent: {
      flex: 1
    },
    title: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: theme.colors.text,
      margin: 0
    },
    subtitle: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      marginTop: '0.25rem',
      margin: 0
    },
    closeButton: {
      color: theme.colors.textSecondary,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: theme.borderRadius.small,
      transition: 'color 0.3s ease'
    },
    closeButtonHover: {
      color: theme.colors.text
    },
    form: {
      padding: '1.5rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    inputFocus: {
      borderColor: theme.colors.primary
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      outline: 'none',
      resize: 'vertical',
      transition: 'border-color 0.3s ease'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      outline: 'none',
      backgroundColor: theme.colors.surface,
      cursor: 'pointer',
      transition: 'border-color 0.3s ease'
    },
    outcomesContainer: {
      marginTop: '1rem'
    },
    outcomeItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.75rem'
    },
    outcomeText: {
      flex: 1,
      padding: '0.75rem',
      backgroundColor: theme.colors.borderLight,
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      color: theme.colors.text
    },
    removeButton: {
      color: theme.colors.error,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.25rem',
      borderRadius: theme.borderRadius.small,
      transition: 'color 0.3s ease'
    },
    removeButtonHover: {
      color: '#d32f2f'
    },
    addOutcomeContainer: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '0.75rem'
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      border: 'none',
      padding: '0.75rem 1rem',
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease'
    },
    addButtonHover: {
      backgroundColor: theme.colors.primaryHover
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      marginTop: '2rem'
    },
    button: {
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      borderRadius: theme.borderRadius.medium,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none'
    },
    cancelButton: {
      backgroundColor: theme.colors.borderLight,
      color: theme.colors.text
    },
    cancelButtonHover: {
      backgroundColor: theme.colors.border
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      color: 'white'
    },
    submitButtonHover: {
      backgroundColor: theme.colors.primaryHover
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      cursor: 'not-allowed'
    },
    icon: {
      width: '1.25rem',
      height: '1.25rem'
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h3 style={styles.title}>Create New Lesson</h3>
            <p style={styles.subtitle}>Course: {courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.target.style.color = styles.closeButtonHover.color;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = styles.closeButton.color;
            }}
          >
            <XMarkIcon style={styles.icon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <div style={styles.formGroup}>
              <label htmlFor="title" style={styles.label}>
                Lesson Name *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                }}
                placeholder="Enter lesson name"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="description" style={styles.label}>
                Lesson Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                style={styles.textarea}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                }}
                placeholder="Describe what this lesson covers"
              />
            </div>


            <div style={styles.formGroup}>
              <label style={styles.label}>
                Learning Outcomes
              </label>
              <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, marginBottom: '1rem' }}>
                Define what students will be able to do after completing this lesson.
              </p>
              
              <div style={styles.outcomesContainer}>
                {formData.learningOutcomes.map((outcome, index) => (
                  <div key={index} style={styles.outcomeItem}>
                    <div style={styles.outcomeText}>
                      <span>{outcome}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOutcome(index)}
                      style={styles.removeButton}
                      onMouseEnter={(e) => {
                        e.target.style.color = styles.removeButtonHover.color;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = styles.removeButton.color;
                      }}
                    >
                      <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>
                ))}
                
                <div style={styles.addOutcomeContainer}>
                  <input
                    type="text"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    placeholder="Add a learning outcome..."
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = styles.inputFocus.borderColor;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.border;
                    }}
                  />
                  <button
                    type="button"
                    onClick={addOutcome}
                    style={styles.addButton}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = styles.addButtonHover.backgroundColor;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = styles.addButton.backgroundColor;
                    }}
                  >
                    <PlusIcon style={styles.icon} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...styles.button,
                ...styles.cancelButton
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.cancelButtonHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.cancelButton.backgroundColor;
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                ...styles.submitButton,
                ...(isSubmitting ? styles.submitButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = styles.submitButton.backgroundColor;
                }
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
