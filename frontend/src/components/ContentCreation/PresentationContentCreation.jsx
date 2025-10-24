import { useState } from 'react';
import { 
  PresentationChartBarIcon,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { theme } from '../../theme';

export default function PresentationContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI slide generation
    setTimeout(() => {
      const slides = [
        { id: 1, title: 'Introduction', content: 'Welcome to this lesson', notes: 'Start with enthusiasm' },
        { id: 2, title: 'Key Concepts', content: 'Main learning points', notes: 'Focus on understanding' },
        { id: 3, title: 'Examples', content: 'Practical examples', notes: 'Show real applications' },
        { id: 4, title: 'Summary', content: 'Key takeaways', notes: 'Reinforce learning' }
      ];
      setGeneratedSlides(slides);
      setIsGenerating(false);
      setIsCompleted(true);
    }, 2000);
  };

  const handleComplete = () => {
    const content = {
      type: 'presentation',
      method: activeTab,
      data: {
        prompt: aiPrompt,
        slides: generatedSlides,
        slideCount: generatedSlides.length
      },
      completed: true
    };
    
    onComplete(content);
  };

  const styles = {
    container: {
      padding: '1.5rem',
      height: '100%',
      overflowY: 'auto',
      backgroundColor: theme.colors.background
    },
    header: {
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary
    },
    tabContainer: {
      marginBottom: '1.5rem'
    },
    tabButtons: {
      display: 'flex',
      gap: '1rem'
    },
    tabButton: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderRadius: theme.borderRadius.medium,
      border: `1px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
      backgroundColor: isActive ? `${theme.colors.primary}10` : theme.colors.surface,
      color: isActive ? theme.colors.primary : theme.colors.text,
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }),
    tabButtonHover: {
      backgroundColor: theme.colors.borderLight
    },
    tabIcon: {
      width: '1.25rem',
      height: '1.25rem',
      marginRight: '0.5rem'
    },
    contentArea: {
      marginBottom: '1.5rem'
    },
    promptInput: {
      width: '100%',
      minHeight: '100px',
      padding: '0.75rem',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    promptInputFocus: {
      borderColor: theme.colors.primary
    },
    generateButton: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.25rem',
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease',
      marginTop: '1rem'
    },
    generateButtonHover: {
      backgroundColor: theme.colors.primaryHover
    },
    generateButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      cursor: 'not-allowed'
    },
    slidesContainer: {
      marginTop: '1.5rem'
    },
    slidesTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '1rem'
    },
    slidesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem'
    },
    slideCard: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      padding: '1rem',
      transition: 'all 0.3s ease'
    },
    slideCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.medium
    },
    slideHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.75rem'
    },
    slideNumber: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      borderRadius: '50%',
      width: '1.5rem',
      height: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    slideTitle: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: theme.colors.text,
      margin: 0
    },
    slideContent: {
      fontSize: '0.8rem',
      color: theme.colors.textSecondary,
      marginBottom: '0.5rem',
      lineHeight: '1.4'
    },
    slideNotes: {
      fontSize: '0.75rem',
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      backgroundColor: theme.colors.borderLight,
      padding: '0.5rem',
      borderRadius: theme.borderRadius.small,
      marginTop: '0.5rem'
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: `1px solid ${theme.colors.border}`
    },
    navButton: (isPrimary) => ({
      backgroundColor: isPrimary ? theme.colors.primary : theme.colors.borderLight,
      color: isPrimary ? 'white' : theme.colors.text,
      border: 'none',
      padding: '0.75rem 1.25rem',
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease'
    }),
    navButtonHover: {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows.small
    },
    completeButton: {
      backgroundColor: theme.colors.success,
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.25rem',
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease'
    },
    completeButtonHover: {
      backgroundColor: theme.colors.successHover
    },
    completeButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      cursor: 'not-allowed'
    },
    icon: {
      width: '1.25rem',
      height: '1.25rem'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: theme.colors.textSecondary,
      fontSize: '0.875rem',
      marginTop: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Presentation Content Creation</h3>
        <p style={styles.subtitle}>
          Generate slides and visual aids for your lesson using AI assistance.
        </p>
      </div>

      {/* Method Selection */}
      <div style={styles.tabContainer}>
        <div style={styles.tabButtons}>
          <button
            onClick={() => setActiveTab('ai')}
            style={styles.tabButton(activeTab === 'ai')}
            onMouseEnter={(e) => {
              if (activeTab !== 'ai') {
                e.target.style.backgroundColor = styles.tabButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'ai') {
                e.target.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            <SparklesIcon style={styles.tabIcon} />
            AI Generation
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
            Describe your presentation content:
          </label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe the key topics, learning objectives, and structure for your presentation slides..."
            style={styles.promptInput}
            onFocus={(e) => {
              e.target.style.borderColor = styles.promptInputFocus.borderColor;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border;
            }}
          />
        </div>
        
        <button
          onClick={handleAiGeneration}
          disabled={isGenerating || !aiPrompt.trim()}
          style={{
            ...styles.generateButton,
            ...(isGenerating || !aiPrompt.trim() ? styles.generateButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (!isGenerating && aiPrompt.trim()) {
              e.target.style.backgroundColor = styles.generateButtonHover.backgroundColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating && aiPrompt.trim()) {
              e.target.style.backgroundColor = styles.generateButton.backgroundColor;
            }
          }}
        >
          <SparklesIcon style={styles.icon} />
          {isGenerating ? 'Generating Slides...' : 'Generate Presentation'}
        </button>

        {isGenerating && (
          <div style={styles.loading}>
            <div>Creating your presentation slides...</div>
          </div>
        )}

        {generatedSlides.length > 0 && (
          <div style={styles.slidesContainer}>
            <h4 style={styles.slidesTitle}>Generated Slides ({generatedSlides.length})</h4>
            <div style={styles.slidesGrid}>
              {generatedSlides.map((slide) => (
                <div
                  key={slide.id}
                  style={styles.slideCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = styles.slideCardHover.transform;
                    e.currentTarget.style.boxShadow = styles.slideCardHover.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={styles.slideHeader}>
                    <div style={styles.slideNumber}>{slide.id}</div>
                    <h5 style={styles.slideTitle}>{slide.title}</h5>
                  </div>
                  <div style={styles.slideContent}>{slide.content}</div>
                  <div style={styles.slideNotes}>
                    <strong>Notes:</strong> {slide.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          onClick={onPrev}
          disabled={isFirstStep}
          style={styles.navButton(false)}
          onMouseEnter={(e) => {
            if (!isFirstStep) {
              e.target.style.transform = styles.navButtonHover.transform;
              e.target.style.boxShadow = styles.navButtonHover.boxShadow;
            }
          }}
          onMouseLeave={(e) => {
            if (!isFirstStep) {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          <ArrowLeftIcon style={styles.icon} /> Previous
        </button>
        
        <button
          onClick={handleComplete}
          disabled={!isCompleted}
          style={{
            ...styles.completeButton,
            ...(!isCompleted ? styles.completeButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (isCompleted) {
              e.target.style.backgroundColor = styles.completeButtonHover.backgroundColor;
            }
          }}
          onMouseLeave={(e) => {
            if (isCompleted) {
              e.target.style.backgroundColor = styles.completeButton.backgroundColor;
            }
          }}
        >
          <CheckIcon style={styles.icon} /> Complete Presentation
        </button>
        
        <button
          onClick={onNext}
          disabled={isLastStep}
          style={styles.navButton(true)}
          onMouseEnter={(e) => {
            if (!isLastStep) {
              e.target.style.backgroundColor = styles.navButtonHover.backgroundColor;
              e.target.style.transform = styles.navButtonHover.transform;
              e.target.style.boxShadow = styles.navButtonHover.boxShadow;
            }
          }}
          onMouseLeave={(e) => {
            if (!isLastStep) {
              e.target.style.backgroundColor = styles.navButtonPrimary.backgroundColor;
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          Next <ArrowRightIcon style={styles.icon} />
        </button>
      </div>
    </div>
  );
}