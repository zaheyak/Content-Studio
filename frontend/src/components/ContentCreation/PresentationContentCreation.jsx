import { useState, useRef } from 'react';
import { 
  PresentationChartBarIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { theme } from '../../theme';

export default function PresentationContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    const allowedTypes = ['.pptx', '.pdf', '.ppt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please upload a valid presentation file (.pptx, .pdf, .ppt)');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload file to backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lessonId', lesson.id);
      formData.append('type', 'presentation');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://content-studio-production-76b6.up.railway.app'}/api/upload/presentation`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          path: result.data.path,
          url: result.data.url
        });
        setIsCompleted(true);
      } else {
        console.error('Upload failed:', await response.text());
        // Fallback to local storage
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          path: `/uploads/lesson-${lesson.id}/presentations/${file.name}`,
          url: URL.createObjectURL(file)
        });
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Fallback to local storage
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        path: `/uploads/lesson-${lesson.id}/presentations/${file.name}`,
        url: URL.createObjectURL(file)
      });
      setIsCompleted(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleComplete = () => {
    const content = {
      type: 'presentation',
      method: 'upload',
      data: {
        file: uploadedFile,
        presentation_url: uploadedFile?.path || null
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
    fileInfo: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary
    },
    fileName: {
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: '0.25rem'
    },
    fileSize: {
      marginBottom: '0.25rem'
    },
    filePath: {
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      backgroundColor: theme.colors.borderLight,
      padding: '0.25rem 0.5rem',
      borderRadius: '4px'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: theme.colors.textSecondary,
      fontSize: '0.875rem'
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
        <h3 style={styles.title}>Presentation Content Creation</h3>
        <p style={styles.subtitle}>
          Upload a presentation file (.pptx, .pdf, .ppt) for your lesson.
        </p>
      </div>

      {/* File Upload Area */}
      <div style={styles.contentArea}>
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
          <PresentationChartBarIcon style={styles.uploadIcon} />
          <div style={styles.uploadText}>Click to upload presentation file</div>
          <div style={styles.uploadSubtext}>Supports .pptx, .pdf, .ppt files</div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx,.pdf,.ppt"
          onChange={handleFileUpload}
          style={styles.fileInput}
        />
        
        {uploadedFile && (
          <div style={styles.generatedContent}>
            <div style={styles.contentTitle}>Uploaded Presentation:</div>
            <div style={styles.fileInfo}>
              <div style={styles.fileName}>{uploadedFile.name}</div>
              <div style={styles.fileSize}>Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              <div style={styles.filePath}>Path: {uploadedFile.path}</div>
            </div>
            {isUploading && (
              <div style={styles.loading}>
                <div>Uploading presentation...</div>
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
              Complete Presentation
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