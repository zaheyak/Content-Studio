import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  XMarkIcon, 
  PlayIcon, 
  DocumentTextIcon, 
  PresentationChartBarIcon,
  MapIcon,
  CodeBracketIcon,
  PhotoIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { theme } from '../../theme';
import { useApp } from '../../context/AppContext';

// Import content creation components
import VideoContentCreation from './VideoContentCreation';
import TextContentCreation from './TextContentCreation';
import PresentationContentCreation from './PresentationContentCreation';
import MindMapContentCreation from './MindMapContentCreation';
import CodeContentCreation from './CodeContentCreation';
import ImageContentCreation from './ImageContentCreation';

export default function ContentCreationWorkflow({ lesson, course, onClose, onComplete }) {
  const { setShowTemplateSelector } = useApp();
  const [currentFormat, setCurrentFormat] = useState(null);
  const [completedFormats, setCompletedFormats] = useState(new Set());
  const [contentData, setContentData] = useState({
    video: null,
    text: null,
    presentation: null,
    mindmap: null,
    code: null,
    images: null
  });
  const [savedContent, setSavedContent] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  // Load saved content when component mounts
  useEffect(() => {
    loadContentFromBackend();
  }, [lesson.id]);

  const contentFormats = [
    {
      id: 'video',
      name: 'Video',
      icon: PlayIcon,
      description: 'Create engaging video content'
    },
    {
      id: 'text',
      name: 'Text',
      icon: DocumentTextIcon,
      description: 'Write comprehensive text content'
    },
    {
      id: 'presentation',
      name: 'Presentation',
      icon: PresentationChartBarIcon,
      description: 'Design interactive presentations'
    },
    {
      id: 'mindmap',
      name: 'Mind Map',
      icon: MapIcon,
      description: 'Create visual mind maps'
    },
    {
      id: 'code',
      name: 'Code',
      icon: CodeBracketIcon,
      description: 'Generate code examples'
    },
    {
      id: 'images',
      name: 'Images',
      icon: PhotoIcon,
      description: 'Create visual content'
    }
  ];

  const loadContentFromBackend = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/${lesson.id}`);
      if (response.ok) {
        const data = await response.json();
        setContentData(data);
        // Mark formats as completed if they have content
        const completed = new Set();
        Object.keys(data).forEach(key => {
          if (data[key] && data[key] !== null) {
            completed.add(key);
          }
        });
        setCompletedFormats(completed);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const saveContentToBackend = async (content) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/${lesson.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      
      if (response.ok) {
        console.log('Content saved successfully');
        return true;
      } else {
        console.error('Failed to save content');
        return false;
      }
    } catch (error) {
      console.error('Error saving content:', error);
      return false;
    }
  };

  const handleFormatSelect = (formatId) => {
    setCurrentFormat(formatId);
  };

  const handleBackToFormats = () => {
    setCurrentFormat(null);
  };

  const handleContentComplete = (formatId, content) => {
    setContentData(prev => ({
      ...prev,
      [formatId]: content
    }));
    
    setCompletedFormats(prev => new Set([...prev, formatId]));
    
    // Save to backend
    saveContentToBackend({
      ...contentData,
      [formatId]: content
    });
    
    setCurrentFormat(null);
  };

  const handleSaveContent = async () => {
    await saveContentToBackend(contentData);
  };

  const handleFinish = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      onComplete(contentData);
    }, 2000);
  };

  const completedCount = completedFormats.size;
  const totalFormats = contentFormats.length;
  const progressPercentage = (completedCount / totalFormats) * 100;

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
      zIndex: 1000,
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1200px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: theme.colors.text,
      margin: 0,
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: theme.colors.text,
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },
    closeButtonHover: {
      backgroundColor: theme.colors.border,
      color: theme.colors.text,
    },
    progressSection: {
      marginBottom: '24px',
    },
    progressTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '12px',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: theme.colors.border,
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      transition: 'width 0.3s ease',
    },
    progressText: {
      fontSize: '14px',
      color: theme.colors.textSecondary,
    },
    formatsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    formatCard: {
      border: `2px solid ${theme.colors.border}`,
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: theme.colors.surface,
    },
    formatCardCompleted: {
      borderColor: theme.colors.success,
      backgroundColor: `${theme.colors.success}10`,
    },
    formatIcon: {
      width: '32px',
      height: '32px',
      color: theme.colors.primary,
      marginBottom: '12px',
    },
    formatName: {
      fontSize: '16px',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '8px',
    },
    formatDescription: {
      fontSize: '14px',
      color: theme.colors.textSecondary,
      marginBottom: '12px',
    },
    button: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    backButton: {
      backgroundColor: theme.colors.border,
      color: theme.colors.text,
    },
    backButtonHover: {
      backgroundColor: theme.colors.textSecondary,
    },
    finishButton: {
      backgroundColor: theme.colors.primary,
      color: 'white',
    },
    finishButtonDisabled: {
      backgroundColor: theme.colors.border,
      color: theme.colors.textSecondary,
      cursor: 'not-allowed',
    },
    finishButtonHover: {
      backgroundColor: theme.colors.primaryDark,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '24px',
      paddingTop: '16px',
      borderTop: `1px solid ${theme.colors.border}`,
    },
  };

  if (showSuccessMessage) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.text, marginBottom: '16px' }}>
              Content Created Successfully!
            </h3>
            <p style={{ color: theme.colors.textSecondary, marginBottom: '24px' }}>
              Your lesson content has been generated and saved.
            </p>
            <button
              onClick={onClose}
              style={{
                ...styles.button,
                ...styles.finishButton,
                padding: '12px 24px',
                fontSize: '16px',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            Content Creation: {lesson?.title}
          </h3>
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.closeButtonHover.backgroundColor;
              e.target.style.color = styles.closeButtonHover.color;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = styles.closeButton.color;
            }}
          >
            <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {!currentFormat ? (
          <>
            {/* Progress Section */}
            <div style={styles.progressSection}>
              <div style={styles.progressTitle}>
                Content Creation Progress
              </div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${progressPercentage}%`
                  }}
                />
              </div>
              <div style={styles.progressText}>
                {completedCount} of {totalFormats} content types completed
              </div>
            </div>

            {/* Content Format Selection */}
            <div style={styles.formatsGrid}>
              {contentFormats.map((format) => {
                const isCompleted = completedFormats.has(format.id);
                const IconComponent = format.icon;
                
                return (
                  <div
                    key={format.id}
                    onClick={() => handleFormatSelect(format.id)}
                    style={{
                      ...styles.formatCard,
                      ...(isCompleted ? styles.formatCardCompleted : {}),
                      borderColor: isCompleted ? theme.colors.success : theme.colors.border,
                      backgroundColor: isCompleted ? `${theme.colors.success}10` : theme.colors.surface
                    }}
                  >
                    <IconComponent style={styles.formatIcon} />
                    <div style={styles.formatName}>{format.name}</div>
                    <div style={styles.formatDescription}>{format.description}</div>
                    {isCompleted && (
                      <div style={{ color: theme.colors.success, fontSize: '12px', fontWeight: '600' }}>
                        <CheckIcon style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
                        Completed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <div></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleSaveContent}
                  disabled={completedCount === 0}
                  style={{
                    ...styles.button,
                    ...styles.finishButton,
                    ...(completedCount === 0 ? styles.finishButtonDisabled : {})
                  }}
                  onMouseEnter={(e) => {
                    if (completedCount > 0) {
                      e.target.style.backgroundColor = styles.finishButtonHover.backgroundColor;
                      e.target.style.transform = styles.finishButtonHover.transform;
                      e.target.style.boxShadow = styles.finishButtonHover.boxShadow;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (completedCount > 0) {
                      e.target.style.backgroundColor = styles.finishButton.backgroundColor;
                      e.target.style.transform = 'none';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  Save Progress
                </button>
                <button
                  onClick={handleFinish}
                  disabled={completedCount === 0}
                  style={{
                    ...styles.button,
                    ...styles.finishButton,
                    ...(completedCount === 0 ? styles.finishButtonDisabled : {})
                  }}
                  onMouseEnter={(e) => {
                    if (completedCount > 0) {
                      e.target.style.backgroundColor = styles.finishButtonHover.backgroundColor;
                      e.target.style.transform = styles.finishButtonHover.transform;
                      e.target.style.boxShadow = styles.finishButtonHover.boxShadow;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (completedCount > 0) {
                      e.target.style.backgroundColor = styles.finishButton.backgroundColor;
                      e.target.style.transform = 'none';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  Finish
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Content Creation Component */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                onClick={handleBackToFormats}
                style={{
                  ...styles.button,
                  ...styles.backButton
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.backButtonHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.backButton.backgroundColor;
                }}
              >
                <ArrowRightIcon style={{ width: '0.875rem', height: '0.875rem', transform: 'rotate(180deg)' }} />
                Back to Formats
              </button>
            </div>

            <div style={{ minHeight: '400px' }}>
              {currentFormat === 'video' && (
                <VideoContentCreation
                  lesson={lesson}
                  onComplete={(content) => handleContentComplete('video', content)}
                />
              )}
              {currentFormat === 'text' && (
                <TextContentCreation
                  lesson={lesson}
                  onComplete={(content) => handleContentComplete('text', content)}
                />
              )}
              {currentFormat === 'presentation' && (
                <PresentationContentCreation
                  lesson={lesson}
                  onComplete={(content) => handleContentComplete('presentation', content)}
                />
              )}
              {currentFormat === 'mindmap' && (
                <MindMapContentCreation
                  lesson={lesson}
                  onComplete={(content) => handleContentComplete('mindmap', content)}
                />
              )}
              {currentFormat === 'code' && (
                <CodeContentCreation
                  lesson={lesson}
                  onComplete={(content) => handleContentComplete('code', content)}
                />
              )}
              {currentFormat === 'images' && (
                <ImageContentCreation
                  lesson={lesson}
                  onComplete={(content) => handleContentComplete('images', content)}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}