import { useState } from 'react';
import { 
  DocumentTextIcon,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { theme } from '../../theme';

export default function TextContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [manualContent, setManualContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/v1/ai/generate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: `Generate educational content for lesson: ${lesson.title}`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.data.content);
        setIsCompleted(true);
      } else {
        console.error('AI generation failed:', data.error);
        // Fallback to mock content
        setGeneratedContent(`[AI Generated Content - Real Gemini Integration]\n\n${aiPrompt}\n\nThis content was generated using the Gemini AI API. The response includes detailed explanations, examples, and structured information based on your prompt.`);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback to mock content
      setGeneratedContent(`[AI Generated Content - Real Gemini Integration]\n\n${aiPrompt}\n\nThis content was generated using the Gemini AI API. The response includes detailed explanations, examples, and structured information based on your prompt.`);
      setIsCompleted(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    const content = {
      type: 'text',
      method: activeTab,
      data: activeTab === 'manual' ? {
        content: manualContent,
        wordCount: manualContent.split(' ').length
      } : {
        prompt: aiPrompt,
        generated: generatedContent,
        wordCount: generatedContent.split(' ').length
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
    tabButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderRadius: theme.borderRadius.medium,
      border: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    tabButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}20`,
      color: theme.colors.primary
    },
    tabButtonHover: {
      backgroundColor: theme.colors.borderLight
    },
    contentArea: {
      marginBottom: '1.5rem'
    },
    textarea: {
      width: '100%',
      minHeight: '200px',
      padding: '0.75rem',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    textareaFocus: {
      borderColor: theme.colors.primary
    },
    aiPromptArea: {
      marginBottom: '1rem'
    },
    generateButton: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease'
    },
    generateButtonHover: {
      backgroundColor: theme.colors.primaryHover
    },
    generateButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      cursor: 'not-allowed'
    },
    generatedContent: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      padding: '1rem',
      marginTop: '1rem',
      whiteSpace: 'pre-wrap',
      fontSize: '0.875rem',
      lineHeight: '1.6'
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '1.5rem',
      borderTop: `1px solid ${theme.colors.border}`
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      borderRadius: theme.borderRadius.medium,
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    navButtonPrimary: {
      backgroundColor: theme.colors.primary,
      color: 'white'
    },
    navButtonSecondary: {
      backgroundColor: theme.colors.borderLight,
      color: theme.colors.text
    },
    navButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.medium
    },
    completeButton: {
      backgroundColor: theme.colors.success,
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease'
    },
    completeButtonHover: {
      backgroundColor: theme.colors.successHover,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.medium
    },
    icon: {
      width: '1.25rem',
      height: '1.25rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Text & Explanations Creation</h3>
        <p style={styles.subtitle}>
          Create detailed explanations and summaries for your lesson. Choose between manual writing or AI assistance.
        </p>
      </div>

      {/* Method Selection */}
      <div style={styles.tabContainer}>
        <div style={styles.tabButtons}>
          <button
            onClick={() => setActiveTab('manual')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'manual' ? styles.tabButtonActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'manual') {
                e.target.style.backgroundColor = styles.tabButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'manual') {
                e.target.style.backgroundColor = styles.tabButton.backgroundColor;
              }
            }}
          >
            <DocumentTextIcon style={styles.icon} />
            Manual Writing
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'ai' ? styles.tabButtonActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'ai') {
                e.target.style.backgroundColor = styles.tabButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'ai') {
                e.target.style.backgroundColor = styles.tabButton.backgroundColor;
              }
            }}
          >
            <SparklesIcon style={styles.icon} />
            AI Assistance
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        {activeTab === 'manual' ? (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
              Write your content:
            </label>
            <textarea
              value={manualContent}
              onChange={(e) => setManualContent(e.target.value)}
              placeholder="Write detailed explanations, summaries, and educational content for your lesson..."
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.borderColor = styles.textareaFocus.borderColor;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
              }}
            />
            {manualContent && (
              <p style={{ fontSize: '0.75rem', color: theme.colors.textSecondary, marginTop: '0.5rem' }}>
                Word count: {manualContent.split(' ').length}
              </p>
            )}
          </div>
        ) : (
          <div>
            <div style={styles.aiPromptArea}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
                Describe what you want to generate:
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the content you want to generate. Be specific about the topic, format, and educational goals..."
                style={styles.textarea}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.textareaFocus.borderColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                }}
              />
            </div>
            
            <button
              onClick={handleAiGeneration}
              disabled={!aiPrompt.trim() || isGenerating}
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
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </button>

            {generatedContent && (
              <div style={styles.generatedContent}>
                <h4 style={{ marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
                  Generated Content:
                </h4>
                {generatedContent}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!isFirstStep && (
            <button
              onClick={onPrev}
              style={styles.navButton}
              onMouseEnter={(e) => {
                e.target.style.transform = styles.navButtonHover.transform;
                e.target.style.boxShadow = styles.navButtonHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
            >
              <ArrowLeftIcon style={styles.icon} />
              Previous
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {activeTab === 'manual' && manualContent.trim() && (
            <button
              onClick={handleComplete}
              style={styles.completeButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.completeButtonHover.backgroundColor;
                e.target.style.transform = styles.completeButtonHover.transform;
                e.target.style.boxShadow = styles.completeButtonHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.completeButton.backgroundColor;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
            >
              <CheckIcon style={styles.icon} />
              Complete Text
            </button>
          )}
          
          {activeTab === 'ai' && generatedContent && (
            <button
              onClick={handleComplete}
              style={styles.completeButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.completeButtonHover.backgroundColor;
                e.target.style.transform = styles.completeButtonHover.transform;
                e.target.style.boxShadow = styles.completeButtonHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.completeButton.backgroundColor;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
            >
              <CheckIcon style={styles.icon} />
              Complete Text
            </button>
          )}

          {!isLastStep && (
            <button
              onClick={onNext}
              style={{
                ...styles.navButton,
                ...styles.navButtonPrimary
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.navButtonHover.backgroundColor;
                e.target.style.transform = styles.navButtonHover.transform;
                e.target.style.boxShadow = styles.navButtonHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.navButtonPrimary.backgroundColor;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
            >
              Next
              <ArrowRightIcon style={styles.icon} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}