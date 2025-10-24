import { useState } from 'react';
import { 
  MapIcon, 
  SparklesIcon, 
  PlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { theme } from '../../theme';

export default function MindMapContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMindMap, setGeneratedMindMap] = useState(null);

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI mind map generation
    setTimeout(() => {
      const mockMindMap = {
        nodes: [
          { id: '1', label: 'Main Topic', x: 300, y: 200, level: 0 },
          { id: '2', label: 'Subtopic A', x: 150, y: 100, level: 1 },
          { id: '3', label: 'Subtopic B', x: 450, y: 100, level: 1 },
          { id: '4', label: 'Detail 1', x: 100, y: 50, level: 2 },
          { id: '5', label: 'Detail 2', x: 200, y: 50, level: 2 }
        ],
        connections: [
          { from: '1', to: '2' },
          { from: '1', to: '3' },
          { from: '2', to: '4' },
          { from: '2', to: '5' }
        ]
      };
      setGeneratedMindMap(mockMindMap);
      setIsGenerating(false);
    }, 2000);
  };

  const handleComplete = () => {
    const content = {
      type: 'mindmap',
      method: 'ai',
      data: {
        prompt: aiPrompt,
        generated: generatedMindMap
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
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      color: theme.colors.text,
      fontSize: '0.875rem'
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
    textareaFocus: {
      borderColor: theme.colors.primary
    },
    button: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.25rem',
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease'
    },
    buttonHover: {
      backgroundColor: theme.colors.primaryHover
    },
    buttonSecondary: {
      backgroundColor: theme.colors.borderLight,
      color: theme.colors.text
    },
    buttonSecondaryHover: {
      backgroundColor: theme.colors.border
    },
    buttonDanger: {
      backgroundColor: theme.colors.error,
      color: 'white'
    },
    buttonDangerHover: {
      backgroundColor: '#d32f2f'
    },
    mindMapContainer: {
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.surface,
      minHeight: '400px',
      position: 'relative',
      overflow: 'hidden'
    },
    mindMapCanvas: {
      width: '100%',
      height: '400px',
      position: 'relative',
      cursor: 'grab'
    },
    mindMapCanvasDragging: {
      cursor: 'grabbing'
    },
    node: (node, isSelected) => ({
      position: 'absolute',
      left: `${node.x}px`,
      top: `${node.y}px`,
      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
      color: isSelected ? 'white' : theme.colors.text,
      border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      padding: '0.5rem 0.75rem',
      fontSize: '0.8rem',
      fontWeight: '500',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.3s ease',
      minWidth: '80px',
      textAlign: 'center',
      boxShadow: isSelected ? theme.shadows.medium : theme.shadows.small
    }),
    nodeHover: {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows.medium
    },
    connection: {
      position: 'absolute',
      backgroundColor: theme.colors.border,
      height: '2px',
      transformOrigin: 'left center',
      zIndex: 1
    },
    nodeControls: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    nodeList: {
      marginTop: '1rem'
    },
    nodeListItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem',
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      marginBottom: '0.5rem'
    },
    nodeLabel: {
      fontSize: '0.875rem',
      color: theme.colors.text,
      fontWeight: '500'
    },
    nodeActions: {
      display: 'flex',
      gap: '0.5rem'
    },
    generatedMindMap: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      padding: '1rem',
      marginTop: '1rem'
    },
    generatedTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '0.75rem'
    },
    generatedContent: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      lineHeight: '1.5'
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
        <h3 style={styles.title}>Mind Map Content Creation</h3>
        <p style={styles.subtitle}>
          Create visual mind maps to organize concepts and relationships in your lesson.
        </p>
      </div>


      {/* Content Area */}
      <div style={styles.contentArea}>
            <div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Describe your mind map:</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the main topic and key concepts you want to organize in your mind map..."
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
            onClick={handleAIGeneration}
            disabled={isGenerating || !aiPrompt.trim()}
            style={{
              ...styles.button,
              ...(isGenerating || !aiPrompt.trim() ? { backgroundColor: theme.colors.textSecondary, cursor: 'not-allowed' } : {})
            }}
            onMouseEnter={(e) => {
              if (!isGenerating && aiPrompt.trim()) {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!isGenerating && aiPrompt.trim()) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
              }
            }}
          >
            <SparklesIcon style={styles.icon} />
            {isGenerating ? 'Generating Mind Map...' : 'Generate Mind Map'}
          </button>

          {isGenerating && (
            <div style={styles.loading}>
              <div>Creating your mind map...</div>
            </div>
          )}

          {generatedMindMap && (
            <div style={styles.generatedMindMap}>
              <h4 style={styles.generatedTitle}>Generated Mind Map</h4>
              <div style={styles.generatedContent}>
                <p><strong>Nodes:</strong> {generatedMindMap.nodes.length}</p>
                <p><strong>Connections:</strong> {generatedMindMap.connections.length}</p>
                <p><strong>Structure:</strong> Hierarchical mind map with main topic and subtopics</p>
              </div>
            </div>
          )}
        </div>
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
          disabled={!generatedMindMap}
          style={{
            ...styles.completeButton,
            ...(!generatedMindMap ? styles.completeButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (generatedMindMap) {
              e.target.style.backgroundColor = styles.completeButtonHover.backgroundColor;
            }
          }}
          onMouseLeave={(e) => {
            if (generatedMindMap) {
              e.target.style.backgroundColor = styles.completeButton.backgroundColor;
            }
          }}
        >
          <CheckIcon style={styles.icon} /> Complete Mind Map
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