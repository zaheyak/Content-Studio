import { useState, useRef } from 'react';
import { 
  PlayIcon, 
  ArrowUpTrayIcon as UploadIcon, 
  MicrophoneIcon,
  VideoCameraIcon,
  TrashIcon,
  CheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { theme } from '../../theme';

export default function VideoContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [isProcessingYouTube, setIsProcessingYouTube] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Upload file to backend
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://content-studio-production-76b6.up.railway.app'}/api/upload/videos?lessonId=${lesson.id}`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          setUploadedFile(result.data);
          // Simulate transcription
          setIsTranscribing(true);
          setTimeout(() => {
            setTranscription(`Transcription of ${result.data.name}:\n\n[This is a simulated transcription. In a real application, this would be processed by an AI transcription service.]`);
            setIsTranscribing(false);
            setIsCompleted(true);
          }, 2000);
        } else {
          console.error('Upload failed:', await response.text());
          // Fallback to local storage
          setUploadedFile(file);
          setIsTranscribing(true);
          setTimeout(() => {
            setTranscription(`Transcription of ${file.name}:\n\n[This is a simulated transcription. In a real application, this would be processed by an AI transcription service.]`);
            setIsTranscribing(false);
            setIsCompleted(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Upload error:', error);
        // Fallback to local storage
        setUploadedFile(file);
        setIsTranscribing(true);
        setTimeout(() => {
          setTranscription(`Transcription of ${file.name}:\n\n[This is a simulated transcription. In a real application, this would be processed by an AI transcription service.]`);
          setIsTranscribing(false);
          setIsCompleted(true);
        }, 2000);
      }
    }
  };

  const handleAvatarGeneration = async () => {
    if (!avatarPrompt.trim()) return;
    
    setIsGeneratingAvatar(true);
    
    // Simulate AI avatar video generation
    setTimeout(() => {
      setGeneratedContent({
        type: 'avatar',
        prompt: avatarPrompt,
        duration: '2:30',
        status: 'generated',
        url: 'https://example.com/avatar-video.mp4'
      });
      setIsGeneratingAvatar(false);
      setIsCompleted(true);
    }, 3000);
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYouTubeProcessing = async (url) => {
    if (!url.trim()) return;
    
    setIsProcessingYouTube(true);
    
    // Extract video ID from URL
    const videoId = extractYouTubeId(url);
    
    if (!videoId) {
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      setIsProcessingYouTube(false);
      return;
    }
    
    // Simulate YouTube video processing
    setTimeout(() => {
      setGeneratedContent({
        type: 'youtube',
        videoId: videoId,
        url: url,
        title: 'YouTube Video Title',
        duration: '5:45',
        status: 'processed',
        embedUrl: `https://www.youtube.com/embed/${videoId}`
      });
      setIsCompleted(true);
      setIsProcessingYouTube(false);
    }, 2000);
  };

  const handleComplete = () => {
    const content = {
      type: 'video',
      method: activeTab,
      data: activeTab === 'upload' ? {
        file: uploadedFile,
        transcription: transcription
      } : activeTab === 'avatar' ? {
        prompt: avatarPrompt,
        generated: generatedContent
      } : {
        videoId: generatedContent?.videoId,
        url: generatedContent?.url,
        embedUrl: generatedContent?.embedUrl,
        title: generatedContent?.title,
        duration: generatedContent?.duration,
        processed: generatedContent
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
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    tabButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      borderRadius: theme.borderRadius.medium,
      border: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '120px',
      textAlign: 'center'
    },
    tabButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
      color: theme.colors.primary
    },
    tabButtonHover: {
      backgroundColor: theme.colors.borderLight,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.small
    },
    tabIcon: {
      width: '1.5rem',
      height: '1.5rem',
      marginBottom: '0.5rem'
    },
    tabLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      margin: 0
    },
    contentArea: {
      marginBottom: '1.5rem'
    },
    uploadArea: {
      border: `2px dashed ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: theme.colors.surface,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    uploadAreaHover: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}05`
    },
    uploadIcon: {
      width: '2rem',
      height: '2rem',
      color: theme.colors.textSecondary,
      marginBottom: '1rem'
    },
    uploadText: {
      fontSize: '1rem',
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: '0.5rem'
    },
    uploadSubtext: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary
    },
    fileInput: {
      display: 'none'
    },
    avatarPrompt: {
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
    avatarPromptFocus: {
      borderColor: theme.colors.primary
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
    youtubeInput: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      fontSize: '0.875rem',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    youtubeInputFocus: {
      borderColor: theme.colors.primary
    },
    processButton: {
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
      transition: 'background-color 0.3s ease',
      marginTop: '1rem'
    },
    processButtonHover: {
      backgroundColor: theme.colors.successHover
    },
    generatedContent: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      padding: '1rem',
      marginTop: '1rem'
    },
    contentTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '0.5rem'
    },
    contentText: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      whiteSpace: 'pre-wrap',
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
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: theme.colors.textSecondary,
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Video Content Creation</h3>
        <p style={styles.subtitle}>
          Add video content to your lesson. Choose between AI-assisted creation or manual upload.
        </p>
      </div>

      {/* Method Selection */}
      <div style={styles.tabContainer}>
        <div style={styles.tabButtons}>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'upload' ? styles.tabButtonActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'upload') {
                e.target.style.backgroundColor = styles.tabButtonHover.backgroundColor;
                e.target.style.transform = styles.tabButtonHover.transform;
                e.target.style.boxShadow = styles.tabButtonHover.boxShadow;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'upload') {
                e.target.style.backgroundColor = styles.tabButton.backgroundColor;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <UploadIcon style={styles.tabIcon} />
            <span style={styles.tabLabel}>Manual Upload</span>
          </button>
          
          <button
            onClick={() => setActiveTab('avatar')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'avatar' ? styles.tabButtonActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'avatar') {
                e.target.style.backgroundColor = styles.tabButtonHover.backgroundColor;
                e.target.style.transform = styles.tabButtonHover.transform;
                e.target.style.boxShadow = styles.tabButtonHover.boxShadow;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'avatar') {
                e.target.style.backgroundColor = styles.tabButton.backgroundColor;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <SparklesIcon style={styles.tabIcon} />
            <span style={styles.tabLabel}>AI Avatar</span>
          </button>
          
          <button
            onClick={() => setActiveTab('youtube')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'youtube' ? styles.tabButtonActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'youtube') {
                e.target.style.backgroundColor = styles.tabButtonHover.backgroundColor;
                e.target.style.transform = styles.tabButtonHover.transform;
                e.target.style.boxShadow = styles.tabButtonHover.boxShadow;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'youtube') {
                e.target.style.backgroundColor = styles.tabButton.backgroundColor;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <PlayIcon style={styles.tabIcon} />
            <span style={styles.tabLabel}>YouTube Link</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        {activeTab === 'upload' && (
          <div>
            <div
              style={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => {
                e.target.style.borderColor = styles.uploadAreaHover.borderColor;
                e.target.style.backgroundColor = styles.uploadAreaHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.backgroundColor = theme.colors.surface;
              }}
            >
              <UploadIcon style={styles.uploadIcon} />
              <div style={styles.uploadText}>Click to upload video file</div>
              <div style={styles.uploadSubtext}>MP4, MOV, AVI files supported</div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              style={styles.fileInput}
            />
            
            {uploadedFile && (
              <div style={styles.generatedContent}>
                <div style={styles.contentTitle}>Uploaded File:</div>
                <div style={styles.contentText}>{uploadedFile.name}</div>
                {isTranscribing && (
                  <div style={styles.loading}>
                    <div>Transcribing video...</div>
                  </div>
                )}
                {transcription && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={styles.contentTitle}>Transcription:</div>
                    <div style={styles.contentText}>{transcription}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'avatar' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
                Describe the video content you want to generate:
              </label>
              <textarea
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
                placeholder="Describe the educational content, presentation style, and key points you want the AI avatar to cover..."
                style={styles.avatarPrompt}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.avatarPromptFocus.borderColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                }}
              />
            </div>
            
            <button
              onClick={handleAvatarGeneration}
              disabled={!avatarPrompt.trim() || isGeneratingAvatar}
              style={{
                ...styles.generateButton,
                ...(isGeneratingAvatar || !avatarPrompt.trim() ? styles.generateButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!isGeneratingAvatar && avatarPrompt.trim()) {
                  e.target.style.backgroundColor = styles.generateButtonHover.backgroundColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!isGeneratingAvatar && avatarPrompt.trim()) {
                  e.target.style.backgroundColor = styles.generateButton.backgroundColor;
                }
              }}
            >
              <SparklesIcon style={styles.icon} />
              {isGeneratingAvatar ? 'Generating Avatar Video...' : 'Generate Avatar Video'}
            </button>

            {generatedContent && (
              <div style={styles.generatedContent}>
                <div style={styles.contentTitle}>Generated Avatar Video:</div>
                <div style={styles.contentText}>
                  Prompt: {generatedContent.prompt}
                  Duration: {generatedContent.duration}
                  Status: {generatedContent.status}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'youtube' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
                YouTube Video URL or Video ID:
              </label>
              <input
                type="text"
                value={youtubeVideoId}
                onChange={(e) => setYoutubeVideoId(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or dQw4w9WgXcQ"
                style={styles.youtubeInput}
                onFocus={(e) => {
                  e.target.style.borderColor = styles.youtubeInputFocus.borderColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleYouTubeProcessing(youtubeVideoId);
                  }
                }}
              />
              <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary, marginTop: '0.25rem' }}>
                You can paste a full YouTube URL or just the video ID (e.g., dQw4w9WgXcQ)
              </div>
            </div>
            
            <button
              onClick={() => handleYouTubeProcessing(youtubeVideoId)}
              disabled={!youtubeVideoId.trim() || isProcessingYouTube}
              style={{
                ...styles.processButton,
                ...(isProcessingYouTube || !youtubeVideoId.trim() ? styles.generateButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!isProcessingYouTube && youtubeVideoId.trim()) {
                  e.target.style.backgroundColor = styles.processButtonHover.backgroundColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessingYouTube && youtubeVideoId.trim()) {
                  e.target.style.backgroundColor = styles.processButton.backgroundColor;
                }
              }}
            >
              <PlayIcon style={styles.icon} />
              {isProcessingYouTube ? 'Processing...' : 'Process YouTube Video'}
            </button>

            {generatedContent && (
              <div style={styles.generatedContent}>
                <div style={styles.contentTitle}>Processed YouTube Video:</div>
                <div style={styles.contentText}>
                  Video ID: {generatedContent.videoId}
                  URL: {generatedContent.url}
                  Title: {generatedContent.title}
                  Duration: {generatedContent.duration}
                  Status: {generatedContent.status}
                </div>
                {/* YouTube Preview */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={styles.contentTitle}>Preview:</div>
                  <iframe
                    width="100%"
                    height="315"
                    src={generatedContent.embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: '8px' }}
                  ></iframe>
                </div>
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
          {isCompleted && (
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
              Complete Video
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