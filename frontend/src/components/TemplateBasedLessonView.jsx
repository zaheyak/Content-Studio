import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TemplateBasedLessonView = () => {
  const { selectedTemplate, selectedLesson, selectedCourse } = useApp();
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const [lessonContent, setLessonContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState(null);

  // Load template from URL parameters
  useEffect(() => {
    const templateId = searchParams.get('template');
    console.log('Template ID from URL:', templateId);
    
    if (templateId) {
      // Define available templates
      const templates = [
        {
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
        {
          id: 'project-based',
          name: 'Project-Based Learning',
          description: 'Hands-on learning through real-world projects',
          formats: [
            { name: 'Project Brief', icon: '📋', order: 1 },
            { name: 'Research', icon: '🔍', order: 2 },
            { name: 'Implementation', icon: '⚙️', order: 3 },
            { name: 'Testing', icon: '🧪', order: 4 },
            { name: 'Documentation', icon: '📝', order: 5 }
          ]
        },
        {
          id: 'microlearning',
          name: 'Microlearning',
          description: 'Bite-sized learning modules for quick consumption',
          formats: [
            { name: 'Quick Video', icon: '⏱️', order: 1 },
            { name: 'Key Points', icon: '💡', order: 2 },
            { name: 'Quiz', icon: '❓', order: 3 },
            { name: 'Summary', icon: '📄', order: 4 }
          ]
        }
      ];
      
      const selectedTemplate = templates.find(t => t.id === templateId);
      if (selectedTemplate) {
        console.log('Found template:', selectedTemplate);
        setTemplate(selectedTemplate);
      } else {
        console.error('Template not found:', templateId);
        setError('Template not found');
      }
    } else if (selectedTemplate) {
      // Use template from context if no URL parameter
      console.log('Using template from context:', selectedTemplate);
      setTemplate(selectedTemplate);
    } else {
      console.error('No template provided');
      setError('No template selected');
    }
  }, [searchParams, selectedTemplate]);

  useEffect(() => {
    const loadLessonContent = async () => {
      // Get lesson ID from URL params or context
      const currentLessonId = lessonId || selectedLesson?.id;
      
      if (!currentLessonId) {
        setError('No lesson ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Load from backend API only
        console.log('Loading content from backend for lesson:', currentLessonId);
        const apiUrl = import.meta.env.VITE_API_URL || 'https://content-studio-production-76b6.up.railway.app';
        const response = await fetch(`${apiUrl}/api/content/lesson/${currentLessonId}/full`);
        
        if (response.ok) {
        const data = await response.json();
        if (data.success) {
            console.log('Loaded content from backend:', data.data);
          setLessonContent(data.data);
            
            // If template is included in the content, use it
            if (data.data.template) {
              console.log('Using template from backend content:', data.data.template);
              setTemplate(data.data.template);
            }
          } else {
            throw new Error('API returned error');
          }
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        console.error('Error loading lesson content from backend:', err);
        console.log('Creating fallback content due to API error...');
        // Create fallback content structure
        const fallbackContent = {
          lessonId: currentLessonId,
          lesson: {
            id: currentLessonId,
            title: 'Sample Lesson',
            description: 'This is a sample lesson with no content yet'
          },
          content: {
            video: null,
            text: null,
            presentation: null,
            mindmap: null,
            code: null,
            images: null
          },
          template: template,
          metadata: {
            totalContent: 0,
            completedContent: 0,
            progress: 0,
            estimatedTime: '0 minutes',
            difficulty: 'beginner'
          }
        };
        setLessonContent(fallbackContent);
      } finally {
        setLoading(false);
      }
    };

    loadLessonContent();
  }, [lessonId, selectedLesson?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Lesson Content</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch your lesson content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Content</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!template || !lessonContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Template Selected</h2>
          <p className="text-gray-600 dark:text-gray-300">Please select a template to view the lesson content.</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Template: {template ? template.name : 'None'}</p>
            <p>Lesson Content: {lessonContent ? 'Loaded' : 'None'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getContentForFormat = (formatName) => {
    // Map template format names to content keys
    const formatMapping = {
      'video': 'video',
      'explanation': 'text',
      'text': 'text',
      'code': 'code',
      'mind map': 'mindmap',
      'mindmap': 'mindmap',
      'image': 'images',
      'images': 'images',
      'presentation': 'presentation'
    };
    
    const formatKey = formatMapping[formatName.toLowerCase()] || formatName.toLowerCase().replace(' ', '');
    const content = lessonContent.content[formatKey];
    
    console.log(`Getting content for format: ${formatName} (key: ${formatKey})`);
    console.log('Content found:', content);
    console.log('Full lesson content:', lessonContent);
    console.log('Lesson content structure:', lessonContent);
    console.log('Content keys available:', Object.keys(lessonContent.content || {}));
    
    // Debug presentation content specifically
    if (formatKey === 'presentation') {
      console.log('Presentation content debug:', {
        hasContent: !!content,
        presentation_url: content?.presentation_url,
        file: content?.file,
        filePath: content?.file?.path
      });
    }
    
    if (!content) {
      console.log(`No content found for format: ${formatName} (key: ${formatKey})`);
      return { 
        title: formatName, 
        content: "No content available for " + formatName,
        hasContent: false,
        rawContent: null
      };
    }
    
    // Handle different content types
    let displayContent = "";
    let hasContent = true;
    
    if (formatKey === 'video') {
      if (content.videoId) {
        // YouTube video
        displayContent = `YouTube Video: ${content.title || 'Video'}\nDuration: ${content.duration || 'Unknown'}\nVideo ID: ${content.videoId}\nURL: ${content.url || `https://www.youtube.com/watch?v=${content.videoId}`}`;
        console.log('Video content found:', content);
      } else if (content.files && content.files.length > 0) {
        // Uploaded video
        displayContent = `Uploaded Video: ${content.files[0].name}\nSize: ${(content.files[0].size / 1024 / 1024).toFixed(2)} MB`;
      } else if (content.generated) {
        // AI generated video
        displayContent = `AI Generated Video\nPrompt: ${content.generated.prompt || 'N/A'}\nDuration: ${content.generated.duration || 'N/A'}`;
      } else {
        displayContent = "Video content available";
      }
    } else if (formatKey === 'text' || formatKey === 'explanation') {
      if (content.generated) {
        displayContent = content.generated;
      } else if (content.content) {
        displayContent = content.content;
      } else {
        displayContent = "Text content available";
        hasContent = false;
      }
    } else if (formatKey === 'presentation') {
      if (content.presentation_url || content.file) {
        const file = content.file || { name: 'Presentation', path: content.presentation_url };
        displayContent = `Uploaded Presentation: ${file.name}`;
      } else if (content.slides && content.slides.length > 0) {
        displayContent = `Presentation with ${content.slides.length} slides:\n\n`;
        content.slides.forEach((slide, index) => {
          displayContent += `Slide ${index + 1}: ${slide.title}\n${slide.content}\n\n`;
        });
      } else {
        displayContent = "No presentation uploaded yet";
        hasContent = false;
      }
    } else if (formatKey === 'mindmap') {
      if (content.mindmap_url || content.file) {
        const file = content.file || { name: 'Mind Map', path: content.mindmap_url };
        displayContent = `Uploaded Mind Map: ${file.name}`;
      } else if (content.nodes && content.nodes.length > 0) {
        displayContent = `Mind Map with ${content.nodes.length} nodes:\n\n`;
        content.nodes.forEach((node, index) => {
          displayContent += `${node.label}\n`;
        });
      } else {
        displayContent = "No mind map uploaded yet";
        hasContent = false;
      }
    } else if (formatKey === 'code') {
      if (content.code) {
        displayContent = `Code (${content.language || 'Unknown language'}):\n\n${content.code}`;
      } else {
        displayContent = "Code content available";
        hasContent = false;
      }
    } else if (formatKey === 'images' || formatKey === 'image') {
      if (content.files && content.files.length > 0) {
        displayContent = `Images (${content.files.length}):\n\n`;
        content.files.forEach((file, index) => {
          displayContent += `${index + 1}. ${file.name} - ${file.description || 'No description'}\n`;
        });
      } else {
        displayContent = "Image content available";
        hasContent = false;
      }
    } else {
      displayContent = content.content || `Content for ${formatName}`;
    }
    
    // Ensure displayContent is always defined
    if (!displayContent) {
      displayContent = `Content for ${formatName}`;
    }
    
    return {
      title: content.title || content.type || formatName,
      content: displayContent,
      hasContent: hasContent,
      rawContent: content
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {lessonContent.lesson?.title || lessonContent.lessonTitle || 'Lesson Title'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Following the <strong>{template.name}</strong> template structure
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
            {lessonContent.lesson?.description || 'Lesson description'}
          </p>
          {lessonContent.metadata && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>⏱️ {lessonContent.metadata.estimatedTime}</span>
              <span>📊 {lessonContent.metadata.progress}% Complete</span>
              <span>🎯 {lessonContent.metadata.difficulty}</span>
            </div>
          )}
        </div>

        {/* Template Structure Indicator */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
            Template Structure: {template.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {template?.formats?.map((format, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {format.order}
                </div>
                <span className="text-xl ml-2">{format.icon}</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                  {format.name}
                </span>
                {index < lessonContent.template.formats.length - 1 && (
                  <div className="w-6 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 mx-2 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Content Organized by Template */}
        <div className="space-y-8">
          {!template?.formats ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Template Not Found</h3>
              <p className="text-gray-600 dark:text-gray-300">No template structure available for this lesson.</p>
            </div>
          ) : (
            template.formats.map((format, index) => {
            const content = getContentForFormat(format.name);
            const formatKey = format.name.toLowerCase().replace(' ', '');
            const displayContent = content.content || '';
            return (
              <div
                key={index}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{format.icon}</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {content.title}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                        {format.name}
                      </span>
                    </div>
                    
                    {/* Content Display */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {console.log('DEBUG - Video check:', { formatKey, hasVideoId: !!content?.videoId, content, rawContent: content?.rawContent })}
                      {formatKey === 'video' && content?.rawContent?.videoId && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2">YouTube Video:</h4>
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎥</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-red-900 dark:text-red-100">
                                  {content.rawContent?.title || 'YouTube Video'}
                                </div>
                                <div className="text-sm text-red-600 dark:text-red-300">
                                  Duration: {content.rawContent?.duration || 'Unknown'} | Video ID: {content.rawContent?.videoId}
                                </div>
                              </div>
                            </div>
                            <iframe
                              width="100%"
                              height="400"
                              src={content.rawContent?.embedUrl || `https://www.youtube.com/embed/${content.rawContent?.videoId}`}
                              title={content.rawContent?.title || "YouTube Video"}
                              frameBorder="0"
                              allowFullScreen
                            ></iframe>
                            <div className="mt-3 flex gap-2">
                              <a
                                href={content.rawContent?.url || `https://www.youtube.com/watch?v=${content.rawContent?.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Watch on YouTube
                              </a>
                              <button
                                onClick={() => {
                                  const url = content.rawContent?.url || `https://www.youtube.com/watch?v=${content.rawContent?.videoId}`;
                                  navigator.clipboard.writeText(url);
                                  alert('Video URL copied to clipboard!');
                                }}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Copy URL
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {formatKey === 'video' && content?.files && content.files.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2">Uploaded Video:</h4>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <video
                              width="100%"
                              height="315"
                              controls
                              className="rounded-lg shadow-lg"
                            >
                              <source
                                src={content.files[0].path}
                                type={content.files[0].type || 'video/mp4'}
                              />
                              Your browser does not support the video tag.
                            </video>
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              {content.files[0].name} ({(content.files[0].size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {console.log('DEBUG - Presentation check:', { formatKey, hasPresentationUrl: !!content?.rawContent?.presentation_url, hasFile: !!content?.rawContent?.file, content })}
                      {formatKey === 'presentation' && (content?.rawContent?.presentation_url || content?.rawContent?.file) && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2">Presentation File:</h4>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-blue-900 dark:text-blue-100">
                                  {content.rawContent?.file?.name || 'Presentation'}
                                </div>
                                <div className="text-sm text-blue-600 dark:text-blue-300">
                                  {content.rawContent?.file?.size ? `${(content.rawContent.file.size / 1024 / 1024).toFixed(2)} MB` : 'Presentation file'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  URL: {content.rawContent?.presentation_url || content.rawContent?.file?.path}
                                </div>
                              </div>
                            <div className="flex gap-2">
                              <a
                                href={content.rawContent?.presentation_url || content.rawContent?.file?.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                📥 Download
                              </a>
                              <button
                                onClick={() => {
                                  const url = content.rawContent?.presentation_url || content.rawContent?.file?.path;
                                  // Try to open with PowerPoint Online
                                  const onlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
                                  window.open(onlineUrl, '_blank');
                                }}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                👁️ View Online
                              </button>
                            </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {console.log('DEBUG - Mindmap check:', { formatKey, hasMindmapUrl: !!content?.rawContent?.mindmap_url, hasFile: !!content?.rawContent?.file, content: content?.rawContent })}
                      {formatKey === 'mindmap' && (content?.rawContent?.mindmap_url || content?.rawContent?.file) && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2">Mind Map Image:</h4>
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🧠</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-green-900 dark:text-green-100">
                                  {content.rawContent?.file?.name || 'Mind Map'}
                                </div>
                                <div className="text-sm text-green-600 dark:text-green-300">
                                  {content.rawContent?.file?.size ? `${(content.rawContent.file.size / 1024 / 1024).toFixed(2)} MB` : 'Mind map image'}
                                </div>
                              </div>
                            </div>
                        <img
                          src={content.rawContent?.mindmap_url || content.rawContent?.file?.path}
                          alt="Mind Map"
                          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                          style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                          </div>
                        </div>
                      )}
                      
                      {/* Text Content */}
                      {(formatKey === 'text' || formatKey === 'explanation') && content && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2">Text Content:</h4>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {content.generated || content.content || 'No text content available'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Code Content */}
                      {formatKey === 'code' && content?.rawContent?.code && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2">Code Content:</h4>
                          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">
                                {content.rawContent?.language || 'javascript'}
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(content.rawContent?.code || '');
                                  alert('Code copied to clipboard!');
                                }}
                                className="text-xs text-gray-400 hover:text-white transition-colors"
                              >
                                📋 Copy
                              </button>
                            </div>
                            <pre className="text-green-400 text-sm leading-relaxed whitespace-pre-wrap">
                              <code>{content.rawContent?.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {/* Images Content */}
                      {formatKey === 'images' && content?.rawContent?.files && content.rawContent.files.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2">Images:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {content.rawContent.files.map((file, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <img
                          src={file.path}
                          alt={file.name}
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {file.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      
                      {/* Only show text content if it's a text format and no other content is displayed */}
                      {(formatKey === 'text' || formatKey === 'explanation') && !content?.presentation_url && !content?.mindmap_url && !content?.files && !content?.code && !content?.videoId && (
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {content.content}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
                        <span>📖</span>
                        {content.hasContent ? `View ${format.name} Content` : `Add ${format.name} Content`}
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
              <span className="flex items-center gap-2">
                <span>✅</span>
                Complete Lesson
                <span>🎉</span>
              </span>
            </button>
            
            <button className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
              <span className="flex items-center gap-2">
                <span>📝</span>
                Edit Content
                <span>✏️</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBasedLessonView;
