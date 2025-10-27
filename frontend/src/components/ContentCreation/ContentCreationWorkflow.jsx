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
      description: 'Create engaging video content',
      color: '#ef4444'
    },
    {
      id: 'text',
      name: 'Text',
      icon: DocumentTextIcon,
      description: 'Write comprehensive text content',
      color: '#3b82f6'
    },
    {
      id: 'presentation',
      name: 'Presentation',
      icon: PresentationChartBarIcon,
      description: 'Design interactive presentations',
      color: '#8b5cf6'
    },
    {
      id: 'mindmap',
      name: 'Mind Map',
      icon: MapIcon,
      description: 'Create visual mind maps',
      color: '#10b981'
    },
    {
      id: 'code',
      name: 'Code',
      icon: CodeBracketIcon,
      description: 'Generate code examples',
      color: '#f59e0b'
    },
    {
      id: 'images',
      name: 'Images',
      icon: PhotoIcon,
      description: 'Create visual content',
      color: '#ec4899'
    }
  ];

  const loadContentFromBackend = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/lesson/${lesson.id}/full`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setContentData(data.data.content || {});
          // Mark formats as completed if they have content
          const completed = new Set();
          Object.keys(data.data.content || {}).forEach(key => {
            if (data.data.content[key] && data.data.content[key] !== null) {
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

  const handleEditFormat = (formatId) => {
    setCurrentFormat(formatId);
  };

  const handleViewFormat = (formatId, content) => {
    // Create a modal to view content
    const viewModal = document.createElement('div');
    viewModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 80vw;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    `;

    let contentHTML = `<h3>${formatId.charAt(0).toUpperCase() + formatId.slice(1)} Content</h3>`;
    
    if (!content || Object.keys(content).length === 0) {
      contentHTML += `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
          <h4>No Content Available</h4>
          <p>This ${formatId} format doesn't have any content yet.</p>
          <p>Please add content first before viewing.</p>
        </div>
      `;
    } else {
      if (formatId === 'video') {
        // Handle uploaded files
        if (content.files?.length > 0) {
          contentHTML += `<h4>Uploaded Videos:</h4>`;
          content.files.forEach((file, index) => {
            contentHTML += `
              <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">      
                <strong>Video ${index + 1}:</strong> ${file.name}<br>
                <small>Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</small><br>
                <small>Path: ${file.path}</small>
              </div>
            `;
          });
        }

        // Handle YouTube videos
        if (content.videoId) {
          contentHTML += `<h4>YouTube Video:</h4>`;
          contentHTML += `
            <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">        
              <strong>Video ID:</strong> ${content.videoId}<br>
              <strong>Title:</strong> ${content.title || 'YouTube Video'}<br>
              <strong>Duration:</strong> ${content.duration || 'Unknown'}<br>
              <strong>URL:</strong> <a href="${content.url}" target="_blank">${content.url}</a>
            </div>
          `;

          // Add YouTube embed
          if (content.embedUrl) {
            contentHTML += `
              <div style="margin: 1rem 0;">
                <h5>Video Preview:</h5>
                <iframe
                  width="100%"
                  height="315"
                  src="${content.embedUrl}"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  style="border-radius: 8px; max-width: 100%;"
                ></iframe>
              </div>
            `;
          }
        }

        // Handle AI generated content
        if (content.generated) {
          contentHTML += `<h4>AI Generated Content:</h4>`;
          contentHTML += `
            <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; white-space: pre-wrap;">       
              <strong>Prompt:</strong> ${content.generated.prompt || 'N/A'}<br>
              <strong>Duration:</strong> ${content.generated.duration || 'N/A'}<br>
              <strong>Status:</strong> ${content.generated.status || 'N/A'}
            </div>
          `;
        }

        if (content.transcription) {
          contentHTML += `<h4>Transcription:</h4><div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; white-space: pre-wrap;">${content.transcription}</div>`;
        }
      } else if (formatId === 'text') {
        if (content.content) {
          contentHTML += `<h4>Manual Content:</h4><div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; white-space: pre-wrap;">${content.content}</div>`;
        }
        if (content.generated) {
          contentHTML += `<h4>AI Generated Content:</h4><div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; white-space: pre-wrap;">${content.generated}</div>`;
        }
      } else if (formatId === 'presentation') {
        if (content.file) {
          contentHTML += `<h4>Uploaded Presentation:</h4>`;
          contentHTML += `
            <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">        
              <strong>File Name:</strong> ${content.file.name}<br>
              <strong>Size:</strong> ${(content.file.size / 1024 / 1024).toFixed(2)} MB<br>
              <strong>Path:</strong> ${content.file.path}<br>
              <strong>URL:</strong> <a href="${import.meta.env.VITE_API_URL}${content.presentation_url || content.file.path}" target="_blank">View/Download</a>
            </div>
          `;
        } else if (content.slides?.length > 0) {
          contentHTML += `<h4>Slides (${content.slides.length}):</h4>`;
          content.slides.forEach((slide, index) => {
            contentHTML += `
              <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">      
                <strong>Slide ${index + 1}: ${slide.title}</strong><br>
                <div style="margin: 0.5rem 0;">${slide.content}</div>
                <small style="color: #666;">Notes: ${slide.notes}</small>
              </div>
            `;
          });
        } else {
          contentHTML += `<div style="margin: 1rem 0; padding: 1rem; background: #f5f5f5; border-radius: 8px; text-align: center; color: #666;">
            <p>לא הועלתה מצגת עדיין</p>
          </div>`;
        }
      } else if (formatId === 'mindmap') {
        if (content.file) {
          contentHTML += `<h4>Uploaded Mind Map:</h4>`;
          contentHTML += `
            <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">        
              <strong>File Name:</strong> ${content.file.name}<br>
              <strong>Size:</strong> ${(content.file.size / 1024 / 1024).toFixed(2)} MB<br>
              <strong>Path:</strong> ${content.file.path}<br>
              <div style="margin-top: 1rem;">
                <img src="${import.meta.env.VITE_API_URL}${content.mindmap_url || content.file.path}" alt="Mind Map" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">     
              </div>
            </div>
          `;
        } else if (content.nodes?.length > 0) {
          contentHTML += `<h4>Mind Map Nodes (${content.nodes.length}):</h4>`;
          content.nodes.forEach((node, index) => {
            contentHTML += `
              <div style="margin: 0.5rem 0; padding: 0.5rem; background: #f0f8ff; border-radius: 4px;">        
                ${index + 1}. ${node.label} (Level ${node.level})
              </div>
            `;
          });
          if (content.connections?.length > 0) {
            contentHTML += `<h4>Connections (${content.connections.length}):</h4>`;
            content.connections.forEach((conn, index) => {
              contentHTML += `<div style="margin: 0.25rem 0;">${index + 1}. ${conn.from} → ${conn.to}</div>`;    
            });
          }
        } else {
          contentHTML += `<div style="margin: 1rem 0; padding: 1rem; background: #f5f5f5; border-radius: 8px; text-align: center; color: #666;">
            <p>לא הועלתה מפת חשיבה עדיין</p>
          </div>`;
        }
      } else if (formatId === 'code') {
        if (content.code) {
          contentHTML += `<h4>Code (${content.language || 'javascript'}):</h4>`;
          contentHTML += `<pre style="background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 8px; overflow-x: auto;">${content.code}</pre>`;
        }
      } else if (formatId === 'images') {
        if (content.files?.length > 0) {
          contentHTML += `<h4>Uploaded Images (${content.files.length}):</h4>`;
          content.files.forEach((file, index) => {
            const fileName = file.name || 'Unknown file';
            const fileSize = file.size ? (file.size / 1024 / 1024).toFixed(2) : 'Unknown';
            const filePath = file.path || 'No path available';
            const imageUrl = file.url || `${import.meta.env.VITE_API_URL}${filePath}`;
            contentHTML += `
              <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">      
                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                  <div style="flex: 0 0 200px;">
                    <img src="${imageUrl}" alt="${fileName}" style="
                      width: 100%;
                      max-width: 200px;
                      height: auto;
                      border-radius: 8px;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                      object-fit: cover;
                    " onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="display: none; padding: 2rem; text-align: center; background: #f5f5f5; border-radius: 8px; color: #666;">
                      <p>Image could not be loaded</p>
                      <small>URL: ${imageUrl}</small>
                    </div>
                  </div>
                  <div style="flex: 1;">
                    <strong>Image ${index + 1}:</strong> ${fileName}<br>
                    <small>Size: ${fileSize} MB</small><br>
                    <small>Path: ${filePath}</small><br>
                    <small>URL: ${imageUrl}</small>
                  </div>
                </div>
              </div>
            `;
          });
        }
        if (content.generated?.length > 0) {
          contentHTML += `<h4>AI Generated Images (${content.generated.length}):</h4>`;
          content.generated.forEach((img, index) => {
            const imgTitle = img.title || `Generated Image ${index + 1}`;
            const imgUrl = img.url || 'No URL available';
            contentHTML += `
              <div style="margin: 1rem 0; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">      
                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                  <div style="flex: 0 0 200px;">
                    <img src="${imgUrl}" alt="${imgTitle}" style="
                      width: 100%;
                      max-width: 200px;
                      height: auto;
                      border-radius: 8px;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                      object-fit: cover;
                    " onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">     
                    <div style="display: none; padding: 2rem; text-align: center; background: #f5f5f5; border-radius: 8px; color: #666;">
                      <p>Generated image could not be loaded</p>
                      <small>URL: ${imgUrl}</small>
                    </div>
                  </div>
                  <div style="flex: 1;">
                    <strong>Generated Image ${index + 1}:</strong> ${imgTitle}<br>
                    <small>URL: ${imgUrl}</small>
                  </div>
                </div>
              </div>
            `;
          });
        }

        // If no images found, show a message
        if ((!content.files || content.files.length === 0) && (!content.generated || content.generated.length === 0)) {
          contentHTML += `<div style="margin: 1rem 0; padding: 1rem; background: #f5f5f5; border-radius: 8px; text-align: center; color: #666;">
            <p>No images found for this lesson.</p>
            <p>Upload images or generate them with AI to see them here.</p>
          </div>`;
        }
      }
      // Add close button
      contentHTML += `
        <div style="margin-top: 2rem; text-align: right;">
          <button onclick="this.closest('.view-modal').remove()" style="
            background: #667eea;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
          ">Close</button>
        </div>
      `;

      modalContent.innerHTML = contentHTML;

      viewModal.className = 'view-modal';
      viewModal.appendChild(modalContent);
      document.body.appendChild(viewModal);

      // Close on background click
      viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) {
          viewModal.remove();
        }
      });
    }
  };

  const handleBackToFormats = () => {
    setCurrentFormat(null);
  };

  const handleFinish = () => {
    console.log('handleFinish called - completing content creation');
    const allContent = {
      lesson: lesson,
      course: course,
      content: contentData,
      completedFormats: Array.from(completedFormats),
      createdAt: new Date().toISOString()
    };
    console.log('Calling onComplete with:', allContent);
    onComplete(allContent);
  };

  const handleChooseTemplate = () => {
    console.log('Opening template selector...');
    // First complete the content creation, then navigate to template selector
    handleFinish();
    // Navigate to template selector with lesson ID
    navigate(`/template-selector?lessonId=${lesson.id}`);
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
      zIndex: 1000
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      boxShadow: theme.shadows.large,
      maxWidth: '90vw',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderBottom: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: theme.colors.text,
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: theme.colors.textSecondary,
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: theme.borderRadius.small,
      transition: 'all 0.3s ease'
    },
    closeButtonHover: {
      backgroundColor: theme.colors.borderLight,
      color: theme.colors.text
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '1.5rem'
    },
    formatsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    formatCard: {
      padding: '1.25rem',
      borderRadius: theme.borderRadius.medium,
      border: `1px solid ${theme.colors.border}`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      backgroundColor: theme.colors.surface,
      minHeight: '120px'
    },
    formatCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.medium
    },
    formatCardCompleted: {
      borderColor: theme.colors.success,
      backgroundColor: `${theme.colors.success}10`
    },
    formatHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.75rem'
    },
    formatIcon: {
      width: '1.25rem',
      height: '1.25rem'
    },
    formatName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.text,
      margin: 0,
      lineHeight: '1.4'
    },
    formatDescription: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      margin: 0,
      lineHeight: '1.5'
    },
    completedBadge: {
      position: 'absolute',
      top: '0.75rem',
      right: '0.75rem',
      backgroundColor: theme.colors.success,
      color: 'white',
      borderRadius: '50%',
      width: '1.25rem',
      height: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.625rem',
      boxShadow: theme.shadows.small
    },
    progressSection: {
      backgroundColor: theme.colors.borderLight,
      padding: '1rem',
      borderRadius: theme.borderRadius.medium,
      marginBottom: '1.5rem'
    },
    progressTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '0.5rem'
    },
    progressBar: {
      width: '100%',
      height: '0.5rem',
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.small,
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      transition: 'width 0.3s ease'
    },
    progressText: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      marginTop: '0.5rem'
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      borderTop: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: theme.borderRadius.medium,
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    backButton: {
      backgroundColor: theme.colors.borderLight,
      color: theme.colors.text
    },
    backButtonHover: {
      backgroundColor: theme.colors.border
    },
    finishButton: {
      backgroundColor: theme.colors.success,
      color: 'white'
    },
    finishButtonHover: {
      backgroundColor: theme.colors.successHover,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.medium
    },
    finishButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      cursor: 'not-allowed'
    },
    generatedContentPreview: {
      marginTop: '1rem',
      padding: '0.75rem',
      backgroundColor: theme.colors.borderLight,
      borderRadius: theme.borderRadius.small,
      border: `1px solid ${theme.colors.border}`
    },
    previewTitle: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '0.5rem'
    },
    previewContent: {
      fontSize: '0.75rem',
      color: theme.colors.textSecondary,
      lineHeight: '1.4'
    },
    formatActions: {
      marginTop: '1rem',
      display: 'flex',
      gap: '0.5rem'
    },
    editButton: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      border: 'none',
      padding: '0.5rem 0.75rem',
      borderRadius: theme.borderRadius.small,
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      flex: 1
    },
    editButtonHover: {
      backgroundColor: theme.colors.primaryHover
    },
    createButton: {
      backgroundColor: theme.colors.success,
      color: 'white',
      border: 'none',
      padding: '0.5rem 0.75rem',
      borderRadius: theme.borderRadius.small,
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      flex: 1
    },
    createButtonHover: {
      backgroundColor: theme.colors.successHover
    },
    viewButton: {
      backgroundColor: theme.colors.secondary,
      color: 'white',
      border: 'none',
      padding: '0.5rem 0.75rem',
      borderRadius: theme.borderRadius.small,
      fontSize: '0.75rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      flex: 1
    },
    viewButtonHover: {
      backgroundColor: '#6b46c1'
    }
  };

  const completedCount = completedFormats.size;
  const totalFormats = contentFormats.length;
  const progressPercentage = (completedCount / totalFormats) * 100;
  
  // Check if lesson already has content
  const hasExistingContent = completedCount > 0;
  const buttonText = hasExistingContent ? 'Save Content' : 'Create Content';

  const handleSaveContent = async () => {
    // Save all current content to backend
    await saveContentToBackend(contentData);
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

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
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

        <div style={styles.content}>
          {/* Success Message Popup */}
          {showSuccessMessage && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '400px',
                margin: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                textAlign: 'center',
                animation: 'slideDown 0.3s ease-out'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <span style={{ fontSize: '2rem' }}>✅</span>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  Content Saved Successfully!
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '1.5rem'
                }}>
                  All content has been saved to the system
                </p>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  Close
                </button>
              </div>
            </div>
          )}

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
                  const generatedContent = contentData[format.id];

                return (
                    <div
                    key={format.id}
                      style={{
                        ...styles.formatCard,
                        ...(isCompleted ? styles.formatCardCompleted : {}),
                        borderColor: isCompleted ? theme.colors.success : theme.colors.border,
                        backgroundColor: isCompleted ? `${theme.colors.success}10` : theme.colors.surface    
                      }}
                    >
                      {isCompleted && (
                        <div style={styles.completedBadge}>
                          <CheckIcon style={{ width: '0.625rem', height: '0.625rem' }} />
                        </div>
                      )}

                      <div style={styles.formatHeader}>
                        <IconComponent
                          style={{
                            ...styles.formatIcon,
                            color: isCompleted ? theme.colors.success : format.color
                          }}
                        />
                        <h4 style={styles.formatName}>{format.name}</h4>
                      </div>

                      <p style={styles.formatDescription}>
                        {format.description}
                      </p>

                      {/* Show generated content preview */}
                      {isCompleted && generatedContent && (
                        <div style={styles.generatedContentPreview}>
                          <div style={styles.previewTitle}>Generated Content:</div>
                          <div style={styles.previewContent}>
                            {format.id === 'video' && (
                              <div>
                                {generatedContent.files?.length > 0 && (
                                  <div>📹 {generatedContent.files.length} video(s)</div>
                                )}
                                {generatedContent.transcription && (
                                  <div>📝 Transcription available</div>
                                )}
                                {generatedContent.generated && (
                                  <div>🤖 AI-generated content</div>
                                )}
                              </div>
                            )}
                            {format.id === 'text' && (
                              <div>
                                {generatedContent.content && (
                                  <div>📝 Manual content ({generatedContent.content.length} chars)</div>     
                                )}
                                {generatedContent.generated && (
                                  <div>🤖 AI-generated text</div>
                                )}
                              </div>
                            )}
                            {format.id === 'presentation' && (
                              <div>
                                {generatedContent.file ? (
                                  <div>📊 {generatedContent.file.name} uploaded</div>
                                ) : (
                                  <div>📊 No presentation uploaded yet</div>
                                )}
                              </div>
                            )}
                            {format.id === 'mindmap' && (
                              <div>
                                {generatedContent.file ? (
                                  <div>🧠 {generatedContent.file.name} uploaded</div>
                                ) : (
                                  <div>🧠 No mind map uploaded yet</div>
                                )}
                              </div>
                            )}
                            {format.id === 'code' && (
                              <div>
                                💻 {generatedContent.code?.length || 0} characters of code
                              </div>
                            )}
                            {format.id === 'images' && (
                              <div>
                                🖼️ {generatedContent.files?.length || generatedContent.generated?.length || 0} image(s)
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={styles.formatActions}>
                        {isCompleted ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewFormat(format.id, contentData[format.id]);
                              }}
                              style={styles.viewButton}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = styles.viewButtonHover.backgroundColor;
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = styles.viewButton.backgroundColor;
                              }}
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditFormat(format.id);
                              }}
                              style={styles.editButton}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = styles.editButtonHover.backgroundColor;     
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = styles.editButton.backgroundColor;
                              }}
                            >
                              ✏️ Edit
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleFormatSelect(format.id)}
                            style={styles.createButton}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = styles.createButtonHover.backgroundColor;     
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = styles.createButton.backgroundColor;
                            }}
                          >
                            ➕ Create
                          </button>
                        )}
                      </div>
                    </div>
                );
              })}
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
                    course={course}
                    onComplete={(content) => handleContentComplete('video', content)}
                    onNext={() => {}}
                    onPrev={() => {}}
                    isFirstStep={true}
                    isLastStep={true}
                  />
                )}
                {currentFormat === 'text' && (
                  <TextContentCreation
                    lesson={lesson}
                    course={course}
                    onComplete={(content) => handleContentComplete('text', content)}
                    onNext={() => {}}
                    onPrev={() => {}}
                    isFirstStep={true}
                    isLastStep={true}
                  />
                )}
                {currentFormat === 'presentation' && (
                  <PresentationContentCreation
                    lesson={lesson}
                    course={course}
                    onComplete={(content) => handleContentComplete('presentation', content)}
                    onNext={() => {}}
                    onPrev={() => {}}
                    isFirstStep={true}
                    isLastStep={true}
                  />
                )}
                {currentFormat === 'mindmap' && (
                  <MindMapContentCreation
                    lesson={lesson}
                    course={course}
                    onComplete={(content) => handleContentComplete('mindmap', content)}
                    onNext={() => {}}
                    onPrev={() => {}}
                    isFirstStep={true}
                    isLastStep={true}
                  />
                )}
                {currentFormat === 'code' && (
                  <CodeContentCreation
                    lesson={lesson}
                    course={course}
                    onComplete={(content) => handleContentComplete('code', content)}
                    onNext={() => {}}
                    onPrev={() => {}}
                    isFirstStep={true}
                    isLastStep={true}
                  />
                )}
                {currentFormat === 'images' && (
                  <ImageContentCreation
                    lesson={lesson}
                    course={course}
                    onComplete={(content) => handleContentComplete('images', content)}
                    onNext={() => {}}
                    onPrev={() => {}}
                    isFirstStep={true}
                    isLastStep={true}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {!currentFormat && (
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
                <CheckIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                {buttonText}
              </button>

              {completedCount === totalFormats && (
                <button
                  onClick={handleChooseTemplate}
                  style={{
                    ...styles.button,
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#7c3aed';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#8b5cf6';
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <span>📋</span>
                  Choose Template
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}