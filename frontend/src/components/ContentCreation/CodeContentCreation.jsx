import { useState } from 'react';
import { 
  CodeBracketIcon,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { theme } from '../../theme';

export default function CodeContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [manualCode, setManualCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI code generation
    setTimeout(() => {
      const mockCode = `// Generated code for: ${aiPrompt}
function exampleFunction() {
  // This is a simulated code generation
  console.log('Hello, World!');
  
  // Add your implementation here
  return 'Generated code example';
}

// Usage example
const result = exampleFunction();
console.log(result);`;
      
      setGeneratedCode(mockCode);
      setIsGenerating(false);
      setIsCompleted(true);
    }, 2000);
  };

  const handleComplete = () => {
    const content = {
      type: 'code',
      method: activeTab,
      data: activeTab === 'manual' ? {
        code: manualCode,
        language: 'javascript'
      } : {
        prompt: aiPrompt,
        generated: generatedCode,
        language: 'javascript'
      },
      completed: true
    };
    
    onComplete(content);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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
    codeEditor: {
      width: '100%',
      minHeight: '300px',
      padding: '1rem',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      outline: 'none',
      resize: 'vertical',
      transition: 'border-color 0.3s ease'
    },
    codeEditorFocus: {
      borderColor: theme.colors.primary
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
    codeContainer: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      marginTop: '1rem',
      overflow: 'hidden'
    },
    codeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      backgroundColor: theme.colors.borderLight,
      borderBottom: `1px solid ${theme.colors.border}`
    },
    codeTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: theme.colors.text,
      margin: 0
    },
    copyButton: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      border: 'none',
      padding: '0.5rem 0.75rem',
      borderRadius: theme.borderRadius.small,
      fontSize: '0.75rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'background-color 0.3s ease'
    },
    copyButtonHover: {
      backgroundColor: theme.colors.primaryHover
    },
    codeContent: {
      padding: '1rem',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
      overflowX: 'auto'
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
        <h3 style={styles.title}>Code Content Creation</h3>
        <p style={styles.subtitle}>
          Add code examples and exercises to your lesson. Choose between manual writing or AI assistance.
        </p>
      </div>

      {/* Method Selection */}
      <div style={styles.tabContainer}>
        <div style={styles.tabButtons}>
          <button
            onClick={() => setActiveTab('manual')}
            style={styles.tabButton(activeTab === 'manual')}
            onMouseEnter={(e) => {
              if (activeTab !== 'manual') {
                e.target.style.backgroundColor = styles.tabButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'manual') {
                e.target.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            <CodeBracketIcon style={styles.tabIcon} />
            Manual Writing
          </button>
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
            AI Assistance
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        {activeTab === 'manual' ? (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
              Write your code:
            </label>
            <textarea
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter your code here..."
              style={styles.codeEditor}
              onFocus={(e) => {
                e.target.style.borderColor = styles.codeEditorFocus.borderColor;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
              }}
            />
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
                Describe the code you want to generate:
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the functionality, language, and requirements for your code..."
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
              {isGenerating ? 'Generating Code...' : 'Generate Code'}
            </button>

            {isGenerating && (
              <div style={styles.loading}>
                <div>Generating your code...</div>
              </div>
            )}

            {generatedCode && (
              <div style={styles.codeContainer}>
                <div style={styles.codeHeader}>
                  <h4 style={styles.codeTitle}>Generated Code</h4>
                  <button
                    onClick={() => copyToClipboard(generatedCode)}
                    style={styles.copyButton}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = styles.copyButtonHover.backgroundColor;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = styles.copyButton.backgroundColor;
                    }}
                  >
                    <ClipboardDocumentIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                    Copy
                  </button>
                </div>
                <div style={styles.codeContent}>
                  {generatedCode}
                </div>
              </div>
            )}
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
          disabled={!manualCode.trim() && !generatedCode.trim()}
          style={{
            ...styles.completeButton,
            ...(!manualCode.trim() && !generatedCode.trim() ? styles.completeButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (manualCode.trim() || generatedCode.trim()) {
              e.target.style.backgroundColor = styles.completeButtonHover.backgroundColor;
            }
          }}
          onMouseLeave={(e) => {
            if (manualCode.trim() || generatedCode.trim()) {
              e.target.style.backgroundColor = styles.completeButton.backgroundColor;
            }
          }}
        >
          <CheckIcon style={styles.icon} /> Complete Code
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