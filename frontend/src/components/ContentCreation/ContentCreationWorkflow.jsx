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
      description: 'Upload video for transcription or generate AI avatar video',
      color: '#ef4444',
      bgColor: '#fef2f2'
    },
    {
      id: 'text',
      name: 'Text & Explanations',
      icon: DocumentTextIcon,
      description: 'Generate detailed explanations and summaries',
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    {
      id: 'presentation',
      name: 'Presentation',
      icon: PresentationChartBarIcon,
      description: 'Create slides and presentation materials',
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      id: 'mindmap',
      name: 'Mind Map',
      icon: MapIcon,
      description: 'Generate interactive mind maps',
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    },
    {
      id: 'code',
      name: 'Code Examples',
      icon: CodeBracketIcon,
      description: 'Generate code snippets and examples',
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    {
      id: 'images',
      name: 'Images & Visuals',
      icon: PhotoIcon,
      description: 'Generate images and visual content',
      color: '#ec4899',
      bgColor: '#fdf2f8'
    }
  ];

  const handleFormatSelect = (formatId) => {
    setCurrentFormat(formatId);
  };

  const handleContentComplete = async (formatId, content) => {
    console.log('Content completed for format:', formatId, content);
    const updatedContentData = { ...contentData, [formatId]: content };
    setContentData(updatedContentData);
    setCompletedFormats(prev => new Set([...prev, formatId]));
    
    // Save directly to backend only (no localStorage)
    await saveContentToBackend(updatedContentData);
    
    setCurrentFormat(null);
  };

  // Helper function to upload files to backend
  const uploadFileToBackend = async (file, type, lessonId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('lessonId', lessonId);
    formData.append('type', type);

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://content-studio-backend-production.up.railway.app'}/api/upload/${type}`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      return result.data;
    } else {
      throw new Error(`Failed to upload ${type}: ${await response.text()}`);
    }
  };

  const saveContentToBackend = async (content) => {
    try {
      console.log('Saving content to backend for lesson:', lesson.id);
      
      // Process content and upload files if needed
      const processedContent = {};
      
      for (const [formatId, formatContent] of Object.entries(content)) {
        if (!formatContent) {
          processedContent[formatId] = null;
          continue;
        }

        if (formatId === 'presentation' && formatContent.data?.file) {
          // Check if file is already uploaded (has path property)
          if (formatContent.data.file.path && formatContent.data.file.path.startsWith('/uploads/')) {
            // File already uploaded, use existing data
            processedContent[formatId] = {
              type: 'presentation',
              method: formatContent.method,
              file: formatContent.data.file,
              presentation_url: formatContent.data.presentation_url || formatContent.data.file.path
            };
          } else {
            // Upload presentation file
            const uploadResult = await uploadFileToBackend(formatContent.data.file, 'presentation', lesson.id);
            processedContent[formatId] = {
              type: 'presentation',
              method: formatContent.method,
              file: {
                name: uploadResult.originalName,
                size: uploadResult.size,
                path: uploadResult.path
              },
              presentation_url: uploadResult.path
            };
          }
        } else if (formatId === 'mindmap' && formatContent.data?.file) {
          // Check if file is already uploaded (has path property)
          if (formatContent.data.file.path && formatContent.data.file.path.startsWith('/uploads/')) {
            // File already uploaded, use existing data
            processedContent[formatId] = {
              type: 'mindmap',
              method: formatContent.method,
              file: formatContent.data.file,
              mindmap_url: formatContent.data.mindmap_url || formatContent.data.file.path
            };
          } else {
            // Upload mindmap file
            const uploadResult = await uploadFileToBackend(formatContent.data.file, 'mindmap', lesson.id);
            processedContent[formatId] = {
              type: 'mindmap',
              method: formatContent.method,
              file: {
                name: uploadResult.originalName,
                size: uploadResult.size,
                path: uploadResult.path
              },
              mindmap_url: uploadResult.path
            };
          }
        } else if (formatId === 'images' && formatContent.data?.files) {
          // Check if files are already uploaded
          const uploadedFiles = [];
          for (const file of formatContent.data.files) {
            if (file.path && file.path.startsWith('/uploads/')) {
              // File already uploaded, use existing data
              uploadedFiles.push(file);
            } else {
              // Upload image file
              const uploadResult = await uploadFileToBackend(file, 'images', lesson.id);
              uploadedFiles.push({
                name: uploadResult.originalName,
                size: uploadResult.size,
                path: uploadResult.path
              });
            }
          }
          processedContent[formatId] = {
            type: 'images',
            method: formatContent.method,
            files: uploadedFiles,
            count: uploadedFiles.length
          };
        } else if (formatId === 'video' && formatContent.data?.file) {
          // Check if file is already uploaded (has path property)
          if (formatContent.data.file.path && formatContent.data.file.path.startsWith('/uploads/')) {
            // File already uploaded, use existing data
            processedContent[formatId] = {
              type: 'video',
              method: formatContent.method,
              files: [formatContent.data.file],
              transcription: formatContent.data?.transcription || '',
              generated: formatContent.data?.generated || null,
              // YouTube video data
              videoId: formatContent.data?.videoId || null,
              url: formatContent.data?.url || null,
              embedUrl: formatContent.data?.embedUrl || null,
              title: formatContent.data?.title || null,
              duration: formatContent.data?.duration || null
            };
          } else {
            // Upload video file
            const uploadResult = await uploadFileToBackend(formatContent.data.file, 'videos', lesson.id);
            processedContent[formatId] = {
              type: 'video',
              method: formatContent.method,
              files: [{
                name: uploadResult.originalName,
                size: uploadResult.size,
                path: uploadResult.path
              }],
              transcription: formatContent.data?.transcription || '',
              generated: formatContent.data?.generated || null,
              // YouTube video data
              videoId: formatContent.data?.videoId || null,
              url: formatContent.data?.url || null,
              embedUrl: formatContent.data?.embedUrl || null,
              title: formatContent.data?.title || null,
              duration: formatContent.data?.duration || null
            };
          }
        } else {
          // For text, code, and other non-file content, save directly
          processedContent[formatId] = {
            type: formatId,
            method: formatContent.method,
            content: formatContent.data?.content || '',
            generated: formatContent.data?.generated || '',
            code: formatContent.data?.code || '',
            language: formatContent.data?.language || 'javascript'
          };
        }
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://content-studio-backend-production.up.railway.app'}/api/content/lesson/${lesson.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          courseId: course?.id,
          courseTitle: course?.title,
          content: processedContent,
          template: {
            id: 'learning-flow',
            name: 'Learning Flow',
            description: 'Traditional learning progression from video to practice',
            formats: [
              { name: 'Video', icon: '🎥', order: 1 },
              { name: 'Explanation', icon: '🧾', order: 2 },
              { name: 'Code', icon: '💻', order: 3 },
              { name: 'Mind Map', icon: '🧠', order: 4 },
              { name: 'Image', icon: '🖼️', order: 5 },
              { name: 'Presentation', icon: '📊', order: 6 }
            ]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Content saved to backend successfully:', result);
        setSavedContent(result.data);
        setShowSuccessMessage(true);
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        console.error('Failed to save content to backend:', await response.text());
      }
    } catch (error) {
      console.error('Error saving content to backend:', error);
    }
  };

  const loadContentFromBackend = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://content-studio-backend-production.up.railway.app'}/api/content/lesson/${lesson.id}`);
      if (response.ok) {
        const result = await response.json();
        const lessonContent = result.data;
        setSavedContent(lessonContent);
        
        // Restore content data and completed formats
        const restoredContentData = {};
        const restoredCompletedFormats = new Set();
        
        Object.keys(lessonContent.content || {}).forEach(formatId => {
          if (lessonContent.content[formatId]) {
            restoredContentData[formatId] = lessonContent.content[formatId];
            restoredCompletedFormats.add(formatId);
          }
        });
        
        setContentData(restoredContentData);
        setCompletedFormats(restoredCompletedFormats);
      }
    } catch (error) {
      console.error('Error loading content from backend:', error);
    }
  };

  const handleEditFormat = (formatId) => {
    setCurrentFormat(formatId);
  };

  const handleViewFormat = (formatId, content) => {
    // Debug: Log the content structure
    console.log('Viewing format:', formatId);
    console.log('Content structure:', content);
    
    // Create a view-only modal for the content
    const viewModal = document.createElement('div');
    viewModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      max-width: 80%;
      max-height: 80vh;
      overflow-y: auto;
      padding: 2rem;
    `;
    
    const formatNames = {
      video: 'Video Content',
      text: 'Text Content',
      presentation: 'Presentation Content',
      mindmap: 'Mind Map Content',
      code: 'Code Content',
      images: 'Image Content'
    };
    
    let contentHTML = `<h3>${formatNames[formatId] || 'Content'}</h3>`;
    
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
            <strong>URL:</strong> <a href="${import.meta.env.VITE_API_URL || 'https://content-studio-backend-production.up.railway.app'}${content.presentation_url || content.file.path}" target="_blank">View/Download</a>
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
              <img src="${import.meta.env.VITE_API_URL || 'https://content-studio-backend-production.up.railway.app'}${content.mindmap_url || content.file.path}" alt="Mind Map" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
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
          const imageUrl = file.url || `${import.meta.env.VITE_API_URL || 'https://content-studio-backend-production.up.railway.app'}${filePath}`;
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
    
    modalContent.innerHTML = contentHTML + `
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
    
    viewModal.className = 'view-modal';
    viewModal.appendChild(modalContent);
    document.body.appendChild(viewModal);
    
    // Close on background click
    viewModal.addEventListener('click', (e) => {
      if (e.target === viewModal) {
        viewModal.remove();
      }
    });
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
          {/* Success Message */}
          {showSuccessMessage && (
            <div style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <span style={{ fontWeight: '600' }}>Content saved successfully to backend!</span>
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