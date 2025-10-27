import { useState, useRef } from 'react';
import { 
  PhotoIcon,
  ArrowUpTrayIcon as UploadIcon,
  ArrowDownTrayIcon as DownloadIcon,
  TrashIcon,
  CheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { theme } from '../../theme';

export default function ImageContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      try {
        // Upload files to backend
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://content-studio-production-76b6.up.railway.app'}/api/upload/images`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          setUploadedFiles(prev => [...prev, ...result.data]);
          setIsCompleted(true);
        } else {
          console.error('Upload failed:', await response.text());
        }
      } catch (error) {
        console.error('Upload error:', error);
        // Fallback to local storage
        setUploadedFiles(prev => [...prev, ...files]);
        setIsCompleted(true);
      }
    }
  };

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI image generation
    setTimeout(() => {
      const mockImages = [
        { id: 1, url: 'https://picsum.photos/400/300?random=1', title: 'Generated Image 1' },
        { id: 2, url: 'https://picsum.photos/400/300?random=2', title: 'Generated Image 2' },
        { id: 3, url: 'https://picsum.photos/400/300?random=3', title: 'Generated Image 3' }
      ];
      setGeneratedImages(mockImages);
      setIsGenerating(false);
      setIsCompleted(true);
    }, 3000);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length === 1) {
      setIsCompleted(false);
    }
  };

  const removeGeneratedImage = (id) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
    if (generatedImages.length === 1) {
      setIsCompleted(false);
    }
  };

  const handleComplete = () => {
    const content = {
      type: 'images',
      method: activeTab,
      data: activeTab === 'upload' ? {
        files: uploadedFiles,
        count: uploadedFiles.length
      } : {
        prompt: aiPrompt,
        generated: generatedImages,
        count: generatedImages.length
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
    uploadArea: {
      border: `2px dashed ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: theme.colors.surface,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '1rem'
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
    imagesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    imageCard: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.medium,
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    imageCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.medium
    },
    imagePreview: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      backgroundColor: theme.colors.borderLight
    },
    imageInfo: {
      padding: '0.75rem'
    },
    imageTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: '0.25rem'
    },
    imageSize: {
      fontSize: '0.75rem',
      color: theme.colors.textSecondary
    },
    imageActions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    actionButton: {
      backgroundColor: theme.colors.borderLight,
      color: theme.colors.text,
      border: 'none',
      padding: '0.5rem',
      borderRadius: theme.borderRadius.small,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease',
      flex: 1
    },
    actionButtonHover: {
      backgroundColor: theme.colors.border
    },
    actionButtonDanger: {
      backgroundColor: theme.colors.error,
      color: 'white'
    },
    actionButtonDangerHover: {
      backgroundColor: '#d32f2f'
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
        <h3 style={styles.title}>Image Content Creation</h3>
        <p style={styles.subtitle}>
          Add images and visual content to your lesson. Upload files or generate with AI.
        </p>
      </div>

      {/* Method Selection */}
      <div style={styles.tabContainer}>
        <div style={styles.tabButtons}>
          <button
            onClick={() => setActiveTab('upload')}
            style={styles.tabButton(activeTab === 'upload')}
            onMouseEnter={(e) => {
              if (activeTab !== 'upload') {
                e.target.style.backgroundColor = styles.tabButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'upload') {
                e.target.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            <UploadIcon style={styles.tabIcon} />
            Upload Images
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
            AI Generation
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        {activeTab === 'upload' ? (
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
              <div style={styles.uploadText}>Click to upload images</div>
              <div style={styles.uploadSubtext}>JPG, PNG, GIF files supported</div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              style={styles.fileInput}
            />

            {uploadedFiles.length > 0 && (
              <div style={styles.imagesGrid}>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    style={styles.imageCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = styles.imageCardHover.transform;
                      e.currentTarget.style.boxShadow = styles.imageCardHover.boxShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={file.url || (file instanceof File ? URL.createObjectURL(file) : file.path)}
                      alt={file.name}
                      style={styles.imagePreview}
                    />
                    <div style={styles.imageInfo}>
                      <div style={styles.imageTitle}>{file.name}</div>
                      <div style={styles.imageSize}>
                        {file.size ? (file.size / 1024 / 1024).toFixed(2) : 'Unknown'} MB
                      </div>
                      <div style={styles.imageActions}>
                        <button
                          onClick={() => {
                            const url = file.url || (file instanceof File ? URL.createObjectURL(file) : file.path);
                            window.open(url, '_blank');
                          }}
                          style={styles.actionButton}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = styles.actionButtonHover.backgroundColor;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = styles.actionButton.backgroundColor;
                          }}
                        >
                          <DownloadIcon style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <button
                          onClick={() => removeFile(index)}
                          style={{
                            ...styles.actionButton,
                            ...styles.actionButtonDanger
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = styles.actionButtonDangerHover.backgroundColor;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = styles.actionButtonDanger.backgroundColor;
                          }}
                        >
                          <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: theme.colors.text }}>
                Describe the images you want to generate:
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the visual content, style, and purpose for your lesson images..."
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
              {isGenerating ? 'Generating Images...' : 'Generate Images'}
            </button>

            {isGenerating && (
              <div style={styles.loading}>
                <div>Creating your images...</div>
              </div>
            )}

            {generatedImages.length > 0 && (
              <div style={styles.imagesGrid}>
                {generatedImages.map((image) => (
                  <div
                    key={image.id}
                    style={styles.imageCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = styles.imageCardHover.transform;
                      e.currentTarget.style.boxShadow = styles.imageCardHover.boxShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      style={styles.imagePreview}
                    />
                    <div style={styles.imageInfo}>
                      <div style={styles.imageTitle}>{image.title}</div>
                      <div style={styles.imageSize}>Generated Image</div>
                      <div style={styles.imageActions}>
                        <button
                          onClick={() => window.open(image.url, '_blank')}
                          style={styles.actionButton}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = styles.actionButtonHover.backgroundColor;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = styles.actionButton.backgroundColor;
                          }}
                        >
                          <DownloadIcon style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <button
                          onClick={() => removeGeneratedImage(image.id)}
                          style={{
                            ...styles.actionButton,
                            ...styles.actionButtonDanger
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = styles.actionButtonDangerHover.backgroundColor;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = styles.actionButtonDanger.backgroundColor;
                          }}
                        >
                          <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
          disabled={uploadedFiles.length === 0 && generatedImages.length === 0}
          style={{
            ...styles.completeButton,
            ...(uploadedFiles.length === 0 && generatedImages.length === 0 ? styles.completeButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (uploadedFiles.length > 0 || generatedImages.length > 0) {
              e.target.style.backgroundColor = styles.completeButtonHover.backgroundColor;
            }
          }}
          onMouseLeave={(e) => {
            if (uploadedFiles.length > 0 || generatedImages.length > 0) {
              e.target.style.backgroundColor = styles.completeButton.backgroundColor;
            }
          }}
        >
          <CheckIcon style={styles.icon} /> Complete Images
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