// Content Studio Shared Constants

export const CONTENT_TYPES = {
  TEXT: 'text',
  PRESENTATION: 'presentation',
  MINDMAP: 'mindmap',
  AUDIO: 'audio',
  VIDEO: 'video',
  INTERACTIVE: 'interactive'
};

export const LESSON_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const COURSE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
};

export const AI_JOB_TYPES = {
  VIDEO_TO_TRANSCRIPT: 'video_to_transcript',
  GENERATE_LESSON: 'generate_lesson',
  GENERATE_MINDMAP: 'generate_mindmap',
  TRANSLATE: 'translate',
  QUALITY_CHECK: 'quality_check'
};

export const AI_JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const CONTENT_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const API_ENDPOINTS = {
  COURSES: '/api/courses',
  LESSONS: '/api/lessons',
  CONTENT: '/api/content',
  AI: '/api/ai'
};

export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar'
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const SUPPORTED_VIDEO_FORMATS = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'm4a', 'aac'];
export const SUPPORTED_DOCUMENT_FORMATS = ['pdf', 'doc', 'docx', 'txt'];
